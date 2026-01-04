import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../Config/firebase";

export const getMessages = async () => {
    try {
        const messagesRef = collection(db, "Messages");
        const q = query(messagesRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const messages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, data: messages };
    } catch (error) {
        console.error("Error fetching messages:", error);
        return { success: false, error: error.message };
    }
};

export const deleteMessage = async (id) => {
    try {
        await deleteDoc(doc(db, "Messages", id));
        return { success: true };
    } catch (error) {
        console.error("Error deleting message:", error);
        return { success: false, error: error.message };
    }
};

export const markAsRead = async (id) => {
    try {
        await updateDoc(doc(db, "Messages", id), { read: true });
        return { success: true };
    } catch (error) {
        console.error("Error marking message as read:", error);
        return { success: false, error: error.message };
    }
};
