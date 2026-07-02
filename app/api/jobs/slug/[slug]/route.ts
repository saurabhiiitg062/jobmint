import { connectToDatabase } from "@/lib/server/db";
import { Job } from "@/lib/server/models/Job";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/jobs/slug/[slug]">
) {
  try {
    await connectToDatabase();

    const { slug } = await context.params;
    const job = await Job.findOne({ slug }).populate("exam");

    if (!job) {
      return Response.json({ message: "Job not found" }, { status: 404 });
    }

    return Response.json(job);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to fetch job" },
      { status: 500 }
    );
  }
}
