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
            v-if="isCurrentUser"
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
          <div>
            <div class="text-lg font-bold text-pink-400">{{ profile.skills.length }}</div>
            <div class="text-xs text-gray-400">Skills</div>
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

        <!-- Add Project Button -->
        <div class="flex justify-center mt-4">
          <button
            v-if="isCurrentUser && !showAddProject"
            @click="showAddProject = true"
            class="bg-gradient-to-r from-teal-400 to-violet-500 hover:from-teal-500 hover:to-violet-600 text-white px-6 py-2 rounded-full font-semibold transition"
          >
            Add Project
          </button>
        </div>
        <div v-if="showAddProject" class="mt-4">
          <AddProject :userId="props.userId" @successfully-added="showAddProject = false" />
          <div class="flex justify-center mt-2">
            <button @click="showAddProject = false" class="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded-full">Cancel</button>
          </div>
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

        <!-- Skills Section -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-100">Skills</h3>
            <button
              v-if="isCurrentUser"
              @click="toggleSkillsEdit"
              class="w-8 h-8 flex items-center justify-center bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-full transition"
              title="Edit Skills"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" />
              </svg>
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mb-3">
            <div
              v-for="skill in profile.skills"
              :key="skill"
              class="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm flex items-center gap-1"
            >
              {{ skill }}
              <button
                v-if="isEditingSkills"
                @click="removeSkill(skill)"
                class="text-violet-400 hover:text-violet-300"
              >
                ×
              </button>
            </div>
          </div>
          
          <!-- Add Skill Form -->
          <div v-if="isEditingSkills" class="flex gap-2">
            <input
              type="text"
              v-model="newSkill"
              @keyup.enter="addSkill"
              placeholder="Add a new skill"
              class="flex-1 p-2 bg-gray-800 border border-gray-600 text-gray-300 rounded text-sm"
            />
            <button
              @click="addSkill"
              class="px-3 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>

        <!-- Goals Section -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-100">Goals</h3>
            <button
              v-if="isCurrentUser"
              @click="toggleGoalsEdit"
              class="w-8 h-8 flex items-center justify-center bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-full transition"
              title="Edit Goals"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" />
              </svg>
            </button>
          </div>
          <div v-if="profile.goals && profile.goals.length > 0" class="space-y-2 goals-container">
            <transition-group name="goal-list">
              <div
                v-for="goal in profile.goals"
                :key="goal"
                class="goal-item flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition"
              >
                <input
                  type="checkbox"
                  :id="'goal-' + goal"
                  :checked="false"
                  @change="completeGoal(goal)"
                  class="w-4 h-4 text-violet-500 bg-gray-700 border-gray-600 rounded focus:ring-violet-500"
                />
                <label :for="'goal-' + goal" class="text-gray-300 text-sm">{{ goal }}</label>
              </div>
            </transition-group>
          </div>
          <div v-else class="text-gray-400 text-sm italic">
            No goals set yet
          </div>
          
          <!-- Add Goal Form -->
          <div v-if="isEditingGoals" class="flex gap-2 mt-3">
            <input
              type="text"
              v-model="newGoal"
              @keyup.enter="addGoal"
              placeholder="Add a new goal"
              class="flex-1 p-2 bg-gray-800 border border-gray-600 text-gray-300 rounded text-sm"
            />
            <button
              @click="addGoal"
              class="px-3 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-xl max-w-sm w-full mx-4">
        <h3 class="text-xl font-semibold text-gray-100 mb-3">Complete Goal?</h3>
        <p class="text-gray-300 mb-4">Are you sure you want to mark "{{ goalToComplete }}" as completed?</p>
        <div class="flex gap-3">
          <button
            @click="confirmComplete"
            class="flex-1 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition"
          >
            Yes, complete it!
          </button>
          <button
            @click="cancelComplete"
            class="flex-1 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition"
          >
            No, keep it
          </button>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="showSuccess"
      class="fixed bottom-4 right-4 bg-violet-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-500"
      :class="{ 'opacity-0': !showSuccess }"
    >
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>Goal completed! Great job!</span>
      </div>
    </div>

    <!-- Add Project Modal -->
    <teleport to="body">
      <div v-if="showAddProject" class="modal-overlay" @click.self="showAddProject = false">
        <div class="modal-content">
          <AddProject :userId="props.userId" @successfully-added="showAddProject = false" />
          <div class="flex justify-center mt-2">
            <button @click="showAddProject = false" class="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded-full">Cancel</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, computed} from 'vue';
import {doc, getDoc, updateDoc, collection, addDoc, serverTimestamp} from 'firebase/firestore';
import {db} from '../composables/useFirestore';
import {fetchGithubProjects} from "../composables/useGithub.js";
import {fetchDevtoProjects} from '../composables/useDevto.js';
import {fetchManualProjects} from '../composables/useUser.js';
import {useRouter} from 'vue-router';
import {getAuth} from 'firebase/auth';
import AddProject from './AddProject.vue';

const props = defineProps({
  userId: {type: String, required: true},
  // Optional props for Profile.vue integration
  githubUsername: {type: String, default: ''},
  devtoUsername: {type: String, default: ''}
});

const emit = defineEmits(['profileUpdated', 'refreshProjects']);

const router = useRouter();
const auth = getAuth();
const loading = ref(true);
const saving = ref(false);
const githubLoading = ref(false);
const githubError = ref('');

