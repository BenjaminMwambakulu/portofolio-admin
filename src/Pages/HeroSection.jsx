import React from "react";

function HeroSection() {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900">Hero Section</h1>
      <p className="mt-2 text-gray-500 text-sm">This is the Hero Section page.</p>
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {/* Editor and Preview */}
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Editor</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            {/* Editor content would go here */}
            <p>Editor content placeholder</p>
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            {/* Preview content would go here */}
            <p>Preview content placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
