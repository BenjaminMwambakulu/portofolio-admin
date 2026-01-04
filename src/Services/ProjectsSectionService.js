import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  setDoc,
  writeBatch,
  getDoc
} from "firebase/firestore";
import { db } from "../Config/firebase";
import { logActivity } from "./ActivityService";

export const saveProjectsSection = async (projectsSection) => {
  try {
    const batch = writeBatch(db);

    // 1. Save Layout (to the parent document)
    const layoutRef = doc(db, "Sections", "projects");
    batch.set(layoutRef, {
      layout: projectsSection.layout,
      updatedAt: new Date()
    }, { merge: true });

    // 2. Save Projects (to 'projectList' subcollection)
    const projectListRef = collection(db, "Sections", "projects", "projectList");

    // Get existing projects to identify deletions
    const existingDocs = await getDocs(projectListRef);
    const existingIds = new Set(existingDocs.docs.map(d => d.id));

    // Add/Update current projects
    projectsSection.projects.forEach((project, index) => {
      // Ensure we have an ID
      const projectId = String(project.id || Date.now());
      const projectRef = doc(projectListRef, projectId);

      batch.set(projectRef, {
        ...project,
        id: projectId, // Ensure ID is in the data
        index: index, // Save order
        updatedAt: new Date()
      });

      existingIds.delete(projectId);
    });

    // Delete removed projects
    existingIds.forEach(id => {
      const ref = doc(projectListRef, id);
      batch.delete(ref);
    });

    await batch.commit();
    await logActivity("Updated Projects Section");

    return { success: true };
  } catch (error) {
    console.error("Error saving projects section:", error);
    return { success: false, error: error.message };
  }
};

export const getProjectsSection = async () => {
  try {
    // Try to get data from the new structure first
    const projectListRef = collection(db, "Sections", "projects", "projectList");
    const qProjectList = query(projectListRef, orderBy("index"));
    const projectListSnapshot = await getDocs(qProjectList);

    if (!projectListSnapshot.empty) {
      // New structure exists
      const projects = projectListSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get layout
      const layoutDocRef = doc(db, "Sections", "projects");
      const layoutDoc = await getDoc(layoutDocRef);
      const layout = layoutDoc.exists() ? layoutDoc.data().layout : "layout1";

      return {
        success: true,
        data: {
          layout,
          projects
        }
      };
    }

    // Fallback: Check for the legacy structure (snapshot documents)
    const legacyProjectsRef = collection(db, "Sections", "projects", "items");
    const q = query(legacyProjectsRef, orderBy("updatedAt", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: true, data: null };
    }

    const docSnapshot = querySnapshot.docs[0];
    const data = {
      id: docSnapshot.id,
      ...docSnapshot.data(),
    };

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching projects section:", error);
    return { success: false, error: error.message };
  }
};

