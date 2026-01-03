import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../Config/firebase";

export const saveHeroSection = async (heroSection) => {
  try {
    const heroSectionRef = collection(db, "Sections", "hero", "items");

    const docRef = await addDoc(heroSectionRef, {
      ...heroSection,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving hero section:", error);
    return { success: false, error: error.message };
  }
};
