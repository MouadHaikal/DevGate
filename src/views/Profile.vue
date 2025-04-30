<template>
  <section class="w-full min-h-screen pt-20 fade-edge flex justify-center">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700 mx-auto"></div>
        <p class="mt-4 text-violet-700">Loading profile...</p>
      </div>
    </div>

    <!-- Main content: Projects on the left, Profile card on the right -->
    <div v-else class="flex w-full max-w-7xl gap-10 items-start">
      <!-- Left: Project list or details -->
      <div class="flex-1">
        <div v-if="selectedProject">
          <CardProjectDetail :project="selectedProject" @close="selectedProject = null" />
        </div>
        <div v-else class="flex flex-col items-center gap-8">
          <CardProject
            v-for="(project, index) in projects"
            :key="index"
            :project="project"
            @select="selectProject"
            class="max-w-4xl w-full"
          />
          <div v-if="projects.length === 0" class="text-center py-12">
            <div class="text-violet-400 text-xl mb-3">No projects found</div>
            <p class="text-gray-400">Connect your accounts to import projects or manually add new ones.</p>
          </div>
        </div>
      </div>
      <!-- Right: Profile card -->
      <div class="w-[22rem] shrink-0">
        <CardProfile
          :userId="currentUser?.uid"
          @profileUpdated="handleProfileUpdate"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';
import CardProfile from '../components/CardProfile.vue';
import CardProject from '../components/CardProject.vue';
import CardProjectDetail from '../components/CardProjectDetails.vue';
import { fetchGithubProjects } from '../composables/useGithub.js';
import { fetchDevtoProjects } from '../composables/useDevto.js';
import { fetchManualProjects } from '../composables/useUser.js';
import { db } from '../composables/useFirestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../composables/useAuth.js';

const projects = ref([]);
const selectedProject = ref(null);
const githubUsername = ref('');
const devtoUsername = ref('');

const { currentUser, isLoading } = useAuth();

async function loadUserData() {
  if (!currentUser.value) {
    isLoading.value = false;
    return;
  }

  try {
    const userDocRef = doc(db, 'Users', currentUser.value.uid);
    const snapshot = await getDoc(userDocRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      githubUsername.value = data.Github_username || '';
      devtoUsername.value = data.Devto_username || '';
      await loadProjects();
    } else {
      console.error('No user document found for ID:', currentUser.value.uid);
      // Create a new user document if it doesn't exist
      await setDoc(userDocRef, {
        admin: false,
        email: currentUser.value.email,
        username: currentUser.value.displayName || currentUser.value.email.split('@')[0],
        projects: []
      });
      projects.value = [];
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    projects.value = [];
  } finally {
    isLoading.value = false;
  }
}

async function loadProjects() {
  if (!currentUser.value) return;

  const loadingIndicator = showTemporaryLoadingMessage();

  try {
    const github = githubUsername.value ? await fetchGithubProjects(githubUsername.value) : [];
    const devto = devtoUsername.value ? await fetchDevtoProjects(devtoUsername.value) : [];
    const manual = await fetchManualProjects(currentUser.value.uid);
    projects.value = [...github, ...devto, ...manual].sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error loading projects:', error);
    projects.value = [];
  } finally {
    clearTimeout(loadingIndicator);
  }
}

// Show a temporary loading message when projects are being updated
function showTemporaryLoadingMessage() {
  const tempProjects = projects.value;

  // If we already have projects, show a loading indicator
  if (tempProjects.length > 0) {
    projects.value = [{
      title: "Loading projects...",
      description: "Fetching your latest projects...",
      isLoading: true,
      tags: []
    }];
  }

  return setTimeout(() => {
    // If loading takes too long, reset to previous projects
    if (projects.value.length === 1 && projects.value[0].isLoading) {
      projects.value = tempProjects;
    }
  }, 10000); // Safety timeout of 10 seconds
}

function selectProject(project) {
  selectedProject.value = project;
}

// New handler for profile updates from CardProfile component
function handleProfileUpdate(updatedProfile) {
  githubUsername.value = updatedProfile.githubUsername;
  devtoUsername.value = updatedProfile.devtoUsername;
  // Explicitly load the projects with new usernames
  loadProjects();
}

watch(currentUser, (newUser) => {
  if (newUser) {
    loadUserData();
  } else {
    projects.value = [];
  }
}, {immediate: true});

watch([githubUsername, devtoUsername], () => {
  loadProjects();
});
</script>

<style scoped>
.card-glass-detail {
  background: linear-gradient(135deg, rgba(30, 27, 38, 0.85) 60%, rgba(126, 91, 239, 0.12) 100%);
  border: 1.5px solid rgba(126, 91, 239, 0.15);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(126, 91, 239, 0.15);
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