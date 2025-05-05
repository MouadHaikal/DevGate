<template>
  <div class="github-stats-container">
    <h2>GitHub Statistics for {{ username }}</h2>

    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>Loading GitHub statistics...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
      <button @click="retry" class="retry-button">Retry</button>
    </div>

    <div v-else>
      <div class="profile-stats-row">
        <div class="user-profile">
          <div class="user-avatar">
            <img :src="stats.avatarUrl" alt="Profile Image" v-if="stats.avatarUrl" />
            <div class="avatar-placeholder" v-else>{{ username.charAt(0).toUpperCase() }}</div>
          </div>
          <div class="user-info">
            <h3>{{ stats.name || username }}</h3>
            <p v-if="stats.bio">{{ stats.bio }}</p>
            <div class="user-meta" v-if="stats.location">
              <span><i class="fas fa-map-marker-alt"></i> {{ stats.location }}</span>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <h3>Public Repositories</h3>
          <p class="stat-value">{{ stats.publicRepos }}</p>
        </div>
        <div class="stat-card">
          <h3>Followers</h3>
          <p class="stat-value">{{ stats.followers }}</p>
        </div>
        <div class="stat-card">
          <h3>Top Languages</h3>
          <div class="language-badges">
            <span v-for="(lang, index) in stats.topLanguages" :key="index" class="language-badge">
              {{ lang }}
            </span>
            <span v-if="!stats.topLanguages || stats.topLanguages.length === 0" class="language-badge empty">
              No languages detected
            </span>
          </div>
        </div>
      </div>

      <!-- Skills Section -->
      <div class="skills-section" v-if="stats.skills && stats.skills.length > 0">
        <h3>Skills</h3>
        <div class="skills-grid">
          <div v-for="skill in stats.skills" :key="skill" class="skill-badge">
            {{ skill }}
          </div>
        </div>
      </div>

      <div class="activity-chart" v-if="!chartLoading && repoActivityByMonth.some(count => count > 0)">
        <h3>Repository Activity</h3>
        <div class="chart-container">
          <div class="chart-content">
            <div class="chart-bars">
              <div v-for="(value, index) in repoActivityByMonth" :key="index" class="chart-bar"
                   :style="{
                     height: `${value > 0 ? Math.max((value / activityChartMax) * 100, 10) : 0}%`,
                     opacity: value > 0 ? 1 : 0.2
                   }"
                   :title="`${months[index]}: ${value} activities`">
                <div class="bar-value">{{ value }}</div>
              </div>
            </div>
            <div class="chart-x-axis">
              <div v-for="(month, index) in months" :key="index" class="x-label">
                {{ month }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <GithubContributionGrid :username="username"></GithubContributionGrid>

      <div v-if="projects.length" class="projects-section">
        <h3>Recent Projects</h3>
        <div class="projects-grid">
          <div v-for="project in projectsToShow" :key="project.title" class="project-card">
            <h4>{{ project.title }}</h4>
            <p class="project-description">{{ project.description || 'No description provided' }}</p>
            <div class="project-meta">
              <span v-if="project.stack && project.stack.length" class="project-lang">
                {{ project.stack[0] }}
              </span>
              <span class="project-date">
                Updated {{ formatDate(project.updatedAt) }}
              </span>
            </div>
            <a :href="project.link" target="_blank" class="project-link">View on GitHub</a>
          </div>
        </div>
        <div v-if="projects.length > projectsToShow.length" class="show-more">
          <button @click="showMoreProjects" class="show-more-button">Show More Projects</button>
        </div>
      </div>

      <div v-else-if="!loading" class="no-projects">
        <p>No repositories found for this user.</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../composables/useFirestore';

const route = useRoute();

import GithubContributionGrid from "../components/GithubContributionGrid.vue";


const username = ref(route.params.username || '');



const token = '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';


const stats = ref({
  publicRepos: 0,
  followers: 0,
  topLanguages: [],
  avatarUrl: '',
  bio: '',
  location: '',
  name: '',
  skills: []
});

const projects = ref([]);
const projectsDisplayCount = ref(3);
const loading = ref(true);
const chartLoading = ref(true);
const error = ref(null);
const repoActivityByMonth = ref(Array(12).fill(0));
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



const projectsToShow = computed(() => {
  return projects.value.slice(0, projectsDisplayCount.value);
});


function showMoreProjects() {
  projectsDisplayCount.value += 3;
}


function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// Compute max value for activity chart
const activityChartMax = computed(() => {
  const max = Math.max(...repoActivityByMonth.value);
  return max > 0 ? max : 1; // Avoid division by zero
});

// Process repository data to extract creation dates and activity by month
function processRepositoryData(repos) {
  const activityByMonth = Array(12).fill(0);

  repos.forEach(repo => {
    const createdAt = new Date(repo.createdAt);
    const updatedAt = new Date(repo.updatedAt);

    // Count repo creation by month
    activityByMonth[createdAt.getMonth()]++;

    // If updated is different from created, count that too
    if (updatedAt.getMonth() !== createdAt.getMonth() ||
        updatedAt.getFullYear() !== createdAt.getFullYear()) {
      activityByMonth[updatedAt.getMonth()]++;
    }
  });

  repoActivityByMonth.value = activityByMonth;
  chartLoading.value = false;
}

async function fetchUserSkills(username) {
  try {
    // Query the Users collection to find the user with matching GitHub username
    const usersRef = collection(db, 'Users');
    const q = query(usersRef, where('Github_username', '==', username));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      console.log('Found user skills:', userData.skills); // Debug log
      return userData.skills || [];
    }
    console.log('No user found with GitHub username:', username); // Debug log
    return [];
  } catch (error) {
    console.error('Error fetching user skills:', error);
    return [];
  }
}

