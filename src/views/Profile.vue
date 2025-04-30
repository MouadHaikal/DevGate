<template>
  <section class="w-full min-h-screen pt-20 fade-edge flex justify-center">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700 mx-auto"></div>
        <p class="mt-4 text-violet-700">Loading profile...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex items-center justify-center h-screen">
      <div class="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
        <div class="text-red-600 text-xl mb-3">Error Loading Profile</div>
        <p class="text-gray-600">{{ error }}</p>
        <button @click="loadUserData" class="mt-4 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700">
          Try Again
        </button>
      </div>
    </div>

    <!-- Main content: Projects on the left, Profile card on the right -->
    <div v-else class="flex w-full max-w-7xl gap-10 px-4 items-start">
      <!-- Left: Project list or details -->
      <div class="flex-1">
        <!-- Project filter controls -->
        <div v-if="!selectedProject" class="mb-6">
          <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
            <h2 class="text-2xl font-bold text-white">Projects ({{ filteredProjects.length }})</h2>
            <div class="flex gap-2">
              <button
                v-for="source in ['all', 'github', 'devto', 'manual']"
                :key="source"
                @click="activeFilter = source"
                class="px-3 py-1 rounded-md text-sm transition-colors"
                :class="activeFilter === source
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
              >
                {{ source === 'all' ? 'All' : source.charAt(0).toUpperCase() + source.slice(1) }}
              </button>
            </div>
          </div>

          <div v-if="isProjectsLoading" class="flex items-center gap-2 text-violet-400 text-sm mb-6">
            <div class="animate-spin h-4 w-4 border-b-2 border-violet-400 rounded-full"></div>
            <span>Refreshing projects...</span>
          </div>
        </div>

        <!-- Project detail view -->
        <div v-if="selectedProject">
          <CardProjectDetail
              :project="selectedProject"
              @close="selectedProject = null"
          />
        </div>

        <!-- Project list view -->
        <div v-else class="flex flex-col items-center gap-8">
          <TransitionGroup name="project-list">
            <CardProject
                v-for="project in filteredProjects"
                :key="project.id || project.title"
                :project="project"
                @select="selectProject"
                class="max-w-4xl w-full"
            />
          </TransitionGroup>

          <!-- Empty state -->
          <div v-if="filteredProjects.length === 0" class="text-center py-12">
            <div class="text-violet-400 text-xl mb-3">
              {{ noProjectsMessage }}
            </div>
            <p class="text-gray-400">
              {{
                activeFilter === 'all'
                    ? 'Connect your accounts to import projects or manually add new ones.'
                    : `No ${activeFilter} projects found. Try connecting your ${activeFilter} account in your profile.`
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right: Profile card -->
      <div class="w-[22rem] shrink-0 sticky top-24">
        <CardProfile
            :userId="currentUser?.uid"
            :githubUsername="githubUsername"
            :devtoUsername="devtoUsername"
            @profileUpdated="handleProfileUpdate"
            @refreshProjects="loadProjects"
        />

        <!-- Refresh button -->
        <button
            v-if="projects.length > 0"
            @click="refreshAllProjects"
            class="mt-4 w-full py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            :disabled="isProjectsLoading"
        >
          <span v-if="isProjectsLoading" class="animate-spin h-4 w-4 border-b-2 border-gray-300 rounded-full"></span>
          <span>{{ isProjectsLoading ? 'Refreshing...' : 'Refresh Projects' }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, computed, watch} from 'vue';
import CardProfile from '../components/CardProfile.vue';
import CardProject from '../components/CardProject.vue';
import CardProjectDetail from '../components/CardProjectDetails.vue';
import {fetchGithubProjects, clearGithubCache} from "../composables/useGithub.js";
import {fetchDevtoProjects} from '../composables/useDevto.js';
import {fetchManualProjects} from '../composables/useUser.js';
import {db} from '../composables/useFirestore';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {useAuth} from '../composables/useAuth.js';

const projects = ref([]);
const selectedProject = ref(null);
const githubUsername = ref('');
const devtoUsername = ref('');
const isLoading = ref(true);
const error = ref(null);
const isProjectsLoading = ref(false);
const activeFilter = ref('all');

const {currentUser} = useAuth();

// Compute filtered projects based on the active filter
const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') {
    return projects.value;
  }
  return projects.value.filter(project => project.source === activeFilter.value);
});

