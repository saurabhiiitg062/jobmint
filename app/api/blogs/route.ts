import { NextRequest } from "next/server";

import { verifyAdminRequest } from "@/lib/server/auth";
import { generateSlug, revalidateContentPaths } from "@/lib/server/content";
import { connectToDatabase } from "@/lib/server/db";
import { Blog } from "@/lib/server/models/Blog";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const limit = searchParams.get("limit") ?? "10";
    const page = searchParams.get("page") ?? "1";

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const lim = Number.parseInt(limit, 10);
    const pg = Number.parseInt(page, 10);

    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1 })
      .skip((pg - 1) * lim)
      .limit(lim);

    const total = await Blog.countDocuments(filter);

    return Response.json({
      blogs,
      pagination: {
        total,
        page: pg,
        limit: lim,
        pages: Math.ceil(total / lim),
      },
    });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectToDatabase();
    const blogData = await request.json();

    if (!blogData.slug) {
      blogData.slug = generateSlug(blogData.title);
    }

    const existing = await Blog.findOne({ slug: blogData.slug });
    if (existing) {
      blogData.slug = `${blogData.slug}-${Date.now()}`;
    }

    const blog = new Blog(blogData);
    await blog.save();

    revalidateContentPaths("blog", blog.slug);

    return Response.json(blog, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to create blog" },
      { status: 500 }
    );
  }
}
