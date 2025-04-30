// import { linkGithubAccount } from '../composables/useGithub.js';

export async function fetchGithubProjects(username) {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  if (!res.ok) throw new Error('Failed to fetch GitHub projects');
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
}

export async function fetchGithubStats(username) {
  const userRes = await fetch(`https://api.github.com/users/${username}`);
  if (!userRes.ok) throw new Error('Failed to fetch user profile');
  const userData = await userRes.json();

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  if (!reposRes.ok) throw new Error('Failed to fetch user repositories');
  const reposData = await reposRes.json();

  // Calculer les langages les plus utilisés
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
    twitterUsername: userData.twitter_username,
  };
}

export async function fetchContributionData(username) {
  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`);
    if (!res.ok) throw new Error('Failed to fetch contributions');
    const svgText = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    
    // Récupérer tous les rectangles de contribution
    const rects = Array.from(doc.querySelectorAll('rect[data-date]'));
    
    // Créer la structure de données pour la grille
    const weeks = [];
    let total = 0;

    rects.forEach(rect => {
      const week = Math.floor(parseInt(rect.getAttribute('x')) / 13);
      const day = Math.floor(parseInt(rect.getAttribute('y')) / 13);
      const count = parseInt(rect.getAttribute('data-count'));
      const level = parseInt(rect.getAttribute('data-level') || '0');
      const date = rect.getAttribute('data-date');

      if (!weeks[week]) weeks[week] = Array(7).fill(null);
      weeks[week][day] = { count, level, date };
      total += count;
    });

    // Récupérer les noms des mois
    const months = Array.from(doc.querySelectorAll('.ContributionCalendar-label'))
      .map(el => el.textContent)
      .filter(Boolean);

    return {
      total,
      months,
      activityGrid: {
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        data: weeks
      }
    };
  } catch (error) {
    console.error('Error fetching contribution data:', error);
    throw error;
  }
}









