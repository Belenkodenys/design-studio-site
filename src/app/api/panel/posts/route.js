import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { listBlogPosts, saveBlogPost } from "@/lib/storage";
import { slugify } from "@/lib/slugify";
import { sanitizeHtml, sanitizeTranslations } from "@/lib/sanitize";

export async function GET() {
  if (!(await verifySession())) return NextResponse.json([], { status: 401 });
  return NextResponse.json(await listBlogPosts());
}

export async function POST(request) {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  const body = await request.json();
  if (!body.slug || !body.title) {
    return NextResponse.json({ error: "slug and title required" }, { status: 400 });
  }
  const slug = slugify(body.slug) || slugify(body.title);
  if (!slug) {
    return NextResponse.json({ error: "slug or title must contain readable characters" }, { status: 400 });
  }
  const post = {
    slug,
    title: body.title,
    content: sanitizeHtml(body.content || ""),
    metaTitle: body.metaTitle || body.title,
    metaDescription: body.metaDescription || "",
    published: body.published ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...(body.translations ? { translations: sanitizeTranslations(body.translations) } : {}),
  };
  await saveBlogPost(post);
  return NextResponse.json(post, { status: 201 });
}