async function fetchGithubStats(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User '${username}' not found on GitHub`);
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const userData = await response.json();
    const skills = await fetchUserSkills(username);

    // Extract top languages from repositories in a separate request
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!reposResponse.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const reposData = await reposResponse.json();

    // Calculate language usage
    const languageCount = {};
    reposData.forEach(repo => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => lang);

    return {
      publicRepos: userData.public_repos,
      followers: userData.followers,
      topLanguages,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      location: userData.location,
      blog: userData.blog,
      company: userData.company,
      name: userData.name,
      login: userData.login,
      skills
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
}

async function fetchGithubProjects(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User '${username}' not found on GitHub`);
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    return data.map(repo => ({
      title: repo.name,
      description: repo.description || '',
      link: repo.html_url,
      imageUrl: repo.owner?.avatar_url || '',
      stack: repo.language ? [repo.language] : [],
      source: 'github',
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    throw error;
  }
}

// Retry loading data if there was an error
function retry() {
  loading.value = true;
  error.value = null;
  loadData();
}

// Load all GitHub data
async function loadData() {
  try {
    if (!username.value) {
      error.value = "No GitHub username provided";
      loading.value = false;
      return;
    }

    // Fetch GitHub stats and projects in parallel
    const [statsData, projectsData] = await Promise.all([
      fetchGithubStats(username.value),
      fetchGithubProjects(username.value)
    ]);

    stats.value = statsData;
    projects.value = projectsData.sort((a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    // Process repository data for visualization
    processRepositoryData(projectsData);

  } catch (err) {
    console.error('Error fetching GitHub data:', err);
    error.value = err.message || 'Failed to load GitHub data';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.github-stats-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: transparent;
  border: none;
  backdrop-filter: none;
  box-shadow: none;
  color: #f0f6fc;
  border-radius: 18px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.github-stats-container h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #a996f7;
  border-bottom: 1px solid rgba(126, 91, 239, 0.15);
  padding-bottom: 10px;
}

.github-stats-container h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #a996f7;
}

.profile-stats-row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
  width: 100%;
}

.user-profile {
  flex: 1 1 0;
  min-width: 0;
  max-width: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
  flex-shrink: 0;
  border: 2px solid #a996f7;
  background: rgba(126, 91, 239, 0.08);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #7e5bef;
  color: white;
  font-size: 32px;
  font-weight: bold;
}

.user-info h3 {
  margin-bottom: 8px;
  color: #a996f7;
}

.user-meta {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #b8a4e3;
  margin-top: 8px;
}

.user-meta span {
  margin-right: 16px;
  display: flex;
  align-items: center;
}

.user-meta span i {
  margin-right: 6px;
}

.stat-card {
  flex: 1 1 0;
  min-width: 0;
  max-width: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-card h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #a996f7;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #7e5bef;
  margin: 0;
}

.language-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.language-badge {
  padding: 4px 12px;
  font-size: 0.875rem;
  background-color: #a996f7;
  color: #fff;
  border-radius: 9999px;
}

.language-badge.empty {
  background-color: #30363d;
  color: #8b949e;
}

.activity-chart {
  margin-bottom: 30px;
  background: linear-gradient(135deg, rgba(30, 27, 38, 0.85) 60%, rgba(126, 91, 239, 0.10) 100%);
  border-radius: 14px;
  padding: 20px;
  border: 1.5px solid rgba(126, 91, 239, 0.10);
  box-shadow: 0 4px 16px 0 rgba(126, 91, 239, 0.08);
}

.chart-container {
  height: 220px;
  margin-top: 20px;
}

.chart-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #30363d;
}

.chart-bar {
  width: 7.5%;
  max-width: 36px;
  min-width: 16px;
  background-color: #7e5bef;
  border-radius: 3px 3px 0 0;
  position: relative;
  transition: height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
}

.bar-value {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #8b949e;
  opacity: 0;
  transition: opacity 0.2s;
  background-color: #0d1117;
  padding: 2px 4px;
  border-radius: 3px;
}

.chart-bar:hover .bar-value {
  opacity: 1;
}

.chart-x-axis {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  font-size: 12px;
  color: #8b949e;
}

.x-label {
  text-align: center;
  width: 7.5%;
  max-width: 36px;
  min-width: 16px;
}

.projects-section {
  background: linear-gradient(135deg, rgba(30, 27, 38, 0.85) 60%, rgba(126, 91, 239, 0.10) 100%);
  border-radius: 14px;
  padding: 20px;
  margin-top: 24px;
  border: 1.5px solid rgba(126, 91, 239, 0.10);
  box-shadow: 0 4px 16px 0 rgba(126, 91, 239, 0.08);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.project-card {
  background: rgba(126, 91, 239, 0.08);
  padding: 16px;
  border-radius: 10px;
  border: 1px solid rgba(126, 91, 239, 0.10);
  transition: transform 0.2s, border-color 0.2s;
}

.project-card:hover {
  transform: translateY(-2px);
  border-color: #a996f7;
}

.project-card h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #a996f7;
}

.project-description {
  color: #b8a4e3;
  font-size: 0.875rem;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.5em;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #b8a4e3;
  margin-bottom: 12px;
}

.project-lang {
  display: inline-block;
  padding: 2px 6px;
  background-color: #a996f7;
  color: #fff;
  border-radius: 10px;
}

.project-link {
  color: #a996f7;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  margin-top: 8px;
  transition: color 0.2s;
}

.project-link:hover {
  color: #7e5bef;
  text-decoration: underline;
}

.loading-container,
.error-message {
  background: linear-gradient(135deg, rgba(30, 27, 38, 0.85) 60%, rgba(126, 91, 239, 0.12) 100%);
  border: 1.5px solid rgba(126, 91, 239, 0.15);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(126, 91, 239, 0.15);
  border-radius: 18px;
  padding: 20px;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #a996f7;
  border-top: 4px solid #7e5bef;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  background-color: #7e5bef;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #a996f7;
}

.show-more {
  text-align: center;
  margin-top: 24px;
}

.show-more-button {
  background-color: #a996f7;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.show-more-button:hover {
  background-color: #7e5bef;
}

.no-projects {
  text-align: center;
  padding: 24px;
  color: #b8a4e3;
}

/* Animation for elements */
@keyframes grow-bar {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.chart-bar {
  animation: grow-bar 0.8s ease-out forwards;
}

/* Contribution Grid Styles */
/* SUPPRIMER cette règle pour laisser le style du composant s'appliquer */
/*
.contribution-section {
  margin-bottom: 30px;
  padding: 20px;
  background: transparent;
  border: none;
  backdrop-filter: none;
  box-shadow: none;
  color: #f0f6fc;
  border-radius: 16px;
}
*/

.contribution-legend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: #b8a4e3;
}

.legend-box {
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background: #a996f7;
}

.contribution-heatmap {
  display: flex;
  overflow-x: auto;
  padding-bottom: 10px;
}

.heatmap-grid {
  display: grid;
  grid-template-rows: auto repeat(7, 12px);
  grid-auto-flow: column;
  gap: 3px;
}

.day-box {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  transition: transform 0.2s;
  background: #7e5bef;
}

.day-box:hover {
  transform: scale(1.2);
  background: #a996f7;
}

.day-label {
  font-size: 10px;
  color: #b8a4e3;
  padding-right: 5px;
  height: 20px;
  display: flex;
  align-items: center;
}

@media (max-width: 900px) {
  .profile-stats-row {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  .user-profile, .stat-card {
    width: 100%;
    max-width: 100%;
  }
}

.skills-section {
  background: rgba(24, 25, 38, 0.9);
  border: 1.5px solid rgba(168, 85, 247, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 2rem 0;
  backdrop-filter: blur(20px);
}

.skills-section h3 {
  color: #fff;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-badge {
  background: rgba(168, 85, 247, 0.2);
  color: #e9d5ff;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.skill-badge:hover {
  background: rgba(168, 85, 247, 0.3);
  transform: translateY(-2px);
}
</style>
