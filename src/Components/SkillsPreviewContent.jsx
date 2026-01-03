import React from 'react';
import { motion } from 'framer-motion';

export default function SkillsPreviewContent({layout, skillsData = {}}) {
  const [activeTab, setActiveTab] = React.useState("Backend");
  
  // Organize skills by category
  const skillsByCategory = React.useMemo(() => {
    const categories = {
      "Backend": [],
      "Frontend": [],
      "Mobile": [],
      "Database": [],
      "Tool": [],
      "Other": []
    };
    
    if (skillsData && Array.isArray(skillsData)) {
      skillsData.forEach(skill => {
        const category = skill.category || "Other";
        const categoryKey = category === "Tools" ? "Tool" : category;
        if (categories[categoryKey] !== undefined) {
          categories[categoryKey].push(skill);
        } else {
          categories["Other"].push(skill);
        }
      });
    }
    
    return categories;
  }, [skillsData]);

  const renderSkills = (skills) => {
    if (!skills || skills.length === 0) {
      return (
        <li className="text-gray-400 text-sm">No skills in this category</li>
      );
    }

    return skills.map((skill, index) => (
      <motion.li
        key={skill.id || index}
        className="bg-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white text-sm sm:text-base font-medium flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        {skill.iconPath && (
          <img
            src={skill.iconPath}
            alt={skill.name || skill}
            className="w-5 h-5 object-contain"
          />
        )}
        <span>{skill.name || skill}</span>
      </motion.li>
    ));
  };

  const renderLayout = () => {
    switch(layout) {
      case "layout1":
        // Tab Navigation with Skills Grid
        return (
          <div className="min-h-75">
            {/* Tab Navigation */}
            <motion.div
              className="flex justify-center lg:justify-start border-b border-gray-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                "Backend",
                "Frontend",
                "Mobile",
                "Database",
                "Tools",
                "Others",
              ].map((tab, index) => (
                <motion.button
                  key={tab}
                  className={`py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base transition-colors ${
                    activeTab === tab
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {tab}
                </motion.button>
              ))}
            </motion.div>

            {/* Skills Grid */}
            <motion.ul
              className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start"
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Firestore-powered Skills by category */}
              {activeTab === "Backend" &&
                renderSkills(skillsByCategory["Backend"])}
              {activeTab === "Frontend" &&
                renderSkills(skillsByCategory["Frontend"])}
              {activeTab === "Mobile" &&
                renderSkills(skillsByCategory["Mobile"])}
              {activeTab === "Tools" &&
                renderSkills(skillsByCategory["Tool"])}
              {activeTab === "Database" &&
                renderSkills(skillsByCategory["Database"])}
              {activeTab === "Others" &&
                renderSkills(skillsByCategory["Other"])}
            </motion.ul>
          </div>
        );
      
      case "layout2":
        // Simple Grid
        const allSkills = skillsData && Array.isArray(skillsData) 
          ? skillsData
          : [];
        return (
          <div className="min-h-75">
            <ul className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
              {allSkills.length > 0 ? (
                allSkills.map((skill, index) => (
                  <li
                    key={skill.id || index}
                    className="bg-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white text-sm sm:text-base font-medium flex items-center gap-2"
                  >
                    {skill.iconPath && (
                      <img
                        src={skill.iconPath}
                        alt={skill.name || skill}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span>{skill.name || skill}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">No skills added</li>
              )}
            </ul>
          </div>
        );
      
      case "layout3":
        // List View
        const listSkills = skillsData && Array.isArray(skillsData) 
          ? skillsData
          : [];
        return (
          <div className="min-h-75">
            <ul className="space-y-2">
              {listSkills.length > 0 ? (
                listSkills.map((skill, index) => (
                  <li
                    key={skill.id || index}
                    className="bg-gray-800 px-4 py-2 rounded-lg text-white text-sm sm:text-base font-medium flex items-center gap-2"
                  >
                    {skill.iconPath && (
                      <img
                        src={skill.iconPath}
                        alt={skill.name || skill}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span>{skill.name || skill}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">No skills added</li>
              )}
            </ul>
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
    <div className="border border-gray-300 rounded-lg p-4 mt-4 bg-gray-900">
      {renderLayout()}
    </div>
  );
}

