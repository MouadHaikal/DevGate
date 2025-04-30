

export async function fetchGithubProjects(username) {
  if (!username) throw new Error('GitHub username is required');

  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch GitHub projects: ${res.status}`);
    }

    const data = await res.json();

    return data.map(repo => ({
      title: repo.name,
      description: repo.description || '',
      link: repo.html_url,
      imageUrl: repo.owner?.avatar_url || '',
      stack: repo.language ? [repo.language] : [],
      source: 'github',
      createdAt: new Date(repo.created_at),
      updatedAt: new Date(repo.updated_at),
    }));
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    throw error;
  }
}

export async function fetchGithubStats(username) {
  if (!username) throw new Error('GitHub username is required');

  try {
    // Fetch user profile data
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) {
      const errorData = await userRes.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch user profile: ${userRes.status}`);
    }
    const userData = await userRes.json();

    // Fetch repositories to analyze languages and other stats
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (!reposRes.ok) {
      const errorData = await reposRes.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch user repositories: ${reposRes.status}`);
    }
    const reposData = await reposRes.json();

    // Calculate language usage across repositories
    const languageCount = {};
    reposData.forEach(repo => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });

    // Get top 3 most used languages
    const topLanguages = Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => lang);

    return {
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      topLanguages,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      location: userData.location,
      blog: userData.blog,
      company: userData.company,
      twitterUsername: userData.twitter_username,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
      name: userData.name,
      login: userData.login,
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
}

