

export async function fetchGithubProjects(username) {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  const data = await res.json();
  return data.map(repo => ({
    title: repo.name,
    description: repo.description,
    link: repo.html_url,
    imageUrl: '',
    stack: [],
    source: 'github',
    createdAt: new Date(repo.created_at),
    updatedAt: new Date(repo.updated_at),
  }));
}
