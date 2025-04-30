<template>
  <div class="github-stats-container">
    <h2>GitHub Statistics</h2>

    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>Loading GitHub statistics...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else>
      <div class="contribution-summary">
        <h3>{{ contributionData.total }} contributions in the last year</h3>
      </div>

      <!-- Contribution Activity Grid -->
      <div class="contribution-grid">
        <div class="grid-header">
          <div class="weekday-labels">
            <!-- Empty space for alignment -->
            <div class="month-label-spacer"></div>
            <div v-for="day in contributionData.activityGrid.weekdays" :key="day">{{ day }}</div>
          </div>
          <div class="month-labels">
            <div v-for="month in contributionData.activityGrid.months" :key="month">{{ month }}</div>
          </div>
        </div>

        <div class="grid-body">
          <div class="weekdays">
            <div v-for="day in contributionData.activityGrid.weekdays" :key="day">{{ day }}</div>
          </div>
          <div class="grid-cells">
            <div v-for="(row, rowIndex) in contributionData.activityGrid.data" :key="rowIndex" class="grid-row">
              <div
                v-for="(value, colIndex) in row"
                :key="`${rowIndex}-${colIndex}`"
                class="grid-cell"
                :class="`activity-level-${value}`">
              </div>
            </div>
          </div>
        </div>

        <div class="contribution-legend">
          <span>Less</span>
          <div class="legend-cells">
            <div class="grid-cell activity-level-0"></div>
            <div class="grid-cell activity-level-1"></div>
            <div class="grid-cell activity-level-2"></div>
            <div class="grid-cell activity-level-3"></div>
            <div class="grid-cell activity-level-4"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <!-- Activity Chart -->
      <div class="activity-chart">
        <h3>Contribution Activity</h3>
        <div class="chart-container">
          <div class="chart-y-axis">
            <div v-for="tick in activityChartYAxis" :key="tick">{{ tick }}</div>
          </div>
          <div class="chart-content">
            <div class="chart-bars">
              <div
                v-for="(value, index) in contributionData.contributions"
                :key="index"
                class="chart-bar"
                :style="{ height: `${Math.max(value / activityChartMax * 100, 5)}%` }">
                <div class="bar-value">{{ value }}</div>
              </div>
            </div>
            <div class="chart-x-axis">
              <div
                v-for="(month, index) in contributionData.months"
                :key="index"
                class="x-label">
                {{ month }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-grid">
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
          </div>
        </div>
      </div>

      <div v-if="projects.length > 0" class="projects-section">
        <h3>Recent Projects</h3>
        <div class="projects-grid">
          <div v-for="project in projects.slice(0, 3)" :key="project.title" class="project-card">
            <h4>{{ project.title }}</h4>
            <p class="project-description">{{ project.description || 'No description provided' }}</p>
            <a :href="project.link" target="_blank" class="project-link">View on GitHub</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchGithubStats, fetchGithubProjects } from '../composables/useGithub.js';
import { fetchContributionData } from '../composables/useGithub.js'; // Make sure to add this function

const route = useRoute();

// Get the username from route params
const username = ref(route.params.username);

const stats = ref({
  publicRepos: 0,
  followers: 0,
  topLanguages: [],
  contributions: 'N/A',
  activeHours: 'N/A'
});

const projects = ref([]);
const contributionData = ref({
  total: 0,
  months: [],
  contributions: [],
  activityGrid: {
    weekdays: ['Mon', 'Wed', 'Fri'],
    months: [],
    data: []
  }
});
const loading = ref(true);
const error = ref(null);

// Computed values for the activity chart
const activityChartMax = computed(() => {
  const max = Math.max(...contributionData.value.contributions);
  return max > 0 ? max : 10; // Default max value if all are 0
});

const activityChartYAxis = computed(() => {
  const max = activityChartMax.value;
  const step = Math.ceil(max / 4);
  return [max, Math.round(max * 3/4), Math.round(max / 2), Math.round(max / 4), 0];
});

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    // Fetch all data in parallel
    const [statsData, projectsData, contributionsData] = await Promise.all([
      fetchGithubStats(username.value),
      fetchGithubProjects(username.value),
      fetchContributionData(username.value)
    ]);

    stats.value = statsData;
    projects.value = projectsData;
    contributionData.value = contributionsData;
  } catch (err) {
    console.error('Error fetching GitHub data:', err);
    error.value = `Failed to load GitHub data: ${err.message}`;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.github-stats-container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #0d1117;
  color: #c9d1d9;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.github-stats-container h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #f0f6fc;
}

.github-stats-container h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #f0f6fc;
}

.contribution-summary {
  margin-bottom: 20px;
}

.contribution-grid {
  width: 100%;
  margin-bottom: 30px;
  background-color: #0d1117;
  border-radius: 6px;
  overflow: hidden;
}

.grid-header {
  display: flex;
  flex-direction: column;
  margin-left: 30px;
}

.month-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}

.month-label-spacer {
  width: 30px;
}

.weekday-labels {
  display: none;
}

.grid-body {
  display: flex;
}

.weekdays {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 12px;
  color: #8b949e;
}

.grid-cells {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.grid-row {
  display: flex;
  margin: 2px 0;
}

.grid-cell {
  width: 15px;
  height: 15px;
  margin: 2px;
  border-radius: 2px;
}

.activity-level-0 {
  background-color: #161b22;
}

.activity-level-1 {
  background-color: #0e4429;
}

.activity-level-2 {
  background-color: #006d32;
}

.activity-level-3 {
  background-color: #26a641;
}

.activity-level-4 {
  background-color: #39d353;
}

.contribution-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
  font-size: 12px;
  color: #8b949e;
}

.legend-cells {
  display: flex;
  margin: 0 8px;
}

.activity-chart {
  margin-bottom: 30px;
}

.chart-container {
  display: flex;
  height: 200px;
  margin-top: 20px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 40px;
  padding-right: 10px;
  text-align: right;
  font-size: 12px;
  color: #8b949e;
}

.chart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid #30363d;
}

.chart-bar {
  width: 24px;
  background-color: #2ea043;
  border-radius: 3px 3px 0 0;
  position: relative;
  transition: height 0.3s ease;
}

.bar-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #8b949e;
  opacity: 0;
  transition: opacity 0.2s;
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
  width: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 30px;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stat-card {
  background-color: #161b22;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-card h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #c9d1d9;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #58a6ff;
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
  background-color: #1f6feb;
  color: #ffffff;
  border-radius: 9999px;
}

.projects-section {
  margin-top: 32px;
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.project-card {
  background-color: #161b22;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.project-card h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #c9d1d9;
}

.project-description {
  color: #8b949e;
  font-size: 0.875rem;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-link {
  color: #58a6ff;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.project-link:hover {
  text-decoration: underline;
}

.loading-container {
  text-align: center;
  padding: 32px 0;
}

.loader {
  width: 32px;
  height: 32px;
  border: 4px solid #30363d;
  border-top: 4px solid #58a6ff;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 16px;
  background-color: #5a1d1d;
  color: #fa7970;
  border-radius: 8px;
}
</style>