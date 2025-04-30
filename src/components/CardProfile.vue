<template>
  <div
    class="interactive-glass-card relative rounded-3xl overflow-hidden p-7 profile-card w-80"
    @mousemove="handleMouseMove"
    @mouseleave="resetMouse"
    ref="card"
  >
    <!-- ✨ Background Blurred Layer (Card Content) -->
    <div>
      <!-- Avatar and Edit Button -->
      <div class="flex items-center justify-between">
        <div class="w-20 h-20 rounded-full border-4 border-violet-400 bg-gray-700 overflow-hidden flex items-center justify-center">
          <img
            v-if="profile.avatarUrl"
            :src="profile.avatarUrl"
            alt="Avatar"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="flex items-center justify-center w-full h-full text-violet-300 font-bold text-3xl"
          >
            {{ profile.name.charAt(0) }}
          </div>
        </div>

        <button
          @click="toggleEditMode"
          class="w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white rounded-full transition"
          title="Edit Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" />
          </svg>
        </button>
      </div>

      <!-- Name, Username, Bio -->
      <div class="mt-6 text-center">
        <h2 class="text-2xl font-bold text-gray-100">{{ profile.name }}</h2>
        <div class="text-md text-violet-400 font-mono mb-2">@{{ profile.username || 'username' }}</div>
        <hr class="w-2/3 mx-auto my-2 border-violet-600">
        <p class="text-gray-400 text-sm">{{ profile.bio }}</p>
      </div>

      <!-- Edit Profile Form -->
      <div v-if="isEditing" class="mt-6 bg-gray-700 rounded-xl p-4">
        <input
          type="text"
          v-model="editableName"
          placeholder="Enter new name"
          class="w-full p-2 mb-2 bg-gray-800 border border-gray-600 text-gray-300 rounded"
        />
        <input
          type="text"
          v-model="editableUsername"
          placeholder="Enter username"
          class="w-full p-2 mb-2 bg-gray-800 border border-gray-600 text-gray-300 rounded"
        />
        <input
          type="text"
          v-model="editableGithub"
          placeholder="Enter your GitHub username"
          class="w-full p-2 mb-2 bg-gray-800 border border-gray-600 text-gray-300 rounded"
        />
        <input
          type="text"
          v-model="editableDevto"
          placeholder="Enter your Dev.to username"
          class="w-full p-2 mb-2 bg-gray-800 border border-gray-600 text-gray-300 rounded"
        />
        <textarea
          v-model="editableBio"
          placeholder="Enter new bio"
          class="w-full p-2 bg-gray-800 border border-gray-600 text-gray-300 rounded"
        ></textarea>
        <button
          @click="saveChanges"
          class="mt-2 w-full p-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded"
        >
          Save
        </button>
      </div>

      <!-- Counters -->
      <div class="flex justify-around mt-6 text-center">
        <div>
          <div class="text-lg font-bold text-violet-400">{{ githubCount }}</div>
          <div class="text-xs text-gray-400">GitHub</div>
        </div>
        <div>
          <div class="text-lg font-bold text-teal-400">{{ devtoCount }}</div>
          <div class="text-xs text-gray-400">Dev.to</div>
        </div>
        <div>
          <div class="text-lg font-bold text-orange-400">{{ devgateCount }}</div>
          <div class="text-xs text-gray-400">DevGate</div>
        </div>
      </div>

      <!-- Add this button below the counters in the template -->
      <div class="flex justify-center mt-8">
        <button @click="goToStats(editableGithub)" class="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white px-6 py-2 rounded-full font-semibold transition">
          Voir mes statistiques
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../composables/useFirestore';
import { fetchGithubProjects } from '../composables/useGithub.js';
import { fetchDevtoProjects } from '../composables/useDevto.js';
import { fetchManualProjects } from '../composables/useUser.js';
import axios from 'axios';
import { useRouter } from 'vue-router';

const props = defineProps({
  userId: { type: String, required: true }
});

const profile = ref({
  avatarUrl: '',
  name: '',
  username: '',
  bio: '',
  githubUsername: '',
  devtoUsername: ''
});

