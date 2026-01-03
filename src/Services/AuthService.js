import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../Config/firebase";

export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userProfile = {
      email: user.email,
      userId: user.uid,
      profileUrl: user.photoURL || "",
      username: user.displayName || email.split("@")[0], // Fallback to email prefix if display name is missing
      lastLogin: serverTimestamp(),
    };

    await setDoc(doc(db, "Profile", user.uid), userProfile, { merge: true });

    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}
