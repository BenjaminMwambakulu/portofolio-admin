import React from "react";
import HeroLayoutPicker from "../Components/Heropicker";
import HeroPreviewContent from "../Components/HeroPreviewContent";
import { saveHeroSection, getHeroSection } from "../Services/HeroSectionService";
import { saveFileToSupabase } from "../Services/saveFileToSup";

function HeroSection() {
  const [selectedLayout, setSelectedLayout] = React.useState("layout1");
  const [heroContent, setHeroContent] = React.useState({
    title: "",
    description: "",
  });
  const [image, setImage] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeroContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  // Fetch existing hero section data on component mount
  React.useEffect(() => {
    const fetchHeroSection = async () => {
      setLoadingData(true);
      try {
        const result = await getHeroSection();
        if (result.success && result.data) {
          const data = result.data;
          setHeroContent({
            title: data.title || "",
            description: data.description || "",
          });
          if (data.layout) {
            setSelectedLayout(data.layout);
          }
          if (data.imageUrl) {
            setImageUrl(data.imageUrl);
          }
        }
      } catch (err) {
        console.error("Error loading hero section:", err);
        setError("Failed to load existing hero section data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchHeroSection();
  }, []);

  const handleReset = () => {
    setHeroContent({
      title: "",
      description: "",
    });
    setImage(null);
    setImageUrl(null);
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
        const uploadResult = await saveFileToSupabase(image, "hero");
        if (!uploadResult.success) {
          setError(`Image upload failed: ${uploadResult.error}`);
          setLoading(false);
          return;
        }
        newImageUrl = uploadResult.url;
      }

      // Prepare hero section data
      // Use new image URL if uploaded, otherwise preserve existing imageUrl
      const finalImageUrl = newImageUrl || imageUrl;
      const heroSectionData = {
        title: heroContent.title,
        description: heroContent.description,
        layout: selectedLayout,
        ...(finalImageUrl && { imageUrl: finalImageUrl }),
      };

      // Save hero section to Firebase
      const saveResult = await saveHeroSection(heroSectionData);
      
      if (!saveResult.success) {
        setError(`Failed to save hero section: ${saveResult.error}`);
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
      <h1 className="text-3xl font-bold text-gray-900">Hero Section</h1>
      <p className="mt-2 text-gray-500 text-sm">
        This is the Hero Section page.
      </p>
      {loadingData && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading existing hero section data...
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Hero section saved successfully!
        </div>
      )}
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
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                  accept="image/*"
                  type="file"
                  id="image"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imageUrl && !image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Current image:</p>
                    <img 
                      src={imageUrl} 
                      alt="Hero" 
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
            {/* Preview content would go here */}
            <HeroLayoutPicker
              selectedLayout={selectedLayout}
              setSelectedLayout={setSelectedLayout}
            />
            <HeroPreviewContent 
              layout={selectedLayout} 
              heroContent={heroContent}
              image={image}
              imageUrl={imageUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
