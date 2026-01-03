import { doc, getDoc } from "firebase/firestore";
import { db } from "../Config/firebase";

export const getUserProfile = async (userId) => {
    try {
        const docRef = doc(db, "Profile", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        } else {
            return { success: false, error: "No profile found" };
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return { success: false, error: error.message };
    }
};
