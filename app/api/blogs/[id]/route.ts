import { NextRequest } from "next/server";

import { verifyAdminRequest } from "@/lib/server/auth";
import { generateSlug, revalidateContentPaths } from "@/lib/server/content";
import { connectToDatabase } from "@/lib/server/db";
import { Blog } from "@/lib/server/models/Blog";

export async function PUT(
  request: NextRequest,
  context: RouteContext<"/api/blogs/[id]">
) {
  const auth = verifyAdminRequest(request);
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectToDatabase();
    const { id } = await context.params;
    const blogData = await request.json();

    // We strictly DO NOT update the slug during PUT requests to prevent breaking SEO URLs.
    // The slug should remain permanent once the job is published.
    const blog = await Blog.findByIdAndUpdate(id, blogData, { new: true });
    if (!blog) {
      return Response.json({ message: "Blog not found" }, { status: 404 });
    }

    revalidateContentPaths("blog", blog.slug);

    return Response.json(blog);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext<"/api/blogs/[id]">
) {
  const auth = verifyAdminRequest(request);
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectToDatabase();
    const { id } = await context.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return Response.json({ message: "Blog not found" }, { status: 404 });
    }

    revalidateContentPaths("blog", blog.slug);

    return Response.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to delete blog" },
      { status: 500 }
    );
  }
}
