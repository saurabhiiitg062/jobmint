import { connectToDatabase } from "@/lib/server/db";
import { Blog } from "@/lib/server/models/Blog";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/blogs/slug/[slug]/view">
) {
  try {
    await connectToDatabase();
    const { slug } = await context.params;
    
    await Blog.updateOne({ slug }, { $inc: { views: 1 } });
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false }, { status: 500 });
  }
}