const githubCount = ref(0);
const devtoCount = ref(0);
const devgateCount = ref(0);
const editableName = ref('');
const editableUsername = ref('');
const editableBio = ref('');
const editableGithub = ref('');
const editableDevto = ref('');
const isEditing = ref(false);
const card = ref(null);
const router = useRouter();

const handleMouseMove = (e) => {
  const rect = card.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.value.style.setProperty('--mouse-x', `${x}px`);
  card.value.style.setProperty('--mouse-y', `${y}px`);
};

const resetMouse = () => {
  card.value.style.setProperty('--mouse-x', `-9999px`);
  card.value.style.setProperty('--mouse-y', `-9999px`);
};

const fetchFirestoreProfile = async () => {
  if (!props.userId) return;
  const userDocRef = doc(db, 'Users', props.userId);
  const snapshot = await getDoc(userDocRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    profile.value.name = data.Full_name || '';
    profile.value.username = data.username || '';
    profile.value.githubUsername = data.Github_username || '';
    profile.value.devtoUsername = data.Devto_username || '';
    profile.value.bio = data.bio || '';
    editableName.value = profile.value.name;
    editableUsername.value = profile.value.username;
    editableBio.value = profile.value.bio;
    editableGithub.value = profile.value.githubUsername;
    editableDevto.value = profile.value.devtoUsername;
  }
};

const fetchGithubProfile = async () => {
  if (!profile.value.githubUsername) return;
  try {
    const response = await axios.get(`https://api.github.com/users/${profile.value.githubUsername}`);
    const data = response.data;
    profile.value.avatarUrl = data.avatar_url;
    if (!profile.value.bio) profile.value.bio = data.bio || 'No bio available';
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
  }
};

const fetchProjectCounts = async () => {
  try {
    if (profile.value.githubUsername) {
      githubCount.value = (await fetchGithubProjects(profile.value.githubUsername)).length;
    }
    if (profile.value.devtoUsername) {
      devtoCount.value = (await fetchDevtoProjects(profile.value.devtoUsername)).length;
    }
    if (props.userId) {
      devgateCount.value = (await fetchManualProjects(props.userId)).length;
    }
  } catch (error) {
    console.error('Error fetching project counts:', error);
  }
};

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
};

const saveChanges = async () => {
  try {
    const userDocRef = doc(db, 'Users', props.userId);
    await updateDoc(userDocRef, {
      Full_name: editableName.value,
      username: editableUsername.value,
      Github_username: editableGithub.value,
      Devto_username: editableDevto.value,
      bio: editableBio.value
    });
    profile.value.name = editableName.value;
    profile.value.username = editableUsername.value;
    profile.value.githubUsername = editableGithub.value;
    profile.value.devtoUsername = editableDevto.value;
    profile.value.bio = editableBio.value;
    isEditing.value = false;
   
    await fetchGithubProfile();
    await fetchProjectCounts();
  } catch (error) {
    console.error('Error saving changes:', error);
  }
};

const loadProfile = async () => {
  await fetchFirestoreProfile();
  await fetchGithubProfile();
  await fetchProjectCounts();
};

function goToStats(username) {
  router.push({
    name: 'Stats',
    params: { username: username }
  });
}

onMounted(loadProfile);
watch(() => props.userId, loadProfile);
</script>

<style scoped>
.profile-card {
  background: transparent;
  box-shadow: none;
  transition: transform 0.4s ease;
}
.profile-card:hover {
  transform: translateY(-4px);
}
.interactive-glass-card {
  background: rgba(24, 25, 38, 0.9);
  border: 1.5px solid rgba(168, 85, 247, 0.2);
  backdrop-filter: blur(20px);
  position: relative;
  transition: transform 0.4s ease, background 0.4s ease, border 0.4s ease;
}
.interactive-glass-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(168, 85, 247, 0.15),
    transparent 60%
  );
  transition: background 0.4s ease;
  z-index: 1;
}
.interactive-glass-card:hover {
  border-color: rgba(168, 85, 247, 0.4);
}
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.9; }
}
.animate-pulse-subtle {
  animation: pulse-subtle 3s infinite ease-in-out;
}
</style>