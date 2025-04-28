
export async function fetchDevtoProjects(username) {
  const res = await fetch(`https://dev.to/api/articles?username=${username}`);
  const data = await res.json();
  return data.map(article => ({
    title: article.title,
    description: article.description,
    link: article.url,
    imageUrl: article.cover_image || '',
    stack: [],
    source: 'devto',
    createdAt: new Date(article.published_at),
    updatedAt: new Date(article.edited_at || article.published_at),
  }));
}