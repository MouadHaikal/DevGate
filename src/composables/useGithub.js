// Add this to your useGithub.js file

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export async function fetchContributionData(username) {
  // Note: GitHub's public API doesn't directly provide contribution data like the heatmap
  // This is a simplified version that uses commit activity as an approximation
  
  try {
    // Get user's repositories
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
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