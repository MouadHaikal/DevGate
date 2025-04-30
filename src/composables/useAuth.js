import { db, auth } from "../composables/useFirestore";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { onMounted, onUnmounted, ref } from "vue";

export const registerUser = async ({ email, password, username }) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        await sendEmailVerification(firebaseUser);

        await setDoc(doc(db, "Users", firebaseUser.uid), {
            admin: false,
            email: email,
            username: username,
            Github_username: "",
            Devto_username: "",
            projects: ""
        });

        return firebaseUser;

    } catch (error) {
        console.error("Firebase Error:", error);

        switch (error.code) {
            case 'auth/admin-restricted-operation':
                throw new Error("Account creation is restricted. Enable it in Firebase Console.");
            case 'auth/email-already-in-use':
                throw new Error("This email is already in use.");
            case 'auth/invalid-email':
                throw new Error("Invalid email address.");
            case 'auth/weak-password':
                throw new Error("Password is too weak.");
            case 'auth/network-request-failed':
                throw new Error("Network error. Please check your internet connection.");
            default:
                throw new Error(error.message);
        }
    }
};

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Vérifier d'abord si l'utilisateur existe déjà dans Firestore
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            // L'utilisateur existe, mettre à jour seulement les champs email et username si nécessaire
            const userData = userDoc.data();
            const updateData = {};

            // Ne mettre à jour que si les valeurs sont différentes ou manquantes
            if (userData.email !== user.email) updateData.email = user.email;
            if (!userData.username && user.displayName) updateData.username = user.displayName;

            // S'il y a des champs à mettre à jour
            if (Object.keys(updateData).length > 0) {
                await updateDoc(userDocRef, updateData);
            }
        } else {
            // Nouvel utilisateur, créer un nouveau document
            await setDoc(userDocRef, {
                admin: false,
                email: user.email,
                username: user.displayName || user.email.split('@')[0],
                Github_username: "",
                Devto_username: "",
                projects: []
            });
        }

        return { user, error: null };
    } catch (error) {
        console.error("Google Auth Error:", error);

        // Handle specific error cases
        if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
            return { user: null, error: { message: "Sign in was cancelled. Please try again." } };
        } else if (error.code === 'auth/network-request-failed') {
            return { user: null, error: { message: "Network error. Please check your internet connection." } };
        } else if (error.code === 'auth/popup-blocked') {
            return { user: null, error: { message: "Popup was blocked. Please allow popups for this site." } };
        } else {
            return { user: null, error: { message: "An error occurred during sign in. Please try again." } };
        }
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("User signed out");
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};


export function useAuth() {
    const currentUser = ref(null);
    const isLoading = ref(true);
    let unsubscribe = null;

    onMounted(() => {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            currentUser.value = user;
            isLoading.value = false;
        });
    });

    onUnmounted(() => {
        if (unsubscribe) unsubscribe();
    });

    return {
        currentUser,
        isLoading,
        isAuthenticated: () => currentUser.value !== null
    };
}


export function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}