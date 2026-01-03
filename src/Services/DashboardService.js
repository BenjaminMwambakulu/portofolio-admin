import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../Config/firebase";
import { getProjectsSection } from "./ProjectsSectionService";
import { getSkillsSection } from "./SkillsSectionService";
import { getRecentActivities } from "./ActivityService"; // Import from new service

export { getRecentActivities }; // Re-export for consumption

// Helper to seed data if it doesn't exist (for demonstration purposes)
const seedDashboardData = async () => {
  try {
    const statsRef = doc(db, "stats", "portfolio");
    const statsSnap = await getDoc(statsRef);

    if (!statsSnap.exists()) {
      await setDoc(statsRef, {
        profileViews: 1234,
        completionRate: 92,
        updatedAt: Timestamp.now()
      });
      console.log("Seeded stats data");
    }
  } catch (error) {
    console.error("Error seeding dashboard data:", error);
  }
};

export const getDashboardData = async () => {
  try {
    // Ensure data exists
    await seedDashboardData();

    const [projectsResult, skillsResult] = await Promise.all([
      getProjectsSection(),
      getSkillsSection()
    ]);

    let totalProjects = 0;
    let totalSkills = 0;
    let profileViews = 0;

    // Fetch Stats
    try {
      const statsRef = doc(db, "stats", "portfolio");
      const statsSnap = await getDoc(statsRef);
      if (statsSnap.exists()) {
        profileViews = statsSnap.data().profileViews || 0;
      }
    } catch (e) {
      console.warn("Could not fetch stats:", e);
    }

    if (projectsResult.success && projectsResult.data && projectsResult.data.projects) {
      totalProjects = projectsResult.data.projects.length;
    }

    if (skillsResult.success && skillsResult.data && skillsResult.data.skills) {
      totalSkills = skillsResult.data.skills.length;
    }

    return {
      success: true,
      data: {
        totalProjects,
        totalSkills,
        profileViews
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { success: false, error: error.message };
  }
};
