import { NextRequest } from "next/server";

import { verifyAdminRequest } from "@/lib/server/auth";
import { generateSlug, revalidateContentPaths } from "@/lib/server/content";
import { connectToDatabase } from "@/lib/server/db";
import { Job } from "@/lib/server/models/Job";

export async function POST(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectToDatabase();
    const { jobs } = await request.json();

    if (!Array.isArray(jobs)) {
      return Response.json(
        { message: "Jobs payload must be an array" },
        { status: 400 }
      );
    }

    const preparedJobs = jobs.map((job) => ({
      ...job,
      slug: job.slug || `${generateSlug(job.title)}-${Math.floor(Math.random() * 1000)}`,
    }));

    const result = await Job.insertMany(preparedJobs);
    revalidateContentPaths("job");

    return Response.json(
      { message: `Successfully imported ${result.length} jobs` },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to import jobs" },
      { status: 500 }
    );
  }
}
