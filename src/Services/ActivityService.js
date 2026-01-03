import { addDoc, collection, getDocs, limit, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "../Config/firebase";

export const logActivity = async (activityDescription) => {
    try {
        const activitiesRef = collection(db, "activities");
        await addDoc(activitiesRef, {
            activity: activityDescription,
            time: Timestamp.now(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error logging activity:", error);
        return { success: false, error: error.message };
    }
};

export const getRecentActivities = async () => {
    try {
        const q = query(
            collection(db, "activities"),
            orderBy("time", "desc"),
            // We might want to fetch more to be safe, but 5 is enough for the dashboard
            limit(5)
        );
        const querySnapshot = await getDocs(q);

        const activities = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timeRaw: doc.data().time
        }));

        return { success: true, data: activities };
    } catch (error) {
        console.error("Error fetching recent activities:", error);
        return { success: false, error: error.message };
    }
};
