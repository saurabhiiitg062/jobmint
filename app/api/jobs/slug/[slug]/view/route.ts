import { connectToDatabase } from "@/lib/server/db";
import { Job } from "@/lib/server/models/Job";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/jobs/slug/[slug]/view">
) {
  try {
    await connectToDatabase();
    const { slug } = await context.params;
    
    await Job.updateOne({ slug }, { $inc: { views: 1 } });
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false }, { status: 500 });
  }
}
