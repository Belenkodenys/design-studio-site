export const blogPosts = []

export function getBlogPost(slug) {
  return blogPosts.find(post => post.slug === slug)
}

export function getAllBlogSlugs() {
  return blogPosts.map(post => post.slug)
}