// Compute message for empty projects state
const noProjectsMessage = computed(() => {
  if (activeFilter.value === 'all') {
    return 'No projects found';
  }
  return `No ${activeFilter.value} projects found`;
});

async function loadUserData() {
  if (!currentUser.value) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const userDocRef = doc(db, 'Users', currentUser.value.uid);
    const snapshot = await getDoc(userDocRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      githubUsername.value = data.Github_username || '';
      devtoUsername.value = data.Devto_username || '';
      await loadProjects();
    } else {
      console.log('Creating new user document for:', currentUser.value.uid);
      // Create a new user document if it doesn't exist
      await setDoc(userDocRef, {
        admin: false,
        email: currentUser.value.email,
        username: currentUser.value.displayName || currentUser.value.email.split('@')[0],
        projects: []
      });
      projects.value = [];
    }
  } catch (err) {
    console.error('Error loading user data:', err);
    error.value = 'Could not load your profile data. Please try again later.';
    projects.value = [];
  } finally {
    isLoading.value = false;
  }
}

async function loadProjects() {
  if (!currentUser.value) return;

  isProjectsLoading.value = true;
  error.value = null;

  try {
    // Create a unique ID for each project source to avoid duplicates
    const createSourceId = (source, id) => `${source}-${id}`;

    // Load projects from all sources
    const [github, devto, manual] = await Promise.all([
      githubUsername.value ? fetchGithubProjects(githubUsername.value).catch(err => {
        console.error('GitHub error:', err);
        return [];
      }) : [],

      devtoUsername.value ? fetchDevtoProjects(devtoUsername.value).catch(err => {
        console.error('Dev.to error:', err);
        return [];
      }) : [],

      fetchManualProjects(currentUser.value.uid).catch(err => {
        console.error('Manual projects error:', err);
        return [];
      })
    ]);

    // Process GitHub projects
    const githubProjects = github.map(project => ({
      ...project,
      id: createSourceId('github', project.id || project.title)
    }));

    // Process Dev.to projects
    const devtoProjects = devto.map(project => ({
      ...project,
      id: createSourceId('devto', project.id || project.title)
    }));

    // Process manual projects
    const manualProjects = manual.map(project => ({
      ...project,
      id: createSourceId('manual', project.id || project.title)
    }));

    // Combine and sort by updated date (most recent first)
    projects.value = [...githubProjects, ...devtoProjects, ...manualProjects]
        .sort((a, b) => {
          const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt || 0);
          const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt || 0);
          return dateB - dateA;
        });

  } catch (err) {
    console.error('Error loading projects:', err);
    error.value = 'Could not load your projects. Please try again later.';
  } finally {
    isProjectsLoading.value = false;
  }
}

function selectProject(project) {
  selectedProject.value = project;
  // Scroll to top when selecting a project
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// Handle profile updates from CardProfile component
function handleProfileUpdate(updatedProfile) {
  const prevGithub = githubUsername.value;
  const prevDevto = devtoUsername.value;

  githubUsername.value = updatedProfile.githubUsername;
  devtoUsername.value = updatedProfile.devtoUsername;

  // Only reload projects if usernames have changed
  if (prevGithub !== githubUsername.value || prevDevto !== devtoUsername.value) {
    loadProjects();
  }
}

// Force refresh all projects by clearing caches
async function refreshAllProjects() {
  if (isProjectsLoading.value) return;

  isProjectsLoading.value = true;

  // Clear GitHub cache
  if (githubUsername.value) {
    clearGithubCache(githubUsername.value);
  }

  // Clear other caches if you have them
  // clearDevtoCache(devtoUsername.value);

  // Reload projects
  await loadProjects();
}

// Watch for user changes
watch(currentUser, (newUser) => {
  if (newUser) {
    loadUserData();
  } else {
    projects.value = [];
    githubUsername.value = '';
    devtoUsername.value = '';
    isLoading.value = false;
  }
}, {immediate: true});
</script>

<style scoped>
.fade-edge {
  background: transparent;
  box-shadow: none;
  border: none;
}

.project-list-enter-active,
.project-list-leave-active {
  transition: all 0.3s ease;
}

.project-list-enter-from,
.project-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>