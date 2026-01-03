import React from "react";
import SkillsLayoutPicker from "../Components/SkillsLayoutPicker";
import SkillsPreviewContent from "../Components/SkillsPreviewContent";
import {
  saveSkillsSection,
  getSkillsSection,
} from "../Services/SkillsSectionService";

function SkillsSection() {
  const [selectedLayout, setSelectedLayout] = React.useState("layout1");
  const [skillsData, setSkillsData] = React.useState([]);
  const [newSkill, setNewSkill] = React.useState({ name: "", category: "Backend", iconPath: "" });
  const [editingIcon, setEditingIcon] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const categories = ["Backend", "Frontend", "Mobile", "Database", "Tools", "Others"];

  // Fetch existing skills section data on component mount
  React.useEffect(() => {
    const fetchSkillsSection = async () => {
      setLoadingData(true);
      try {
        const result = await getSkillsSection();
        if (result.success && result.data) {
          const data = result.data;
          if (data.layout) {
            setSelectedLayout(data.layout);
          }
          if (data.skills && Array.isArray(data.skills)) {
            setSkillsData(data.skills);
          }
        }
      } catch (err) {
        console.error("Error loading skills section:", err);
        setError("Failed to load existing skills section data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchSkillsSection();
  }, []);

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      setError("Please enter a skill name");
      return;
    }

    const skillToAdd = {
      id: Date.now().toString(),
      name: newSkill.name.trim(),
      category: newSkill.category === "Others" ? "Other" : (newSkill.category === "Tools" ? "Tool" : newSkill.category),
      iconPath: newSkill.iconPath.trim() || null,
    };

    setSkillsData([...skillsData, skillToAdd]);
    setNewSkill({ name: "", category: "Backend", iconPath: "" });
    setError(null);
  };

  const handleUpdateSkillIconPath = (skillId, iconPath) => {
    setSkillsData(skillsData.map(skill => 
      skill.id === skillId 
        ? { ...skill, iconPath: iconPath.trim() || null }
        : skill
    ));
    setEditingIcon(prev => {
      const newState = { ...prev };
      delete newState[skillId];
      return newState;
    });
  };

  const handleDeleteSkill = (skillId) => {
    setSkillsData(skillsData.filter(skill => skill.id !== skillId));
  };

  const handleReset = () => {
    setSkillsData([]);
    setNewSkill({ name: "", category: "Backend", iconPath: "" });
    setEditingIcon({});
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const skillsSectionData = {
        layout: selectedLayout,
        skills: skillsData,
      };

      // Save skills section to Firebase
      const saveResult = await saveSkillsSection(skillsSectionData);

      if (!saveResult.success) {
        setError(`Failed to save skills section: ${saveResult.error}`);
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
      <h1 className="text-3xl font-bold text-gray-900">Skills Section</h1>
      <p className="mt-2 text-gray-500 text-sm">
        Manage your skills and organize them by category.
      </p>
      {loadingData && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading existing skills section data...
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Skills section saved successfully!
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
                  htmlFor="skill-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Skill Name
                </label>
                <input
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  type="text"
                  id="skill-name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, Node.js, Python"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="skill-category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  id="skill-category"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="skill-icon"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Icon URL (Optional)
                </label>
                <input
                  value={newSkill.iconPath}
                  onChange={(e) => setNewSkill({ ...newSkill, iconPath: e.target.value })}
                  type="url"
                  id="skill-icon"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/icon.png"
                />
                {newSkill.iconPath && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Icon preview:</p>
                    <img
                      src={newSkill.iconPath}
                      alt="Skill icon preview"
                      className="max-w-16 h-16 object-contain rounded border border-gray-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Skill
                </button>
              </div>

              {/* Skills List */}
              {skillsData.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Skills ({skillsData.length})
                  </label>
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded p-2 space-y-2">
                    {skillsData.map((skill) => (
                      <div
                        key={skill.id}
                        className="bg-gray-50 p-2 rounded space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {skill.iconPath && (
                              <img
                                src={skill.iconPath}
                                alt={skill.name}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            <div>
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-sm text-gray-500 ml-2">
                                ({skill.category === "Tool" ? "Tools" : skill.category === "Other" ? "Others" : skill.category})
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingIcon(prev => ({ ...prev, [skill.id]: !prev[skill.id] }))}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              {editingIcon[skill.id] ? "Cancel" : (skill.iconPath ? "Edit Icon" : "Add Icon")}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        {editingIcon[skill.id] && (
                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              defaultValue={skill.iconPath || ""}
                              placeholder="https://example.com/icon.png"
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateSkillIconPath(skill.id, e.target.value);
                                }
                              }}
                              onBlur={(e) => {
                                handleUpdateSkillIconPath(skill.id, e.target.value);
                              }}
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
            <SkillsLayoutPicker
              selectedLayout={selectedLayout}
              setSelectedLayout={setSelectedLayout}
            />
            <SkillsPreviewContent
              layout={selectedLayout}
              skillsData={skillsData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillsSection;

