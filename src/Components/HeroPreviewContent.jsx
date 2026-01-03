import React from 'react'

export default function HeroPreviewContent({layout, heroContent, image}) {
  const { title = "", description = "" } = heroContent || {};
  const imageUrl = image ? URL.createObjectURL(image) : null;

  const renderLayout = () => {
    switch(layout) {
      case "layout1":
        // Text Left, Image Right
        return (
          <div className="grid grid-cols-2 gap-4 items-center min-h-75">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">{title || "Hero Title"}</h2>
              <p className="text-gray-600">{description || "Hero description goes here"}</p>
            </div>
            <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-50">
              {imageUrl ? (
                <img src={imageUrl} alt="Hero" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-gray-400">Image Preview</span>
              )}
            </div>
          </div>
        );
      
      case "layout2":
        // Image Left, Text Right
        return (
          <div className="grid grid-cols-2 gap-4 items-center min-h-75">
            <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-50">
              {imageUrl ? (
                <img src={imageUrl} alt="Hero" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-gray-400">Image Preview</span>
              )}
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">{title || "Hero Title"}</h2>
              <p className="text-gray-600">{description || "Hero description goes here"}</p>
            </div>
          </div>
        );
      
      case "layout3":
        // Centered Text with Background Image and Dark Overlay
        return (
          <div className="relative rounded-lg overflow-hidden min-h-75">
            <div className="absolute inset-0 bg-gray-200">
              {imageUrl ? (
                <img src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">Image Preview</span>
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative flex flex-col items-center justify-center text-center min-h-75 space-y-4 p-8 z-10">
              <h2 className="text-4xl font-bold text-white">{title || "Hero Title"}</h2>
              <p className="text-white/90 max-w-2xl">{description || "Hero description goes here"}</p>
            </div>
          </div>
        );
      
      case "layout4":
        // Full Image with Text Overlay
        return (
          <div className="relative rounded-lg overflow-hidden min-h-100">
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">Image Preview</span>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-6 space-y-2">
              <h2 className="text-3xl font-bold">{title || "Hero Title"}</h2>
              <p className="text-gray-600">{description || "Hero description goes here"}</p>
            </div>
          </div>
        );
      
      case "layout5":
        // Text on top, Image below
        return (
          <div className="flex flex-col gap-4 min-h-75">
            <div className="space-y-4 p-4">
              <h2 className="text-3xl font-bold">{title || "Hero Title"}</h2>
              <p className="text-gray-600">{description || "Hero description goes here"}</p>
            </div>
            <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-50 flex-1">
              {imageUrl ? (
                <img src={imageUrl} alt="Hero" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-gray-400">Image Preview</span>
              )}
            </div>
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
