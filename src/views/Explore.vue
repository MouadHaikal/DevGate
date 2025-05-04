<template>
    <section class="w-full min-h-screen pt-20 fade-edge flex justify-center">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex items-center justify-center h-screen">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700 mx-auto"></div>
          <p class="mt-4 text-violet-700">Loading explorer...</p>
        </div>
      </div>
  
      <!-- Error state -->
      <div v-else-if="error" class="flex items-center justify-center h-screen">
        <div class="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
          <div class="text-red-600 text-xl mb-3">Error Loading Content</div>
          <p class="text-gray-600">{{ error }}</p>
          <button @click="loadData" class="mt-4 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700">
            Try Again
          </button>
        </div>
      </div>
  
      <!-- Main content -->
      <div v-else class="w-full max-w-7xl px-4">
        <!-- Header with search and filters -->
        <div class="mb-8">
          <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h1 class="text-3xl font-bold text-white">Explore DevGate</h1>
            
            <div class="flex gap-3 items-center">
              <!-- Search input -->
              <div class="relative">
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Search projects or users..." 
                  class="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
                <div class="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <!-- Filter buttons -->
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
          </div>
  
          <!-- View toggle buttons -->
          <div class="flex gap-4 mb-6">
            <button
              @click="activeTab = 'projects'"
              class="px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2"
              :class="activeTab === 'projects'
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Latest Projects
            </button>
            <button
              @click="activeTab = 'updates'"
              class="px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2"
              :class="activeTab === 'updates'
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Recent Updates
            </button>
            <button
              @click="activeTab = 'devs'"
              class="px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2"
              :class="activeTab === 'devs'
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Developers
            </button>
          </div>
        </div>
  
        <!-- Projects Tab -->
        <div v-if="activeTab === 'projects'">
          <!-- Selected Project Detail View -->
          <div v-if="selectedProject">
            <CardProjectDetail
              :project="selectedProject"
              @close="selectedProject = null"
            />
          </div>
  
          <!-- Projects Grid -->
          <div v-else>
            <div v-if="isProjectsLoading" class="flex items-center gap-2 text-violet-400 text-sm mb-6">
              <div class="animate-spin h-4 w-4 border-b-2 border-violet-400 rounded-full"></div>
              <span>Loading projects...</span>
            </div>
  
            <div v-if="filteredProjects.length === 0 && !isProjectsLoading" class="text-center py-12">
              <div class="text-violet-400 text-xl mb-3">No projects found</div>
              <p class="text-gray-400" v-if="searchQuery">
                Try refining your search or changing the filters
              </p>
              <p class="text-gray-400" v-else>
                Check back later for new projects from the community
              </p>
            </div>
  
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TransitionGroup name="project-list">
                <div
                  v-for="project in filteredProjects"
                  :key="project.id || project.title"
                  class="interactive-glass-card relative rounded-3xl overflow-hidden p-1"
                  @mousemove="handleMouseMove"
                  @mouseleave="resetMouse"
                  ref="projectCards"
                >
                  <div class="p-6 project-card bg-transparent">
                    <!-- Source Logo -->
                    <div class="flex justify-end mb-2">
                      <img
                        v-if="project.source === 'github'"
                        src="../assets/logos/github-mark-white.png"
                        alt="GitHub"
                        class="w-6 h-6"
                      />
                      <img
                        v-else-if="project.source === 'devto'"
                        src="../assets/logos/devto-white.png"
                        alt="Dev.to"
                        class="w-6 h-6"
                      />
                      <div
                        v-else
                        class="w-6 h-6 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      >
                        M
                      </div>
                    </div>
  
                    <!-- Project Image -->
                    <div
                      v-if="project.imageUrl"
                      class="w-full h-44 bg-gray-800/50 rounded-lg overflow-hidden flex justify-center items-center mb-4"
                    >
                      <img
                        :src="project.imageUrl"
                        alt="Project Image"
                        class="object-cover w-full h-full"
                      />
                    </div>
  
                    <!-- Project Title -->
                    <div class="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2 line-clamp-1">
                      {{ project.title }}
                    </div>
  
                    <!-- Horizontal rule -->
                    <hr class="fancy-hr mb-4" />
  
                    <!-- User info -->
                    <div class="flex items-center gap-2 mb-4">
                      <div class="w-8 h-8 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {{ project.userName ? project.userName.charAt(0).toUpperCase() : 'U' }}
                      </div>
                      <span 
                        class="text-gray-300 hover:text-white cursor-pointer"
                        @click.stop="navigateToProfile(project.userId)"
                      >
                        {{ project.userName || 'Unknown User' }}
                      </span>
                    </div>
  
                    <!-- Description -->
                    <p class="text-gray-400 text-sm line-clamp-3 mb-4">
                      {{ project.description || 'No description provided' }}
                    </p>
  
                    <!-- Tech stack -->
                    <div class="flex flex-wrap gap-2 mb-4" v-if="project.stack && project.stack.length">
                      <span 
                        v-for="(tech, index) in project.stack.slice(0, 3)" 
                        :key="index"
                        class="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-md"
                      >
                        {{ tech }}
                      </span>
                      <span 
                        v-if="project.stack.length > 3"
                        class="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-md"
                      >
                        +{{ project.stack.length - 3 }}
                      </span>
                    </div>
  
                    <!-- Voir plus button -->
                    <button
                      class="fancy-button mt-2 px-4 py-2 text-white font-semibold rounded-lg transition w-full"
                      @click.stop="selectProject(project)"
                    >
                      Voir Détail ›
                    </button>
                  </div>
                </div>
              </TransitionGroup>
            </div>
  
            <!-- Load more button -->
            <div v-if="hasMoreProjects && !isProjectsLoading && filteredProjects.length > 0" class="flex justify-center mt-8">
              <button
                @click="loadMoreProjects"
                class="px-6 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                aria-label="Load more projects"
              >
                Load more projects
              </button>
            </div>
  
            <!-- Loading more indicator -->
            <div v-if="isLoadingMore" class="flex justify-center items-center gap-2 text-violet-400 text-sm mt-8">
              <div class="animate-spin h-5 w-5 border-b-2 border-violet-400 rounded-full"></div>
              <span>Loading more projects...</span>
            </div>
          </div>
        </div>
  
        <!-- Updates Tab -->
        <div v-else-if="activeTab === 'updates'">
          <div v-if="isUpdatesLoading" class="flex items-center gap-2 text-violet-400 text-sm mb-6">
            <div class="animate-spin h-4 w-4 border-b-2 border-violet-400 rounded-full"></div>
            <span>Loading updates...</span>
          </div>
  
          <div v-else-if="updates.length === 0" class="text-center py-12">
            <div class="text-violet-400 text-xl mb-3">No recent updates</div>
            <p class="text-gray-400">
              Check back later for new activity from the community
            </p>
          </div>
  
          <div v-else>
            <!-- Timeline of updates -->
            <div class="max-w-3xl mx-auto">
              <TransitionGroup name="update-list">
                <div 
                  v-for="update in filteredUpdates" 
                  :key="update.id"
                  class="interactive-glass-card relative rounded-xl overflow-hidden p-1 mb-6"
                  @mousemove="handleMouseMove"
                  @mouseleave="resetMouse"
                  ref="updateCards"
                >
                  <div class="p-5 update-card bg-transparent">
                    <!-- Update header -->
                    <div class="flex items-center gap-3 mb-4">
                      <!-- User avatar -->
                      <div 
                        class="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
                        @click="navigateToProfile(update.userId)"
                      >
                        {{ update.userName ? update.userName.charAt(0).toUpperCase() : 'U' }}
                      </div>
                      
                      <div class="flex-1">
                        <!-- Username and action -->
                        <div class="flex items-center gap-2">
                          <span 
                            class="text-gray-200 font-medium cursor-pointer hover:text-white"
                            @click="navigateToProfile(update.userId)"
                          >
                            {{ update.userName || 'Unknown User' }}
                          </span>
                          <span class="text-gray-400">{{ getUpdateAction(update) }}</span>
                        </div>
                        
                        <!-- Timestamp -->
                        <div class="text-xs text-gray-500">
                          {{ formatTimestamp(update.timestamp) }}
                        </div>
                      </div>
                      
                      <!-- Update type badge -->
                      <div :class="`px-2 py-1 rounded-md text-xs font-medium ${getUpdateTypeBadgeClass(update.type)}`">
                        {{ update.type }}
                      </div>
                    </div>
                    
                    <!-- Update content -->
                    <div class="mb-3">
                      <!-- Project update -->
                      <div v-if="update.type === 'project'">
                        <div class="text-lg font-semibold text-white mb-2">{{ update.title }}</div>
                        <p class="text-gray-400 text-sm mb-3">{{ update.description }}</p>
                        
                        <!-- Tech stack -->
                        <div class="flex flex-wrap gap-2 mb-3" v-if="update.stack && update.stack.length">
                          <span 
                            v-for="(tech, index) in update.stack.slice(0, 5)" 
                            :key="index"
                            class="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-md"
                          >
                            {{ tech }}
                          </span>
                          <span 
                            v-if="update.stack.length > 5"
                            class="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-md"
                          >
                            +{{ update.stack.length - 5 }}
                          </span>
                        </div>
                        
                        <!-- Project action button -->
                        <button
                          class="fancy-button px-4 py-1 text-white text-sm font-semibold rounded-lg transition"
                          @click="selectProjectFromUpdate(update)"
                        >
                          View Project ›
                        </button>
                      </div>
                      
                      <!-- Skill update -->
                      <div v-else-if="update.type === 'skill'">
                        <div class="flex items-center gap-3 mb-2">
                          <div class="w-8 h-8 bg-gradient-to-tr from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {{ update.skill ? update.skill.charAt(0).toUpperCase() : 'S' }}
                          </div>
                          <span class="text-lg font-semibold text-white">{{ update.skill }}</span>
                          <span class="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-md">
                            {{ update.level }}
                          </span>
                        </div>
                      </div>
                      
                      <!-- Objective update -->
                      <div v-else-if="update.type === 'objective'">
                        <div class="text-lg font-semibold text-white mb-2">{{ update.objective }}</div>
                        
                        <!-- Progress bar if available -->
                        <div v-if="update.progress !== undefined" class="mb-2">
                          <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              class="h-full bg-gradient-to-r from-violet-500 to-purple-500" 
                              :style="`width: ${update.progress}%`"
                            ></div>
                          </div>
                          <div class="text-xs text-gray-400 mt-1">{{ update.progress }}% complete</div>
                        </div>
                      </div>
                      
                      <!-- Generic update content -->
                      <div v-else>
                        <p class="text-gray-300">{{ update.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
              
              <!-- Load more updates button -->
              <div v-if="hasMoreUpdates && !isUpdatesLoading" class="flex justify-center mt-6">
                <button
                  @click="loadMoreUpdates"
                  class="px-6 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Load more updates
                </button>
              </div>
              
              <!-- Loading more indicator -->
              <div v-if="isLoadingMore" class="flex justify-center items-center gap-2 text-violet-400 text-sm mt-6">
                <div class="animate-spin h-5 w-5 border-b-2 border-violet-400 rounded-full"></div>
                <span>Loading more updates...</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Developers Tab -->
        <div v-else-if="activeTab === 'devs'">
          <div v-if="isUsersLoading" class="flex items-center gap-2 text-violet-400 text-sm mb-6">
            <div class="animate-spin h-4 w-4 border-b-2 border-violet-400 rounded-full"></div>
            <span>Loading developers...</span>
          </div>
  
          <div v-else-if="users.length === 0" class="text-center py-12">
            <div class="text-violet-400 text-xl mb-3">No developers found</div>
            <p class="text-gray-400" v-if="searchQuery">
              Try refining your search criteria
            </p>
            <p class="text-gray-400" v-else>
              Check back later for new members
            </p>
          </div>
  
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TransitionGroup name="user-list">
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                class="interactive-glass-card relative rounded-xl overflow-hidden p-1"
                @mousemove="handleMouseMove"
                @mouseleave="resetMouse"
                ref="userCards"
                @click="navigateToProfile(user.id)"
              >
                <div class="p-5 dev-card bg-transparent cursor-pointer">
                  <!-- User header -->
                  <div class="flex items-center gap-4 mb-4">
                    <!-- User avatar -->
                    <div class="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {{ user.username ? user.username.charAt(0).toUpperCase() : 'U' }}
                    </div>
                    
                    <div>
                      <!-- Username -->
                      <div class="text-xl font-bold text-white">{{ user.username }}</div>
                      
                      <!-- Join date -->
                      <div class="text-sm text-gray-400">
                        Member since {{ formatDate(user.joinDate) }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- User stats -->
                  <div class="grid grid-cols-3 gap-2 mb-4">
                    <div class="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-white">{{ user.stats?.projects || 0 }}</div>
                      <div class="text-xs text-gray-400">Projects</div>
                    </div>
                    <div class="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-white">{{ user.stats?.skills || 0 }}</div>
                      <div class="text-xs text-gray-400">Skills</div>
                    </div>
                    <div class="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-white">{{ user.stats?.objectives || 0 }}</div>
                      <div class="text-xs text-gray-400">Objectives</div>
                    </div>
                  </div>
                  
                  <!-- Top skills -->
                  <div v-if="user.topSkills && user.topSkills.length" class="mb-3">
                    <div class="text-sm font-medium text-gray-300 mb-2">Top Skills</div>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="(skill, index) in user.topSkills.slice(0, 3)" 
                        :key="index"
                        class="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-md"
                      >
                        {{ skill }}
                      </span>
                      <span 
                        v-if="user.topSkills.length > 3"
                        class="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-md"
                      >
                        +{{ user.topSkills.length - 3 }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- View profile button -->
                  <button
                    class="fancy-button mt-2 w-full px-4 py-2 text-white font-semibold rounded-lg transition"
                  >
                    View Profile ›
                  </button>
                </div>
              </div>
            </TransitionGroup>
            
            <!-- Load more users button -->
            <div v-if="hasMoreUsers && !isUsersLoading" class="flex justify-center mt-8 col-span-1 md:col-span-2 lg:col-span-3">
              <button
                @click="loadMoreUsers"
                class="px-6 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
              >
                Load more developers
              </button>
            </div>
            
            <!-- Loading more indicator -->
            <div v-if="isLoadingMore" class="flex justify-center items-center gap-2 text-violet-400 text-sm mt-8 col-span-1 md:col-span-2 lg:col-span-3">
              <div class="animate-spin h-5 w-5 border-b-2 border-violet-400 rounded-full"></div>
              <span>Loading more developers...</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import CardProjectDetail from '../components/CardProjectDetails.vue';
  import { fetchManualProjects } from '../composables/useUser';
  import { fetchGithubProjects } from '../composables/useGithub';
  import { fetchDevtoProjects } from '../composables/useDevto';
  import { collection, query, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
  import { db } from '../composables/useFirestore';
  
  // Router setup
  const router = useRouter();
  
  // States
  const isLoading = ref(true);
  const error = ref(null);
  const searchQuery = ref('');
  const activeFilter = ref('all');
  const activeTab = ref('projects');
  const selectedProject = ref(null);
  
  // Projects states
  const projects = ref([]);
  const isProjectsLoading = ref(false);
  const lastVisibleProject = ref(null);
  const hasMoreProjects = ref(true);
  
  // Updates states
  const updates = ref([]);
  const isUpdatesLoading = ref(false);
  const lastVisibleUpdate = ref(null);
  const hasMoreUpdates = ref(true);
  
  // Users states
  const users = ref([]);
  const isUsersLoading = ref(false);
  const lastVisibleUser = ref(null);
  const hasMoreUsers = ref(true);
  
  const isLoadingMore = ref(false);
  
  // Refs for interactive cards
  const projectCards = ref([]);
  const updateCards = ref([]);
  const userCards = ref([]);
  
  // Main data loading function
  const loadData = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      console.log("Initial data load for tab:", activeTab.value);
      // Load initial data based on active tab
      if (activeTab.value === 'projects') {
        await loadProjects();
      } else if (activeTab.value === 'updates') {
        await loadUpdates();
      } else if (activeTab.value === 'devs') {
        await loadUsers();
      }
    } catch (err) {
      console.error('Error loading data:', err);
      error.value = 'Failed to load content. Please try again later.';
    } finally {
      isLoading.value = false;
    }
  };
  
  // Projects loading functions
  const loadProjects = async () => {
    isProjectsLoading.value = true;
    error.value = null;
    projects.value = []; // Reset projects array

    try {
      // 1. Fetch all users from Firestore
      const usersRef = collection(db, 'Users');
      const usersSnapshot = await getDocs(usersRef);
      
      // 2. Process each user's projects
      const allProjects = [];
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;
        const userName = userData.username || 'Anonymous';
        
        // Fetch GitHub projects
        if (userData.Github_username) {
          try {
            const githubProjects = await fetchGithubProjects(userData.Github_username);
            if (Array.isArray(githubProjects)) {
              const formattedGithubProjects = githubProjects.map(project => ({
                ...project,
                userId,
                userName,
                source: 'github'
              }));
              allProjects.push(...formattedGithubProjects);
            }
          } catch (error) {
            console.warn(`Error fetching GitHub projects for ${userData.Github_username}:`, error);
          }
        }
        
        // Fetch Dev.to projects
        if (userData.Devto_username) {
          try {
            const devtoProjects = await fetchDevtoProjects(userData.Devto_username);
            if (Array.isArray(devtoProjects)) {
              const formattedDevtoProjects = devtoProjects.map(project => ({
                ...project,
                userId,
                userName,
                source: 'devto'
              }));
              allProjects.push(...formattedDevtoProjects);
            }
          } catch (error) {
            console.warn(`Error fetching Dev.to projects for ${userData.Devto_username}:`, error);
          }
        }
        
        // Fetch manual projects from Firestore
        if (userData.projects && Array.isArray(userData.projects)) {
          const formattedManualProjects = userData.projects.map(project => ({
            ...project,
            userId,
            userName,
            source: 'manual'
          }));
          allProjects.push(...formattedManualProjects);
        }
      }
      
      // Sort projects by updated date (most recent first)
      projects.value = allProjects.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return dateB - dateA;
      });
      
      // Update pagination state
      hasMoreProjects.value = projects.value.length > 0;
      lastVisibleProject.value = projects.value[projects.value.length - 1];
      
    } catch (error) {
      console.error('Error loading projects:', error);
      error.value = 'Failed to load projects. Please try again later.';
    } finally {
      isProjectsLoading.value = false;
    }
  };
  
  // Add loadMoreProjects function for pagination
  const loadMoreProjects = async () => {
    if (isLoadingMore.value || !hasMoreProjects.value || !lastVisibleProject.value) return;
    
    isLoadingMore.value = true;
    try {
      // Implement pagination logic here if needed
      // For now, we'll just set hasMoreProjects to false
      hasMoreProjects.value = false;
    } catch (error) {
      console.error('Error loading more projects:', error);
      error.value = 'Failed to load more projects. Please try again later.';
    } finally {
      isLoadingMore.value = false;
    }
  };

  // Watch for changes in search query or active filter
  const filteredProjects = computed(() => {
    let filtered = projects.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );
    }

    if (activeFilter.value !== 'all') {
      filtered = filtered.filter(project => project.source === activeFilter.value);
    }

    return filtered;
  });

  // Mouse interaction handlers for cards
  const handleMouseMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const resetMouse = (event) => {
    const card = event.currentTarget;
    card.style.setProperty('--mouse-x', '-9999px');
    card.style.setProperty('--mouse-y', '-9999px');
  };

  // Fetch all users from Firestore and log them
  async function fetchAndLogAllUsers() {
    try {
      const usersRef = collection(db, 'Users');
      const usersQuery = query(usersRef, orderBy('username', 'asc'));
      const snapshot = await getDocs(usersQuery);
      const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('All Firestore users:', allUsers);
      return allUsers;
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    }
  }

  // Initial data load
  onMounted(() => {
    console.log('Explore.vue onMounted called');
    if (activeTab.value === 'devs') {
      loadUsers();
    }
    fetchAndLogAllUsers();
    loadData();
  });

  // Add this new function before loadUsers
  const calculateTotalProjects = async (userData, userId) => {
    let totalProjects = 0;

    // Count manual projects from Firestore subcollection
    try {
      const manualProjects = await fetchManualProjects(userId);
      if (Array.isArray(manualProjects)) {
        totalProjects += manualProjects.length;
      }
    } catch (error) {
      console.warn(`Error fetching manual projects for user ${userId}:`, error);
    }

    // Count GitHub projects
    if (userData.Github_username) {
      try {
        const githubProjects = await fetchGithubProjects(userData.Github_username);
        if (Array.isArray(githubProjects)) {
          totalProjects += githubProjects.length;
        }
      } catch (error) {
        console.warn(`Error fetching GitHub projects for ${userData.Github_username}:`, error);
      }
    }

    // Count Dev.to projects
    if (userData.Devto_username) {
      try {
        const devtoProjects = await fetchDevtoProjects(userData.Devto_username);
        if (Array.isArray(devtoProjects)) {
          totalProjects += devtoProjects.length;
        }
      } catch (error) {
        console.warn(`Error fetching Dev.to projects for ${userData.Devto_username}:`, error);
      }
    }

    return totalProjects;
  };

  // Add this new function to load users data
  const loadUsers = async () => {
    isUsersLoading.value = true;
    error.value = null;
    try {
      console.log("Loading users...");
      // Fetch users from Firestore
      const usersRef = collection(db, 'Users');
      const usersQuery = query(
        usersRef,
        orderBy('username', 'asc'),
        limit(9)
      );
      const snapshot = await getDocs(usersQuery);
      console.log("Users snapshot:", snapshot.size, "documents found");
      
      if (snapshot.empty) {
        users.value = [];
        hasMoreUsers.value = false;
        console.log("No users found in Firestore");
      } else {
        // For each user, fetch all project sources and sum
        const usersList = await Promise.all(snapshot.docs.map(async doc => {
          const userData = doc.data();
          const userId = doc.id;
          let totalProjects = 0;

          // Manual projects from Firestore subcollection
          try {
            const manualProjects = await fetchManualProjects(userId);
            if (Array.isArray(manualProjects)) {
              totalProjects += manualProjects.length;
            }
          } catch (error) {
            console.warn(`Error fetching manual projects for user ${userId}:`, error);
          }

          // GitHub projects
          if (userData.Github_username) {
            try {
              const githubProjects = await fetchGithubProjects(userData.Github_username);
              if (Array.isArray(githubProjects)) {
                totalProjects += githubProjects.length;
              }
            } catch (error) {
              console.warn(`Error fetching GitHub projects for ${userData.Github_username}:`, error);
            }
          }

          // Dev.to projects
          if (userData.Devto_username) {
            try {
              const devtoProjects = await fetchDevtoProjects(userData.Devto_username);
              if (Array.isArray(devtoProjects)) {
                totalProjects += devtoProjects.length;
              }
            } catch (error) {
              console.warn(`Error fetching Dev.to projects for ${userData.Devto_username}:`, error);
            }
          }

          return {
            id: userId,
            username: userData.username || 'Anonymous',
            joinDate: userData.createdAt?.toDate() || new Date(),
            stats: {
              projects: totalProjects,
              skills: Array.isArray(userData.skills) ? userData.skills.length : 0,
              objectives: Array.isArray(userData.goals) ? userData.goals.length : 0
            },
            topSkills: userData.skills || []
          };
        }));
        
        users.value = usersList;
        lastVisibleUser.value = snapshot.docs[snapshot.docs.length - 1];
        hasMoreUsers.value = snapshot.docs.length === 9;
      }
    } catch (err) {
      console.error('Error loading users:', err);
      error.value = 'Failed to load developers. Please try again later.';
    } finally {
      isUsersLoading.value = false;
    }
  };

  // Add filtering for users based on search query
  const filteredUsers = computed(() => {
    console.log('Filtering users:', users.value);
    if (!searchQuery.value) return users.value;
    const query = searchQuery.value.toLowerCase();
    return users.value.filter(user =>
      user.username.toLowerCase().includes(query) ||
      user.topSkills?.some(skill => skill.toLowerCase().includes(query))
    );
  });

  // Watch for tab switching to load users if needed
  watch(activeTab, async (newTab) => {
    console.log("Tab changed to:", newTab);
    if (newTab === 'devs' && users.value.length === 0 && !isUsersLoading.value) {
      console.log("Loading users due to tab change");
      await loadUsers();
    } else if (newTab === 'projects' && projects.value.length === 0 && !isProjectsLoading.value) {
      await loadProjects();
    } else if (newTab === 'updates' && updates.value.length === 0 && !isUpdatesLoading.value) {
      await loadUpdates();
    }
  });

  // Add format date helper function
  const formatDate = (date) => {
    if (!date) return 'Unknown';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Unknown';
    }
  };

  // Add helper function for navigation to profile
  const navigateToProfile = (userId) => {
    if (!userId) return;
    router.push(`/profile/${userId}`);
  };
  </script>

<style scoped>
.fade-edge {
  background: linear-gradient(to bottom, rgba(17, 24, 39, 0.5), rgba(17, 24, 39, 1));
}

.interactive-glass-card {
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.interactive-glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.project-list-enter-active,
.project-list-leave-active {
  transition: all 0.5s ease;
}

.project-list-enter-from,
.project-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.update-list-enter-active,
.update-list-leave-active {
  transition: all 0.5s ease;
}

.update-list-enter-from,
.update-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.user-list-enter-active,
.user-list-leave-active {
  transition: all 0.5s ease;
}

.user-list-enter-from,
.user-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fancy-hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(139, 92, 246, 0.5), transparent);
}

.fancy-button {
  background: linear-gradient(to right, rgba(139, 92, 246, 0.8), rgba(124, 58, 237, 0.8));
  transition: all 0.3s ease;
}

.fancy-button:hover {
  background: linear-gradient(to right, rgba(139, 92, 246, 1), rgba(124, 58, 237, 1));
  transform: translateY(-1px);
}
</style>