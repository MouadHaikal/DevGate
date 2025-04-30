<template>
  <div
    class="interactive-glass-card relative rounded-3xl overflow-hidden p-7 profile-card w-full"
    @mousemove="handleMouseMove"
    @mouseleave="resetMouse"
    ref="card"
  >
    <!-- ✨ Background Blurred Layer (Card Content) -->
    <div>
      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-8">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500 mb-3"></div>
        <p class="text-violet-400">Loading profile...</p>
      </div>

      <div v-else>
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
              {{ profile.name ? profile.name.charAt(0).toUpperCase() : '?' }}
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
          <h2 class="text-2xl font-bold text-gray-100">{{ profile.username || 'Your Name' }}</h2>
          <div class="text-md text-violet-400 font-mono mb-2">@{{ profile.githubUsername || 'username' }}</div>
          <hr class="w-2/3 mx-auto my-2 border-violet-600">
          <p class="text-gray-400 text-sm">{{ profile.bio || 'No bio available.' }}</p>
        </div>

        <!-- Edit Profile Form -->
        <div v-if="isEditing" class="mt-6 bg-gray-700 rounded-xl p-4">
          <div class="mb-2">
            <label class="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              v-model="editableName"
              placeholder="Enter your name"
              class="w-full p-2 bg-gray-800 border border-gray-600 text-gray-300 rounded"
            />
          </div>

          <div class="mb-2">
            <label class="block text-sm text-gray-400 mb-1">Username</label>
            <input
              type="text"
              v-model="editableUsername"
              placeholder="Enter username"
              class="w-full p-2 bg-gray-800 border border-gray-600 text-gray-300 rounded"
            />
          </div>

          <div class="mb-2">
            <label class="block text-sm text-gray-400 mb-1">GitHub Username</label>
            <div class="relative">
              <input
                type="text"
                v-model="editableGithub"
                placeholder="Enter your GitHub username"
                class="w-full p-2 bg-gray-800 border border-gray-600 text-gray-300 rounded"
              />
              <div v-if="githubLoading" class="absolute right-2 top-2 animate-spin h-5 w-5 border-b-2 border-violet-500 rounded-full"></div>
              <div v-if="githubError" class="text-red-400 text-xs mt-1">{{ githubError }}</div>
            </div>
          </div>

          <div class="mb-2">
            <label class="block text-sm text-gray-400 mb-1">Dev.to Username</label>
            <input
              type="text"
              v-model="editableDevto"
              placeholder="Enter your Dev.to username"
              class="w-full p-2 bg-gray-800 border border-gray-600 text-gray-300 rounded"
            />
          </div>

          <div class="mb-2">
            <label class="block text-sm text-gray-400 mb-1">Bio</label>
            <textarea
                v-model="editableBio"
                placeholder="Tell us about yourself"
                rows="3"
                class="w-full p-2 bg-gray-800 border border-gray-600 text-gray-300 rounded"
            ></textarea>
          </div>

          <div class="flex gap-2">
            <button
                @click="saveChanges"
                class="flex-1 p-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded"
                :disabled="saving"
            >
              <span v-if="saving" class="flex items-center justify-center gap-2">
                <span class="inline-block animate-spin h-4 w-4 border-b-2 border-white rounded-full"></span>
                Saving...
              </span>
              <span v-else>Save Changes</span>
            </button>

            <button
                @click="cancelEdit"
                class="flex-1 p-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
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

        <!-- GitHub Stats Button -->
        <div class="flex justify-center mt-6">
          <button
              @click="goToStats"
              class="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white px-6 py-2 rounded-full font-semibold transition"
              :disabled="!profile.githubUsername"
          >
            View GitHub Stats
          </button>
        </div>

        <!-- Connection Status -->
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="inline-flex items-center gap-1">
              <span class="text-xs text-gray-400">GitHub:</span>
              <span v-if="profile.githubUsername" class="text-xs text-green-400">Connected</span>
              <span v-else class="text-xs text-red-400">Disconnected</span>
            </div>
          </div>
          <div class="text-center">
            <div class="inline-flex items-center gap-1">
              <span class="text-xs text-gray-400">Dev.to:</span>
              <span v-if="profile.devtoUsername" class="text-xs text-green-400">Connected</span>
              <span v-else class="text-xs text-red-400">Disconnected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, computed} from 'vue';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db} from '../composables/useFirestore';
