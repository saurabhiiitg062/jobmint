import { connectToDatabase } from "@/lib/server/db";
import { Blog } from "@/lib/server/models/Blog";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/blogs/slug/[slug]">
) {
  try {
    await connectToDatabase();

    const { slug } = await context.params;
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return Response.json({ message: "Blog not found" }, { status: 404 });
    }

    return Response.json(blog);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