// Add computed property to check if current user is the profile owner
const isCurrentUser = computed(() => {
  return auth.currentUser && auth.currentUser.uid === props.userId;
});

const profile = ref({
  avatarUrl: '',
  name: '',
  displayName: '',
  username: '',
  bio: '',
  githubUsername: '',
  devtoUsername: '',
  skills: [],
  goals: []
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
const newSkill = ref('');
const newGoal = ref('');

const showConfirmation = ref(false);
const goalToComplete = ref('');
const showSuccess = ref(false);

const isEditingSkills = ref(false);
const isEditingGoals = ref(false);

const showAddProject = ref(false);

const githubToken = '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';

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
      profile.value.skills = data.skills || [];
      profile.value.goals = data.goals || [];

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
        'Authorization': `token ${githubToken}`
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
  if (!isCurrentUser.value) return;
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
            'Authorization': `token ${githubToken}`
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
      bio: editableBio.value,
      skills: profile.value.skills,
      goals: profile.value.goals
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
      bio: profile.value.bio,
      skills: profile.value.skills,
      goals: profile.value.goals
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

const addSkill = async () => {
  if (newSkill.value.trim() && !profile.value.skills.includes(newSkill.value.trim())) {
    const skill = newSkill.value.trim();
    profile.value.skills.push(skill);
    newSkill.value = '';
    try {
      const userDocRef = doc(db, 'Users', props.userId);
      await updateDoc(userDocRef, {
        skills: profile.value.skills
      });
      // Ajout notification skill
      await addDoc(collection(db, 'Notifications'), {
        Created_At: serverTimestamp(),
        type: 'skill-ajouté',
        content: skill,
        userId: props.userId
      });
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  }
};

const removeSkill = async (skill) => {
  profile.value.skills = profile.value.skills.filter(s => s !== skill);
  try {
    const userDocRef = doc(db, 'Users', props.userId);
    await updateDoc(userDocRef, {
      skills: profile.value.skills
    });
  } catch (error) {
    console.error('Error removing skill:', error);
  }
};

const addGoal = async () => {
  if (newGoal.value.trim() && !profile.value.goals.includes(newGoal.value.trim())) {
    const goal = newGoal.value.trim();
    profile.value.goals.push(goal);
    newGoal.value = '';
    try {
      const userDocRef = doc(db, 'Users', props.userId);
      await updateDoc(userDocRef, {
        goals: profile.value.goals
      });
      // Ajout notification goal
      await addDoc(collection(db, 'Notifications'), {
        Created_At: serverTimestamp(),
        type: 'goal-ajouté',
        content: goal,
        userId: props.userId
      });
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  }
};

const completeGoal = async (goal) => {
  goalToComplete.value = goal;
  showConfirmation.value = true;
};

const confirmComplete = async () => {
  showConfirmation.value = false;
  // Add a small delay to show the animation
  await new Promise(resolve => setTimeout(resolve, 100));
  const completedGoal = goalToComplete.value;
  profile.value.goals = profile.value.goals.filter(g => g !== completedGoal);
  try {
    const userDocRef = doc(db, 'Users', props.userId);
    await updateDoc(userDocRef, {
      goals: profile.value.goals
    });
    // Ajout notification goal achevée
    await addDoc(collection(db, 'Notifications'), {
      Created_At: serverTimestamp(),
      type: 'goal-achevé',
      content: completedGoal,
      userId: props.userId
    });
    // Show success message
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
    }, 2000);
  } catch (error) {
    console.error('Error completing goal:', error);
  }
};

const cancelComplete = () => {
  showConfirmation.value = false;
  // Reset the checkbox
  const checkbox = document.getElementById(`goal-${goalToComplete.value}`);
  if (checkbox) {
    checkbox.checked = false;
  }
};

const toggleSkillsEdit = () => {
  if (!isCurrentUser.value) return;
  isEditingSkills.value = !isEditingSkills.value;
};

const toggleGoalsEdit = () => {
  if (!isCurrentUser.value) return;
  isEditingGoals.value = !isEditingGoals.value;
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
  max-height: 90vh;
  overflow-y: auto;
}

.profile-card::-webkit-scrollbar {
  width: 6px;
}

.profile-card::-webkit-scrollbar-track {
  background: rgba(168, 85, 247, 0.1);
  border-radius: 3px;
}

.profile-card::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.3);
  border-radius: 3px;
}

.profile-card::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.5);
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
  min-height: 100%;
  display: flex;
  flex-direction: column;
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

.goal-list-enter-active,
.goal-list-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
}

.goal-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.goal-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.goal-list-move {
  transition: transform 0.5s ease;
}

.goal-item {
  transition: all 0.3s ease;
  position: relative;
}

.goal-item:hover {
  transform: translateX(5px);
}

/* Add this to ensure proper animation container */
.goals-container {
  position: relative;
  min-height: 40px;
}

/* Add fade-in animation for success message */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fixed {
  animation: fadeIn 0.3s ease-out;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: linear-gradient(135deg, #232046 60%, #181622 100%);
  border-radius: 1.5rem;
  box-shadow: 0 12px 48px 0 rgba(126, 91, 239, 0.25), 0 2px 8px 0 rgba(0,0,0,0.18);
  border: 2px solid #a996f7;
  padding: 3rem 3rem 2.5rem 3rem;
  min-width: 600px;
  max-width: 800px;
  max-height: 92vh;
  overflow-y: auto;
  position: relative;
  animation: modal-pop 0.25s cubic-bezier(.4,2,.6,1) both;
}
</style>
