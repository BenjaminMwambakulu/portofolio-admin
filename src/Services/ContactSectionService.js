import { addDoc, collection, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../Config/firebase";
import { logActivity } from "./ActivityService";

export const saveContactSection = async (contactSection) => {
  try {
    const contactSectionRef = collection(db, "Sections", "contact", 'items');

    const docRef = await addDoc(contactSectionRef, {
      ...contactSection,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await logActivity("Updated Contact Section");

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving contact section:", error);
    return { success: false, error: error.message };
  }
};

export const getContactSection = async () => {
  try {
    const contactSectionRef = collection(db, "Sections", "contact", 'items');

    // Query to get the most recent contact section document
    const q = query(contactSectionRef, orderBy("updatedAt", "desc"), limit(1));
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
    console.error("Error fetching contact section:", error);
    return { success: false, error: error.message };
  }
};

