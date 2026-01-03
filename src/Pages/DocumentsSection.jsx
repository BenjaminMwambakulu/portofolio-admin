import React from "react";
import {
  saveDocumentsSection,
  getDocumentsSection,
} from "../Services/DocumentsSectionService";
import { saveFileToSupabase } from "../Services/saveFileToSup";

function DocumentsSection() {
  const [resumeFile, setResumeFile] = React.useState(null);
  const [resumeUrl, setResumeUrl] = React.useState(null);
  const [resumeFileName, setResumeFileName] = React.useState("");
  const [cvFile, setCvFile] = React.useState(null);
  const [cvUrl, setCvUrl] = React.useState(null);
  const [cvFileName, setCvFileName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  // Fetch existing documents section data on component mount
  React.useEffect(() => {
    const fetchDocumentsSection = async () => {
      setLoadingData(true);
      try {
        const result = await getDocumentsSection();
        if (result.success && result.data) {
          const data = result.data;
          if (data.resumeUrl) {
            setResumeUrl(data.resumeUrl);
            setResumeFileName(data.resumeFileName || "Resume");
          }
          if (data.cvUrl) {
            setCvUrl(data.cvUrl);
            setCvFileName(data.cvFileName || "CV");
          }
        }
      } catch (err) {
        console.error("Error loading documents section:", err);
        setError("Failed to load existing documents data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchDocumentsSection();
  }, []);

  const handleReset = () => {
    setResumeFile(null);
    setCvFile(null);
    setError(null);
    setSuccess(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let newResumeUrl = resumeUrl;
      let newCvUrl = cvUrl;
      let finalResumeFileName = resumeFileName;
      let finalCvFileName = cvFileName;

      // Upload resume if new file is selected
      if (resumeFile) {
        const uploadResult = await saveFileToSupabase(resumeFile, "documents");
        if (!uploadResult.success) {
          setError(`Resume upload failed: ${uploadResult.error}`);
          setLoading(false);
          return;
        }
        newResumeUrl = uploadResult.url;
        finalResumeFileName = resumeFile.name;
      }

      // Upload CV if new file is selected
      if (cvFile) {
        const uploadResult = await saveFileToSupabase(cvFile, "documents");
        if (!uploadResult.success) {
          setError(`CV upload failed: ${uploadResult.error}`);
          setLoading(false);
          return;
        }
        newCvUrl = uploadResult.url;
        finalCvFileName = cvFile.name;
      }

      // Prepare documents section data
      // Only include documents that exist (not deleted)
      const documentsSectionData = {};
      
      if (newResumeUrl) {
        documentsSectionData.resumeUrl = newResumeUrl;
        documentsSectionData.resumeFileName = finalResumeFileName;
      }
      
      if (newCvUrl) {
        documentsSectionData.cvUrl = newCvUrl;
        documentsSectionData.cvFileName = finalCvFileName;
      }

      // Check if there are any changes to save
      const hasNewUploads = resumeFile || cvFile;
      const hasExistingDocs = resumeUrl || cvUrl;
      const willHaveDocs = newResumeUrl || newCvUrl;
      
      // If no new uploads, no existing docs, and no docs will be saved, show error
      if (!hasNewUploads && !hasExistingDocs && !willHaveDocs) {
        setError("Please upload at least one document (Resume or CV)");
        setLoading(false);
        return;
      }
      
      // If no changes (no new uploads and documentsSectionData matches current state)
      if (!hasNewUploads && Object.keys(documentsSectionData).length === 0) {
        setError("No changes to save");
        setLoading(false);
        return;
      }

      // Save documents section to Firebase
      const saveResult = await saveDocumentsSection(documentsSectionData);

      if (!saveResult.success) {
        setError(`Failed to save documents section: ${saveResult.error}`);
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Update state with new URLs (or clear if deleted)
      if (newResumeUrl) {
        setResumeUrl(newResumeUrl);
        setResumeFileName(finalResumeFileName);
      } else if (!resumeFile && !resumeUrl) {
        // Document was deleted
        setResumeUrl(null);
        setResumeFileName("");
      }
      
      if (newCvUrl) {
        setCvUrl(newCvUrl);
        setCvFileName(finalCvFileName);
      } else if (!cvFile && !cvUrl) {
        // Document was deleted
        setCvUrl(null);
        setCvFileName("");
      }
      
      // Clear file inputs
      setResumeFile(null);
      setCvFile(null);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = () => {
    setResumeFile(null);
    setResumeUrl(null);
    setResumeFileName("");
  };

  const handleDeleteCv = () => {
    setCvFile(null);
    setCvUrl(null);
    setCvFileName("");
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900">Documents Section</h1>
      <p className="mt-2 text-gray-500 text-sm">
        Upload and manage your Resume and CV documents.
      </p>
      {loadingData && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading existing documents data...
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Documents saved successfully!
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {/* Editor */}
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Upload Documents</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            <form onSubmit={handleSubmit}>
              {/* Resume Upload */}
              <div className="mb-6">
                <label
                  htmlFor="resume-file"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Resume (PDF, DOC, DOCX)
                </label>
                <input
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Validate file type
                      const validTypes = [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      ];
                      if (!validTypes.includes(file.type)) {
                        setError("Please upload a valid PDF, DOC, or DOCX file");
                        return;
                      }
                      // Validate file size (max 10MB)
                      if (file.size > 10 * 1024 * 1024) {
                        setError("File size must be less than 10MB");
                        return;
                      }
                      setResumeFile(file);
                      setError(null);
                    }
                  }}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  type="file"
                  id="resume-file"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {resumeFile && (
                  <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(resumeFile.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDeleteResume}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                {resumeUrl && !resumeFile && (
                  <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Current: {resumeFileName}
                        </p>
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          View/Download →
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={handleDeleteResume}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CV Upload */}
              <div className="mb-6">
                <label
                  htmlFor="cv-file"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  CV (PDF, DOC, DOCX)
                </label>
                <input
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Validate file type
                      const validTypes = [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      ];
                      if (!validTypes.includes(file.type)) {
                        setError("Please upload a valid PDF, DOC, or DOCX file");
                        return;
                      }
                      // Validate file size (max 10MB)
                      if (file.size > 10 * 1024 * 1024) {
                        setError("File size must be less than 10MB");
                        return;
                      }
                      setCvFile(file);
                      setError(null);
                    }
                  }}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  type="file"
                  id="cv-file"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {cvFile && (
                  <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {cvFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(cvFile.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDeleteCv}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                {cvUrl && !cvFile && (
                  <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Current: {cvFileName}
                        </p>
                        <a
                          href={cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          View/Download →
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={handleDeleteCv}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Documents"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="space-y-4">
              {/* Resume Preview */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Resume
                </h3>
                {resumeUrl || resumeFile ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {resumeFile ? resumeFile.name : resumeFileName}
                    </p>
                    {resumeUrl && (
                      <div className="flex gap-2">
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View Resume
                        </a>
                        <a
                          href={resumeUrl}
                          download
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
                        >
                          Download
                        </a>
                      </div>
                    )}
                    {resumeFile && (
                      <p className="text-xs text-gray-500">
                        New file ready to upload: {formatFileSize(resumeFile.size)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No resume uploaded</p>
                )}
              </div>

              {/* CV Preview */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  CV
                </h3>
                {cvUrl || cvFile ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {cvFile ? cvFile.name : cvFileName}
                    </p>
                    {cvUrl && (
                      <div className="flex gap-2">
                        <a
                          href={cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View CV
                        </a>
                        <a
                          href={cvUrl}
                          download
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
                        >
                          Download
                        </a>
                      </div>
                    )}
                    {cvFile && (
                      <p className="text-xs text-gray-500">
                        New file ready to upload: {formatFileSize(cvFile.size)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No CV uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentsSection;

