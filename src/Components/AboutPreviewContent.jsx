import React from 'react'

export default function AboutPreviewContent({layout, aboutContent, image, imageUrl: dbImageUrl, showImage = true}) {
  const { title = "", description = "" } = aboutContent || {};
  // Prioritize new file selection over database URL
  const imageUrl = image ? URL.createObjectURL(image) : dbImageUrl || null;

  const renderLayout = () => {
    switch(layout) {
      case "layout1":
        // Text Left, Image Right (with option for no image)
        return (
          <div className={`grid gap-4 items-center min-h-75 ${showImage && imageUrl ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">{title || "About Title"}</h2>
              <p className="text-gray-600">{description || "About description goes here"}</p>
            </div>
            {showImage && imageUrl && (
              <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-50">
                <img src={imageUrl} alt="About" className="w-full h-full object-cover rounded-lg" />
              </div>
            )}
          </div>
        );
      
      case "layout2":
        // Image Left, Text Right (with option for no image)
        return (
          <div className={`grid gap-4 items-center min-h-75 ${showImage && imageUrl ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {showImage && imageUrl && (
              <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-50">
                <img src={imageUrl} alt="About" className="w-full h-full object-cover rounded-lg" />
              </div>
            )}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">{title || "About Title"}</h2>
              <p className="text-gray-600">{description || "About description goes here"}</p>
            </div>
          </div>
        );
      
      case "layout3":
        // Centered Text without Background
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-75 space-y-4 p-8">
            <h2 className="text-4xl font-bold">{title || "About Title"}</h2>
            <p className="text-gray-600 max-w-2xl">{description || "About description goes here"}</p>
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
    <div className="border border-gray-300 rounded-lg p-4 mt-4">
      {renderLayout()}
    </div>
  );
}

