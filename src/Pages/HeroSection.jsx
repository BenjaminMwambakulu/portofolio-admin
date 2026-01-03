import React from "react";
import HeroLayoutPicker from "../Components/Heropicker";
import HeroPreviewContent from "../Components/HeroPreviewContent";

function HeroSection() {
  const [selectedLayout, setSelectedLayout] = React.useState("layout1");
  const [heroContent, setHeroContent] = React.useState({
    title: "",
    description: "",
  });
  const [image, setImage] = React.useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeroContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900">Hero Section</h1>
      <p className="mt-2 text-gray-500 text-sm">
        This is the Hero Section page.
      </p>
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {/* Editor and Preview */}
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Editor</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            {/* Editor content would go here */}
            <form action="">
              <div className="mb-4">
                <label
                  htmlFor="hero-title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hero Title
                </label>
                <input
                  value={heroContent.title}
                  onChange={handleChange}
                  name="title"
                  type="text"
                  id="hero-title"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hero title"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="hero-subtitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subtitle
                </label>
                <textarea
                  value={heroContent.description}
                  onChange={handleChange}
                  name="description"
                  id="hero-description"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  placeholder="Enter hero description"
                  rows={4}
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hero Image
                </label>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  type="file"
                  id="image"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                  Reset
                </button>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            {/* Preview content would go here */}
            <HeroLayoutPicker
              selectedLayout={selectedLayout}
              setSelectedLayout={setSelectedLayout}
            />
            <HeroPreviewContent 
              layout={selectedLayout} 
              heroContent={heroContent}
              image={image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
