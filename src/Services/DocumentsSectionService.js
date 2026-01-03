import { addDoc, collection, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../Config/firebase";

export const saveDocumentsSection = async (documentsSection) => {
  try {
    const documentsSectionRef = collection(db, "Sections", "documents", 'items');

    const docRef = await addDoc(documentsSectionRef, {
      ...documentsSection,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving documents section:", error);
    return { success: false, error: error.message };
  }
};

export const getDocumentsSection = async () => {
  try {
    const documentsSectionRef = collection(db, "Sections", "documents", 'items');
    
    // Query to get the most recent documents section document
    const q = query(documentsSectionRef, orderBy("updatedAt", "desc"), limit(1));
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
    console.error("Error fetching documents section:", error);
    return { success: false, error: error.message };
  }
};

