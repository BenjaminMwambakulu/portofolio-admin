import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectsPreviewContent({ layout, projectsData = [] }) {
  const projects = Array.isArray(projectsData) ? projectsData : [];

  // Helper to get images array (support both old imageUrl and new imageUrls format)
  const getProjectImages = (project) => {
    if (project.imageUrls && Array.isArray(project.imageUrls) && project.imageUrls.length > 0) {
      return project.imageUrls;
    }
    if (project.imageUrl) {
      return [project.imageUrl];
    }
    return [];
  };

  // Image carousel component
  const ImageCarousel = ({ images, title }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    if (images.length === 0) {
      return (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No images</span>
        </div>
      );
    }

    if (images.length === 1) {
      return (
        <div className="w-full h-48 overflow-hidden bg-gray-200">
          <img
            src={images[0]}
            alt={title || 'Project'}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        </div>
      );
    }

    return (
      <div className="relative w-full h-48 overflow-hidden bg-gray-200 group">
        <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt={`${title || 'Project'} - Image ${idx + 1}`}
              className="w-full h-full object-cover flex-shrink-0"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    );
  };

  // Image gallery component (for list view)
  const ImageGallery = ({ images, title }) => {
    if (images.length === 0) {
      return (
        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-400 text-xs">No images</span>
        </div>
      );
    }

    if (images.length === 1) {
      return (
        <div className="w-32 h-32 flex-shrink-0">
          <img
            src={images[0]}
            alt={title || 'Project'}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>
      );
    }

    return (
      <div className="w-32 h-32 flex-shrink-0 grid grid-cols-2 gap-1">
        {images.slice(0, 4).map((image, idx) => (
          <img
            key={idx}
            src={image}
            alt={`${title || 'Project'} - Image ${idx + 1}`}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        ))}
        {images.length > 4 && (
          <div className="w-full h-full bg-black/50 rounded flex items-center justify-center">
            <span className="text-white text-xs font-semibold">+{images.length - 4}</span>
          </div>
        )}
      </div>
    );
  };

  const renderProjectCard = (project, index, variant = 'default') => {
    const cardVariants = {
      default: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300",
      compact: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300",
      list: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex gap-4"
    };

    return (
      <motion.div
        key={project.id || index}
        className={cardVariants[variant]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
      >
        {variant === 'list' ? (
          <>
            <ImageGallery images={getProjectImages(project)} title={project.title} />
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{project.title || 'Untitled Project'}</h3>
                {project.projectType && (
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${
                    project.projectType === "fullstack" ? "bg-purple-100 text-purple-700" :
                    project.projectType === "frontend" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {project.projectType.charAt(0).toUpperCase() + project.projectType.slice(1)}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description || 'No description'}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.slice(0, 4).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Live Demo →
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    GitHub →
                  </a>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <ImageCarousel images={getProjectImages(project)} title={project.title} />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{project.title || 'Untitled Project'}</h3>
                {project.projectType && (
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${
                    project.projectType === "fullstack" ? "bg-purple-100 text-purple-700" :
                    project.projectType === "frontend" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {project.projectType.charAt(0).toUpperCase() + project.projectType.slice(1)}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{project.description || 'No description'}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.slice(0, 5).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{project.technologies.length - 5}
                    </span>
                  )}
                </div>
              )}
              <div className="flex gap-3 mt-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
  };

  const renderLayout = () => {
    switch (layout) {
      case "layout1":
        // Grid Cards Layout
        return (
          <div className="min-h-75">
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => renderProjectCard(project, index, 'default'))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-75 text-gray-400">
                <p>No projects added yet. Add projects to see them here.</p>
              </div>
            )}
          </div>
        );

      case "layout2":
        // Masonry Grid Layout
        return (
          <div className="min-h-75">
            {projects.length > 0 ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                {projects.map((project, index) => (
                  <div key={project.id || index} className="break-inside-avoid mb-6">
                    {renderProjectCard(project, index, 'default')}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-75 text-gray-400">
                <p>No projects added yet. Add projects to see them here.</p>
              </div>
            )}
          </div>
        );

      case "layout3":
        // List View Layout
        return (
          <div className="min-h-75">
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project, index) => renderProjectCard(project, index, 'list'))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-75 text-gray-400">
                <p>No projects added yet. Add projects to see them here.</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center min-h-75 text-gray-400">
            Select a layout to preview
          </div>
        );
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 mt-4 bg-gray-50">
      {renderLayout()}
    </div>
  );
}

