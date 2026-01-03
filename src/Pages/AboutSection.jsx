import React from "react";
import AboutLayoutPicker from "../Components/AboutLayoutPicker";
import AboutPreviewContent from "../Components/AboutPreviewContent";
import {
  saveAboutSection,
  getAboutSection,
} from "../Services/AboutSectionService";
import { saveFileToSupabase } from "../Services/saveFileToSup";

function AboutSection() {
  const [selectedLayout, setSelectedLayout] = React.useState("layout1");
  const [aboutContent, setAboutContent] = React.useState({
    title: "",
    description: "",
  });
  const [image, setImage] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const [showImage, setShowImage] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  // Fetch existing about section data on component mount
  React.useEffect(() => {
    const fetchAboutSection = async () => {
      setLoadingData(true);
      try {
        const result = await getAboutSection();
        if (result.success && result.data) {
          const data = result.data;
          setAboutContent({
            title: data.title || "",
            description: data.description || "",
          });
          if (data.layout) {
            setSelectedLayout(data.layout);
          }
          if (data.imageUrl) {
            setImageUrl(data.imageUrl);
          }
          if (data.showImage !== undefined) {
            setShowImage(data.showImage);
          }
        }
      } catch (err) {
        console.error("Error loading about section:", err);
        setError("Failed to load existing about section data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchAboutSection();
  }, []);

  const handleReset = () => {
    setAboutContent({
      title: "",
      description: "",
    });
    setImage(null);
    setImageUrl(null);
    setShowImage(true);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let newImageUrl = null;

      // Upload image to Supabase storage if image exists
      if (image) {
        const uploadResult = await saveFileToSupabase(image, "about");
        if (!uploadResult.success) {
          setError(`Image upload failed: ${uploadResult.error}`);
          setLoading(false);
          return;
        }
        newImageUrl = uploadResult.url;
      }

      // Prepare about section data
      // Use new image URL if uploaded, otherwise preserve existing imageUrl
      const finalImageUrl = newImageUrl || imageUrl;
      const aboutSectionData = {
        title: aboutContent.title,
        description: aboutContent.description,
        layout: selectedLayout,
        showImage: showImage,
        ...(finalImageUrl && { imageUrl: finalImageUrl }),
      };

      // Save about section to Firebase
      const saveResult = await saveAboutSection(aboutSectionData);

      if (!saveResult.success) {
        setError(`Failed to save about section: ${saveResult.error}`);
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Update imageUrl state if new image was uploaded
      if (newImageUrl) {
        setImageUrl(newImageUrl);
      }
      // Clear the file input since we've saved the image
      setImage(null);
      // Don't reset form after save - keep the data visible
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900">About Section</h1>
      <p className="mt-2 text-gray-500 text-sm">
        This is the About Section page.
      </p>
      {loadingData && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading existing about section data...
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          About section saved successfully!
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {/* Editor and Preview */}
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Editor</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            <form action="">
              <div className="mb-4">
                <label
                  htmlFor="about-title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  About Title
                </label>
                <input
                  value={aboutContent.title}
                  onChange={handleChange}
                  name="title"
                  type="text"
                  id="about-title"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter about title"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="about-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  About Description
                </label>
                <textarea
                  value={aboutContent.description}
                  onChange={handleChange}
                  name="description"
                  id="about-description"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  placeholder="Enter about description"
                  rows={4}
                ></textarea>
              </div>
              {(selectedLayout === "layout1" || selectedLayout === "layout2") && (
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showImage}
                      onChange={(e) => setShowImage(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Show Image
                    </span>
                  </label>
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="about-image"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  About Image
                </label>
                <input
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                  accept="image/*"
                  type="file"
                  id="about-image"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imageUrl && !image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Current image:</p>
                    <img
                      src={imageUrl}
                      alt="About"
                      className="max-w-xs h-auto rounded border border-gray-300"
                    />
                  </div>
                )}
              </div>
              <div>
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
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            <AboutLayoutPicker
              selectedLayout={selectedLayout}
              setSelectedLayout={setSelectedLayout}
            />
            <AboutPreviewContent
              layout={selectedLayout}
              aboutContent={aboutContent}
              image={image}
              imageUrl={imageUrl}
              showImage={showImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
