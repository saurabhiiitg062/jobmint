import { NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/server/auth";
import { generateSlug, revalidateContentPaths } from "@/lib/server/content";
import { connectToDatabase } from "@/lib/server/db";
import { Job } from "@/lib/server/models/Job";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = verifyAdminRequest(request);
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectToDatabase();
    const { id } = await context.params;

    const originalJob = await Job.findById(id).lean();
    if (!originalJob) {
      return Response.json({ message: "Job not found" }, { status: 404 });
    }

    // Prepare cloned data
    const cloneData: any = { ...originalJob };
    delete cloneData._id;
    delete cloneData.__v;
    delete cloneData.createdAt;
    delete cloneData.updatedAt;

    // Modify title to indicate it's a clone
    cloneData.title = `${cloneData.title} (Copy)`;
    
    // Set status to draft so it doesn't publish immediately
    cloneData.status = 'draft';

    // Generate a fresh slug based on the new title
    cloneData.slug = generateSlug(cloneData.title);

    // Save the cloned job
    const clonedJob = new Job(cloneData);
    await clonedJob.save();

    revalidateContentPaths("job", clonedJob.slug);

    return Response.json(clonedJob, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to clone job" },
      { status: 500 }
    );
  }
}
