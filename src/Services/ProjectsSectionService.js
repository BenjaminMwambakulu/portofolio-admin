import { addDoc, collection, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../Config/firebase";
import { logActivity } from "./ActivityService";

export const saveProjectsSection = async (projectsSection) => {
  try {
    const projectsSectionRef = collection(db, "Sections", "projects", 'items');

    const docRef = await addDoc(projectsSectionRef, {
      ...projectsSection,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await logActivity("Updated Projects Section");

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving projects section:", error);
    return { success: false, error: error.message };
  }
};

export const getProjectsSection = async () => {
  try {
    const projectsSectionRef = collection(db, "Sections", "projects", 'items');

    // Query to get the most recent projects section document
    const q = query(projectsSectionRef, orderBy("updatedAt", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: true, data: null };
    }

    const doc = querySnapshot.docs[0];
    const data = {
      id: doc.id,
      ...doc.data(),
    };

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching projects section:", error);
    return { success: false, error: error.message };
  }
};

