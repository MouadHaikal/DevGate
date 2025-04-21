import { ref, readonly } from 'vue';
import { auth } from './useFirestore';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './useFirestore';

const currentUser = ref(null);
const isUserInitialized = ref(false);
const isAdmin = ref(false);
const loading = ref(true);

onAuthStateChanged(auth, async (user) => {
    currentUser.value = user;
    isUserInitialized.value = true;

    if (user) {
        try {
            const userDocRef = doc(db, 'Users', user.uid);
            const snapshot = await getDoc(userDocRef);

            if (snapshot.exists()) {
                isAdmin.value = snapshot.data().admin || false;
            } else {
                isAdmin.value = false;
            }
        } catch (error) {
            console.error('Error fetching user document:', error);
            isAdmin.value = false;
        }
    } else {
        isAdmin.value = false;
    }

    loading.value = false;
});

export function useUser() {
    return {
        currentUser: readonly(currentUser),
        isUserInitialized: readonly(isUserInitialized),
        isLoggedIn: readonly(ref(() => !!currentUser.value)),
        isAdmin: readonly(isAdmin),
        loading: readonly(loading)
    };
}
