import React from "react";
import ContactLayoutPicker from "../Components/ContactLayoutPicker";
import ContactPreviewContent from "../Components/ContactPreviewContent";
import {
  saveContactSection,
  getContactSection,
} from "../Services/ContactSectionService";

function ContactSection() {
  const [selectedLayout, setSelectedLayout] = React.useState("layout1");
  const [contactData, setContactData] = React.useState({
    title: "",
    description: "",
    email: "",
    phone: "",
    location: "",
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
      instagram: "",
      facebook: "",
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  // Fetch existing contact section data on component mount
  React.useEffect(() => {
    const fetchContactSection = async () => {
      setLoadingData(true);
      try {
        const result = await getContactSection();
        if (result.success && result.data) {
          const data = result.data;
          setContactData({
            title: data.title || "",
            description: data.description || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            socialLinks: {
              linkedin: data.socialLinks?.linkedin || "",
              github: data.socialLinks?.github || "",
              twitter: data.socialLinks?.twitter || "",
              instagram: data.socialLinks?.instagram || "",
              facebook: data.socialLinks?.facebook || "",
            },
          });
          if (data.layout) {
            setSelectedLayout(data.layout);
          }
        }
      } catch (err) {
        console.error("Error loading contact section:", err);
        setError("Failed to load existing contact section data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchContactSection();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setContactData((prevData) => ({
      ...prevData,
      socialLinks: {
        ...prevData.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleReset = () => {
    setContactData({
      title: "",
      description: "",
      email: "",
      phone: "",
      location: "",
      socialLinks: {
        linkedin: "",
        github: "",
        twitter: "",
        instagram: "",
        facebook: "",
      },
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Clean up empty social links
      const cleanedSocialLinks = {};
      Object.keys(contactData.socialLinks).forEach((key) => {
        if (contactData.socialLinks[key]?.trim()) {
          cleanedSocialLinks[key] = contactData.socialLinks[key].trim();
        }
      });

      const contactSectionData = {
        title: contactData.title.trim() || null,
        description: contactData.description.trim() || null,
        email: contactData.email.trim() || null,
        phone: contactData.phone.trim() || null,
        location: contactData.location.trim() || null,
        socialLinks: Object.keys(cleanedSocialLinks).length > 0 ? cleanedSocialLinks : null,
        layout: selectedLayout,
      };

      // Save contact section to Firebase
      const saveResult = await saveContactSection(contactSectionData);

      if (!saveResult.success) {
        setError(`Failed to save contact section: ${saveResult.error}`);
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900">Contact Section</h1>
      <p className="mt-2 text-gray-500 text-sm">
        Manage your contact information and social media links.
      </p>
      {loadingData && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading existing contact section data...
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Contact section saved successfully!
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {/* Editor */}
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Editor</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="contact-title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  value={contactData.title}
                  onChange={handleChange}
                  name="title"
                  type="text"
                  id="contact-title"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Get In Touch"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contact-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  value={contactData.description}
                  onChange={handleChange}
                  name="description"
                  id="contact-description"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a brief description..."
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  value={contactData.email}
                  onChange={handleChange}
                  name="email"
                  type="email"
                  id="contact-email"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contact-phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <input
                  value={contactData.phone}
                  onChange={handleChange}
                  name="phone"
                  type="tel"
                  id="contact-phone"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contact-location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  value={contactData.location}
                  onChange={handleChange}
                  name="location"
                  type="text"
                  id="contact-location"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., New York, NY, USA"
                />
              </div>

              {/* Social Links */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media Links
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">LinkedIn</label>
                    <input
                      value={contactData.socialLinks.linkedin}
                      onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                      type="url"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">GitHub</label>
                    <input
                      value={contactData.socialLinks.github}
                      onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                      type="url"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Twitter</label>
                    <input
                      value={contactData.socialLinks.twitter}
                      onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                      type="url"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Instagram</label>
                    <input
                      value={contactData.socialLinks.instagram}
                      onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                      type="url"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Facebook</label>
                    <input
                      value={contactData.socialLinks.facebook}
                      onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                      type="url"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                </div>
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
            <ContactLayoutPicker
              selectedLayout={selectedLayout}
              setSelectedLayout={setSelectedLayout}
            />
            <ContactPreviewContent
              layout={selectedLayout}
              contactData={contactData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactSection;

