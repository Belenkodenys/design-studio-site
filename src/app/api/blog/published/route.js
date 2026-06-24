import { NextResponse } from "next/server";
import { listBlogPosts } from "@/lib/storage";
import { adaptAdminPost } from "@/lib/blog-adapter";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await listBlogPosts();
    const adapted = posts.filter((p) => p.published).map(adaptAdminPost);
    return NextResponse.json(adapted);
  } catch (e) {
    console.error("Failed to load published admin posts:", e);
    return NextResponse.json([]);
  }
}
