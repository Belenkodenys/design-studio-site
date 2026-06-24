import Redis from "ioredis";

let redis = null;

function getRedis() {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url, { maxRetriesPerRequest: 3, lazyConnect: true });
  return redis;
}

async function get(key) {
  const r = getRedis();
  if (!r) return null;
  const data = await r.get(key);
  if (!data) return null;
  return JSON.parse(data);
}

async function set(key, value) {
  const r = getRedis();
  if (!r) throw new Error("Redis not configured");
  await r.set(key, JSON.stringify(value));
}

async function del(key) {
  const r = getRedis();
  if (!r) return;
  await r.del(key);
}

// === Code Injection ===
export async function getCodeInjection() {
  return (await get("settings:code-injection")) || { headCode: "", bodyStartCode: "", bodyEndCode: "" };
}

export async function saveCodeInjection(data) {
  await set("settings:code-injection", data);
}

// === Meta Overrides ===
export async function getMetaOverrides() {
  return (await get("settings:meta-overrides")) || {};
}

export async function saveMetaOverrides(data) {
  await set("settings:meta-overrides", data);
}

// === Robots ===
const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://www.belenko.design/sitemap.xml`;

export async function getRobotsContent() {
  return (await get("settings:robots")) || DEFAULT_ROBOTS;
}

export async function saveRobotsContent(content) {
  await set("settings:robots", content);
}

// === Blog Posts ===
export async function listBlogPosts() {
  const r = getRedis();
  if (!r) return [];
  const slugs = await r.smembers("blog:index");
  if (!slugs || slugs.length === 0) return [];
  const posts = [];
  for (const slug of slugs) {
    const raw = await r.get(`blog:post:${slug}`);
    if (raw) posts.push(JSON.parse(raw));
  }
  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getBlogPost(slug) {
  return get(`blog:post:${slug}`);
}

export async function saveBlogPost(post) {
  const r = getRedis();
  if (!r) throw new Error("Redis not configured");
  await r.set(`blog:post:${post.slug}`, JSON.stringify(post));
  await r.sadd("blog:index", post.slug);
}

export async function deleteBlogPost(slug) {
  const r = getRedis();
  if (!r) return;
  await r.del(`blog:post:${slug}`);
  await r.srem("blog:index", slug);
}

export async function renameBlogPost(oldSlug, newSlug) {
  const post = await getBlogPost(oldSlug);
  if (!post) return null;
  const renamed = { ...post, slug: newSlug, updatedAt: new Date().toISOString() };
  await saveBlogPost(renamed);
  await deleteBlogPost(oldSlug);
  return renamed;
}
