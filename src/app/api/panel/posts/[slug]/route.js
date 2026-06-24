import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getBlogPost, saveBlogPost, deleteBlogPost, renameBlogPost } from "@/lib/storage";
import { slugify } from "@/lib/slugify";
import { sanitizeHtml, sanitizeTranslations } from "@/lib/sanitize";

export async function GET(_req, { params }) {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return NextResponse.json({}, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request, { params }) {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  const { slug } = await params;
  const existing = await getBlogPost(slug);
  if (!existing) return NextResponse.json({}, { status: 404 });
  const body = await request.json();

  if (body.newSlug && body.newSlug !== slug) {
    const newSlug = slugify(body.newSlug);
    if (!newSlug) return NextResponse.json({ error: "newSlug invalid" }, { status: 400 });
    const renamed = await renameBlogPost(slug, newSlug);
    if (!renamed) return NextResponse.json({ error: "Rename failed" }, { status: 500 });
    const updated = {
      ...renamed,
      title: body.title ?? renamed.title,
      content: body.content !== undefined ? sanitizeHtml(body.content) : renamed.content,
      metaTitle: body.metaTitle ?? renamed.metaTitle,
      metaDescription: body.metaDescription ?? renamed.metaDescription,
      published: body.published ?? renamed.published,
      translations: body.translations !== undefined ? sanitizeTranslations(body.translations) : renamed.translations,
      updatedAt: new Date().toISOString(),
    };
    await saveBlogPost(updated);
    return NextResponse.json(updated);
  }

  const updated = {
    ...existing,
    title: body.title ?? existing.title,
    content: body.content !== undefined ? sanitizeHtml(body.content) : existing.content,
    metaTitle: body.metaTitle ?? existing.metaTitle,
    metaDescription: body.metaDescription ?? existing.metaDescription,
    published: body.published ?? existing.published,
    translations: body.translations !== undefined ? sanitizeTranslations(body.translations) : existing.translations,
    updatedAt: new Date().toISOString(),
  };
  await saveBlogPost(updated);
  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  const { slug } = await params;
  await deleteBlogPost(slug);
  return NextResponse.json({ ok: true });
}
