// useGithub.js - Improved version
import { ref } from 'vue';

// Get GitHub token from environment variables
const token = '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';

// Simple cache to prevent redundant API calls
const projectCache = {
  data: {},
  timestamp: {},
  maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds

  get(username) {
    const now = Date.now();
    if (this.data[username] && now - this.timestamp[username] < this.maxAge) {
      console.log('Using cached GitHub data for', username);
      return this.data[username];
    }
    return null;
  },

  set(username, data) {
    this.data[username] = data;
    this.timestamp[username] = Date.now();
  }
};

/**
 * Fetches GitHub contribution data for visualization
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} - Formatted contribution data
 */
export async function fetchContributionData(username) {
  // Note: GitHub's public API doesn't directly provide contribution data like the heatmap
  // This is a simplified version that uses commit activity as an approximation
  try {
    // Get user's repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: {
          'Authorization': `token ${token}`
        }
      }
    );

    if (!reposRes.ok) throw new Error('Failed to fetch repositories');
    const repos = await reposRes.json();

    // Get the last year dates (for the activity grid)
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    // Initialize contribution data structure (last 12 months activity)
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      months.unshift(date.toLocaleString('default', { month: 'short' }));
    }

    const contributionData = {
      total: 0,
      months: months,
      contributions: Array(12).fill(0),
      // For the activity grid (simplified version)
      activityGrid: {
        weekdays: ['Mon', 'Wed', 'Fri'],
        months: months,
        data: []
      }
    };

    // Initialize the grid with default values (will be random in this demo)
    for (let row = 0; row < 3; row++) {
      contributionData.activityGrid.data[row] = [];
      for (let col = 0; col < 12; col++) {
        // Values between 0-4 representing activity levels
        // In a real implementation, these would come from actual GitHub data
        contributionData.activityGrid.data[row][col] = Math.floor(Math.random() * 5);
      }
    }

    // Process recent commits for activity data
    // This is simplified - in a real implementation, you'd need to fetch commit data
    // for each repository and aggregate it
    for (const repo of repos.slice(0, 5)) { // Limit to 5 repos to avoid rate limiting
      try {
        const commitsRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=100&since=${lastYear.toISOString()}`);
        if (!commitsRes.ok) continue;
        const commits = await commitsRes.json();

        commits.forEach(commit => {
          const date = new Date(commit.commit.author.date);
          const monthIndex = months.indexOf(date.toLocaleString('default', { month: 'short' }));
          if (monthIndex >= 0) {
            contributionData.contributions[monthIndex]++;
            contributionData.total++;
          }
        });
      } catch (error) {
        console.warn(`Failed to fetch commits for ${repo.name}:`, error);
      }
    }

    return contributionData;
  } catch (error) {
    console.error('Error fetching contribution data:', error);
    throw error;
  }
}

/**
 * Fetches GitHub projects for a user and formats them for display
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} - Formatted project data
 */
export async function fetchGithubProjects(username) {
  // Return loading state ref that can be used in components
  const isLoading = ref(false);
  const error = ref(null);

  // Check cache first
  const cachedData = projectCache.get(username);
  if (cachedData) {
    return cachedData;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        'Authorization': `token ${token}`
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

    // Get topics/tags for each repository (requires separate API call)
    const projectsWithTopics = await Promise.all(
      data.map(async (repo) => {
        let topics = [];
        try {
          // Get repository topics
          const topicsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/topics`, {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.mercy-preview+json' // Required for topics API
            }
          });

          if (topicsResponse.ok) {
            const topicsData = await topicsResponse.json();
            topics = topicsData.names || [];
          }
        } catch (e) {
          console.warn(`Could not fetch topics for ${repo.name}:`, e);
        }

        // Convert created_at and updated_at strings to Date objects
        const createdAt = new Date(repo.created_at);
        const updatedAt = new Date(repo.updated_at);

        return {
          id: repo.id,
          title: repo.name,
          description: repo.description || '',
          link: repo.html_url,
          imageUrl: repo.owner?.avatar_url || '',
          stack: [repo.language, ...topics].filter(Boolean), // Combine language with topics as stack
          source: 'github',
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          createdAt,
          updatedAt,
          isPrivate: repo.private
        };
      })
    );

    // Sort by last updated date (most recent first)
    const formattedProjects = projectsWithTopics.sort((a, b) => b.updatedAt - a.updatedAt);

    // Store in cache
    projectCache.set(username, formattedProjects);

    return formattedProjects;
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    error.value = error.message;
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Clears the GitHub projects cache for a specific user or all users
 * @param {string} [username] - Optional username to clear specific cache
 */
export function clearGithubCache(username = null) {
  if (username) {
    if (projectCache.data[username]) {
      delete projectCache.data[username];
      delete projectCache.timestamp[username];
      console.log(`Cleared GitHub cache for ${username}`);
    }
  } else {
    // Clear all cache
    projectCache.data = {};
    projectCache.timestamp = {};
    console.log('Cleared all GitHub cache');
  }
}