import {fetchGithubProjects} from "../composables/useGithub.js";
import {fetchDevtoProjects} from '../composables/useDevto.js';
import {fetchManualProjects} from '../composables/useUser.js';
import {useRouter} from 'vue-router';

const props = defineProps({
  userId: {type: String, required: true},
  // Optional props for Profile.vue integration
  githubUsername: {type: String, default: ''},
  devtoUsername: {type: String, default: ''}
});

const emit = defineEmits(['profileUpdated', 'refreshProjects']);

const router = useRouter();
const loading = ref(true);
const saving = ref(false);
const githubLoading = ref(false);
const githubError = ref('');

const profile = ref({
  avatarUrl: '',
  name: '',
  displayName: '',
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

const handleMouseMove = (e) => {
  if (!card.value) return;

  const rect = card.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.value.style.setProperty('--mouse-x', `${x}px`);
  card.value.style.setProperty('--mouse-y', `${y}px`);
};

const resetMouse = () => {
  if (!card.value) return;
  card.value.style.setProperty('--mouse-x', `-9999px`);
  card.value.style.setProperty('--mouse-y', `-9999px`);
};

const fetchFirestoreProfile = async () => {
  if (!props.userId) return;

  try {
    const userDocRef = doc(db, 'Users', props.userId);
    const snapshot = await getDoc(userDocRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      profile.value.name = data.Full_name || '';
      profile.value.displayName = data.displayName || '';
      profile.value.username = data.username || '';
      profile.value.githubUsername = data.Github_username || props.githubUsername || '';
      profile.value.devtoUsername = data.Devto_username || props.devtoUsername || '';
      profile.value.bio = data.bio || '';

      editableName.value = profile.value.name;
      editableUsername.value = profile.value.username;
      editableBio.value = profile.value.bio;
      editableGithub.value = profile.value.githubUsername;
      editableDevto.value = profile.value.devtoUsername;

      return true;
    }
    return false;
  } catch (error) {
    console.error('Error fetching Firestore profile:', error);
    return false;
  }
};

const fetchGithubProfile = async () => {
  if (!profile.value.githubUsername) {
    profile.value.avatarUrl = '';
    return;
  }

  try {
    // Use the GitHub API endpoints directly to avoid CORS issues
    const response = await fetch(`https://api.github.com/users/${profile.value.githubUsername}`, {
      headers: {
        'Authorization': `token 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`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`GitHub user '${profile.value.githubUsername}' not found`);
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    profile.value.avatarUrl = data.avatar_url;

    // Only update bio if it's empty and GitHub has one
    if (!profile.value.bio && data.bio) {
      profile.value.bio = data.bio;
      editableBio.value = data.bio;
    }

    return true;
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    return false;
  }
};

const fetchProjectCounts = async () => {
  try {
    if (profile.value.githubUsername) {
      githubCount.value = (await fetchGithubProjects(profile.value.githubUsername)).length;
    } else {
      githubCount.value = 0;
    }
    if (profile.value.devtoUsername) {
      devtoCount.value = (await fetchDevtoProjects(profile.value.devtoUsername)).length;
    } else {
      devtoCount.value = 0;
    }
    if (props.userId) {
      devgateCount.value = (await fetchManualProjects(props.userId)).length;
    } else {
      devgateCount.value = 0;
    }
  } catch (error) {
    console.error('Error fetching project counts:', error);
  }
};

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;

  if (isEditing.value) {
    // Reset editables to current values when entering edit mode
    editableName.value = profile.value.name;
    editableUsername.value = profile.value.username;
    editableBio.value = profile.value.bio;
    editableGithub.value = profile.value.githubUsername;
    editableDevto.value = profile.value.devtoUsername;
  }
};

const cancelEdit = () => {
  isEditing.value = false;
};

const saveChanges = async () => {
  saving.value = true;

  try {
    // Check if there are actual changes
    const hasChanges =
        editableName.value !== profile.value.name ||
        editableUsername.value !== profile.value.username ||
        editableGithub.value !== profile.value.githubUsername ||
        editableDevto.value !== profile.value.devtoUsername ||
        editableBio.value !== profile.value.bio;

    if (!hasChanges) {
      isEditing.value = false;
      return;
    }

    // Check if GitHub username is valid before saving
    if (editableGithub.value && editableGithub.value !== profile.value.githubUsername) {
      githubLoading.value = true;

      try {
        const response = await fetch(`https://api.github.com/users/${editableGithub.value}`, {
          headers: {
            'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            githubError.value = 'GitHub user not found';
            githubLoading.value = false;
            return;
          }
        }
      } finally {
        githubLoading.value = false;
      }
    }

    const userDocRef = doc(db, 'Users', props.userId);
    await updateDoc(userDocRef, {
      Full_name: editableName.value,
      username: editableUsername.value,
      Github_username: editableGithub.value,
      Devto_username: editableDevto.value,
      bio: editableBio.value
    });

    const oldGithubUsername = profile.value.githubUsername;
    const oldDevtoUsername = profile.value.devtoUsername;

    // Update local profile data
    profile.value.name = editableName.value;
    profile.value.username = editableUsername.value;
    profile.value.githubUsername = editableGithub.value;
    profile.value.devtoUsername = editableDevto.value;
    profile.value.bio = editableBio.value;

    // Exit edit mode
    isEditing.value = false;

    // Fetch updated GitHub profile and project counts
    await fetchGithubProfile();
    await fetchProjectCounts();

    // Emit profile updated event
    emit('profileUpdated', {
      name: profile.value.name,
      username: profile.value.username,
      githubUsername: profile.value.githubUsername,
      devtoUsername: profile.value.devtoUsername,
      bio: profile.value.bio
    });

    // Check if we need to refresh projects
    if (oldGithubUsername !== profile.value.githubUsername ||
        oldDevtoUsername !== profile.value.devtoUsername) {
      emit('refreshProjects');
    }
  } catch (error) {
    console.error('Error saving changes:', error);
  } finally {
    saving.value = false;
  }
};

const goToStats = () => {
  if (profile.value.githubUsername) {
    router.push({
      name: 'Stats',
      params: {username: profile.value.githubUsername}
    });
  }
};

const loadProfile = async () => {
  loading.value = true;

  try {
    await fetchFirestoreProfile();
    await fetchGithubProfile();
    await fetchProjectCounts();
  } catch (error) {
    console.error('Error loading profile:', error);
  } finally {
    loading.value = false;
  }
};

// Update profile if external props change
watch(() => [props.githubUsername, props.devtoUsername], ([newGithub, newDevto]) => {
  if (newGithub !== profile.value.githubUsername || newDevto !== profile.value.devtoUsername) {
    profile.value.githubUsername = newGithub || profile.value.githubUsername;
    profile.value.devtoUsername = newDevto || profile.value.devtoUsername;

    // Update editable values if not in edit mode
    if (!isEditing.value) {
      editableGithub.value = profile.value.githubUsername;
      editableDevto.value = profile.value.devtoUsername;
    }

    // Fetch updated data
    fetchGithubProfile();
    fetchProjectCounts();
  }
}, {immediate: true});

// Watch for user ID changes
watch(() => props.userId, (newUserId, oldUserId) => {
  if (newUserId && newUserId !== oldUserId) {
    loadProfile();
  }
});

onMounted(loadProfile);
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
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s infinite ease-in-out;
}
</style>