import { addDoc, collection, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../Config/firebase";
import { logActivity } from "./ActivityService";

export const saveHeroSection = async (heroSection) => {
  try {
    const heroSectionRef = collection(db, "Sections", "hero", 'items');

    const docRef = await addDoc(heroSectionRef, {
      ...heroSection,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await logActivity("Updated Hero Section");

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving hero section:", error);
    return { success: false, error: error.message };
  }
};

export const getHeroSection = async () => {
  try {
    const heroSectionRef = collection(db, "Sections", "hero", 'items');

    // Query to get the most recent hero section document
    const q = query(heroSectionRef, orderBy("updatedAt", "desc"), limit(1));
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
    console.error("Error fetching hero section:", error);
    return { success: false, error: error.message };
  }
};
