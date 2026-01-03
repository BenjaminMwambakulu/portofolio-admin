import React from "react";
import ProjectsLayoutPicker from "../Components/ProjectsLayoutPicker";
import ProjectsPreviewContent from "../Components/ProjectsPreviewContent";
import {
  saveProjectsSection,
  getProjectsSection,
} from "../Services/ProjectsSectionService";
import { saveFileToSupabase } from "../Services/saveFileToSup";

function ProjectsSection() {
  const [selectedLayout, setSelectedLayout] = React.useState("layout1");
  const [projectsData, setProjectsData] = React.useState([]);
  const [newProject, setNewProject] = React.useState({
    title: "",
    description: "",
    projectType: "fullstack",
    images: [],
    imageUrls: [],
    technologies: [],
    liveUrl: "",
    githubUrl: "",
  });
  const [newTechnology, setNewTechnology] = React.useState("");
  const [editingProject, setEditingProject] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  // Fetch existing projects section data on component mount
  React.useEffect(() => {
    const fetchProjectsSection = async () => {
      setLoadingData(true);
      try {
        const result = await getProjectsSection();
        if (result.success && result.data) {
          const data = result.data;
          if (data.layout) {
            setSelectedLayout(data.layout);
          }
          if (data.projects && Array.isArray(data.projects)) {
            setProjectsData(data.projects);
          }
        }
      } catch (err) {
        console.error("Error loading projects section:", err);
        setError("Failed to load existing projects section data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchProjectsSection();
  }, []);

  const handleAddTechnology = () => {
    if (!newTechnology.trim()) return;
    setNewProject({
      ...newProject,
      technologies: [...newProject.technologies, newTechnology.trim()],
    });
    setNewTechnology("");
  };

  const handleRemoveTechnology = (index) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter((_, i) => i !== index),
    });
  };

  const handleAddProject = () => {
    if (!newProject.title.trim()) {
      setError("Please enter a project title");
      return;
    }

    const projectToAdd = {
      id: Date.now().toString(),
      title: newProject.title.trim(),
      description: newProject.description.trim() || null,
      projectType: newProject.projectType || "fullstack",
      images: newProject.images || [],
      imageUrls: newProject.imageUrls || [],
      technologies: newProject.technologies.length > 0 ? newProject.technologies : null,
      liveUrl: newProject.liveUrl.trim() || null,
      githubUrl: newProject.githubUrl.trim() || null,
    };

    setProjectsData([...projectsData, projectToAdd]);
    setNewProject({
      title: "",
      description: "",
      projectType: "fullstack",
      images: [],
      imageUrls: [],
      technologies: [],
      liveUrl: "",
      githubUrl: "",
    });
    setNewTechnology("");
    setError(null);
  };

  const handleUpdateProject = (projectId, field, value) => {
    setProjectsData(
      projectsData.map((project) =>
        project.id === projectId ? { ...project, [field]: value } : project
      )
    );
    setEditingProject((prev) => {
      const newState = { ...prev };
      delete newState[projectId];
      return newState;
    });
  };

  const handleDeleteProject = (projectId) => {
    setProjectsData(projectsData.filter((project) => project.id !== projectId));
  };

  const handleRemoveImage = (index) => {
    setNewProject({
      ...newProject,
      images: newProject.images.filter((_, i) => i !== index),
      imageUrls: newProject.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleReset = () => {
    setProjectsData([]);
    setNewProject({
      title: "",
      description: "",
      projectType: "fullstack",
      images: [],
      imageUrls: [],
      technologies: [],
      liveUrl: "",
      githubUrl: "",
    });
    setNewTechnology("");
    setEditingProject({});
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Upload images for projects that have new images (File objects)
      const projectsWithImages = await Promise.all(
        projectsData.map(async (project) => {
          if (project.images && Array.isArray(project.images) && project.images.length > 0) {
            const uploadedUrls = await Promise.all(
              project.images.map(async (image) => {
                if (image instanceof File) {
                  const uploadResult = await saveFileToSupabase(image, "projects");
                  if (uploadResult.success) {
                    return uploadResult.url;
                  }
                }
                return null;
              })
            );
            const validUrls = uploadedUrls.filter(url => url !== null);
            // Merge with existing imageUrls and remove File objects
            const allImageUrls = [...(project.imageUrls || []), ...validUrls];
            return { ...project, imageUrls: allImageUrls, images: [] };
          }
          return project;
        })
      );

      const projectsSectionData = {
        layout: selectedLayout,
        projects: projectsWithImages.map(({ images, ...rest }) => rest),
      };

      // Save projects section to Firebase
      const saveResult = await saveProjectsSection(projectsSectionData);

      if (!saveResult.success) {
        setError(`Failed to save projects section: ${saveResult.error}`);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setProjectsData(projectsWithImages.map(({ image, ...rest }) => rest));
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900">Projects Section</h1>
      <p className="mt-2 text-gray-500 text-sm">
        Manage your projects and showcase them with modern preview layouts.
      </p>
      {loadingData && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading existing projects section data...
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Projects section saved successfully!
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {/* Editor */}
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Editor</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            <form action="">
              <div className="mb-4">
                <label
                  htmlFor="project-title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project Title *
                </label>
                <input
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  type="text"
                  id="project-title"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., E-Commerce Platform"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="project-type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project Type
                </label>
                <select
                  value={newProject.projectType}
                  onChange={(e) =>
                    setNewProject({ ...newProject, projectType: e.target.value })
                  }
                  id="project-type"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fullstack">Fullstack</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="project-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  id="project-description"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="project-images"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project Images (Multiple)
                </label>
                <input
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      const newImages = [...newProject.images, ...files];
                      setNewProject({ ...newProject, images: newImages });
                      
                      // Create preview URLs for all images
                      const readers = files.map(file => {
                        return new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve(reader.result);
                          reader.readAsDataURL(file);
                        });
                      });
                      
                      Promise.all(readers).then(previews => {
                        setNewProject(prev => ({
                          ...prev,
                          imageUrls: [...prev.imageUrls, ...previews],
                        }));
                      });
                    }
                    // Reset input to allow selecting the same files again
                    e.target.value = '';
                  }}
                  accept="image/*"
                  type="file"
                  id="project-images"
                  multiple
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {newProject.imageUrls.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">
                      Image previews ({newProject.imageUrls.length}):
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {newProject.imageUrls.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={imageUrl}
                            alt={`Project preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="project-technologies"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Technologies
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    type="text"
                    id="project-technologies"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., React, Node.js"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTechnology();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTechnology}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                {newProject.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechnology(index)}
                          className="text-blue-700 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="project-live-url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Live Demo URL
                </label>
                <input
                  value={newProject.liveUrl}
                  onChange={(e) =>
                    setNewProject({ ...newProject, liveUrl: e.target.value })
                  }
                  type="url"
                  id="project-live-url"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="project-github-url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  GitHub URL
                </label>
                <input
                  value={newProject.githubUrl}
                  onChange={(e) =>
                    setNewProject({ ...newProject, githubUrl: e.target.value })
                  }
                  type="url"
                  id="project-github-url"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Project
                </button>
              </div>

              {/* Projects List */}
              {projectsData.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Projects ({projectsData.length})
                  </label>
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded p-2 space-y-2">
                    {projectsData.map((project) => (
                      <div
                        key={project.id}
                        className="bg-gray-50 p-3 rounded space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{project.title}</span>
                              {project.projectType && (
                                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                  project.projectType === "fullstack" ? "bg-purple-100 text-purple-700" :
                                  project.projectType === "frontend" ? "bg-blue-100 text-blue-700" :
                                  "bg-green-100 text-green-700"
                                }`}>
                                  {project.projectType.charAt(0).toUpperCase() + project.projectType.slice(1)}
                                </span>
                              )}
                            </div>
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {project.technologies.slice(0, 3).map((tech, index) => (
                                  <span
                                    key={index}
                                    className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {project.technologies.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{project.technologies.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingProject((prev) => ({
                                  ...prev,
                                  [project.id]: !prev[project.id],
                                }))
                              }
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              {editingProject[project.id] ? "Cancel" : "Edit"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        {editingProject[project.id] && (
                          <div className="space-y-2 text-sm">
                            <input
                              type="text"
                              defaultValue={project.title || ""}
                              placeholder="Title"
                              className="w-full border border-gray-300 rounded px-2 py-1"
                              onBlur={(e) =>
                                handleUpdateProject(project.id, "title", e.target.value)
                              }
                            />
                            <select
                              defaultValue={project.projectType || "fullstack"}
                              className="w-full border border-gray-300 rounded px-2 py-1"
                              onChange={(e) =>
                                handleUpdateProject(project.id, "projectType", e.target.value)
                              }
                            >
                              <option value="fullstack">Fullstack</option>
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                            </select>
                            <input
                              type="url"
                              defaultValue={project.liveUrl || ""}
                              placeholder="Live URL"
                              className="w-full border border-gray-300 rounded px-2 py-1"
                              onBlur={(e) =>
                                handleUpdateProject(project.id, "liveUrl", e.target.value)
                              }
                            />
                            <input
                              type="url"
                              defaultValue={project.githubUrl || ""}
                              placeholder="GitHub URL"
                              className="w-full border border-gray-300 rounded px-2 py-1"
                              onBlur={(e) =>
                                handleUpdateProject(project.id, "githubUrl", e.target.value)
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
            <ProjectsLayoutPicker
              selectedLayout={selectedLayout}
              setSelectedLayout={setSelectedLayout}
            />
            <ProjectsPreviewContent
              layout={selectedLayout}
              projectsData={projectsData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsSection;

