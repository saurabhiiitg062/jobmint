import { NextRequest } from "next/server";

import { verifyAdminRequest } from "@/lib/server/auth";
import {
  filterValidTables,
  generateSlug,
  revalidateContentPaths,
  validateTables,
} from "@/lib/server/content";
import { connectToDatabase } from "@/lib/server/db";
import { Job } from "@/lib/server/models/Job";

export async function PUT(
  request: NextRequest,
  context: RouteContext<"/api/jobs/[id]">
) {
  const auth = verifyAdminRequest(request);
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectToDatabase();
    const { id } = await context.params;
    const jobData = await request.json();

    if (jobData.tables && !validateTables(jobData.tables)) {
      return Response.json(
        {
          message:
            "Invalid tables structure. Each table must have a title, at least one column, and at least one row with matching column count.",
        },
        { status: 400 }
      );
    }

    if (jobData.cutoff && !validateTables(jobData.cutoff)) {
      return Response.json(
        {
          message:
            "Invalid cutoff tables structure. Each table must have a title, at least one column, and at least one row with matching column count.",
        },
        { status: 400 }
      );
    }

    if (jobData.syllabus && !validateTables(jobData.syllabus)) {
      return Response.json(
        {
          message:
            "Invalid syllabus tables structure. Each table must have a title, at least one column, and at least one row with matching column count.",
        },
        { status: 400 }
      );
    }

    if (jobData.tables) jobData.tables = filterValidTables(jobData.tables);
    if (jobData.cutoff) jobData.cutoff = filterValidTables(jobData.cutoff);
    if (jobData.syllabus) jobData.syllabus = filterValidTables(jobData.syllabus);

    // We strictly DO NOT update the slug during PUT requests to prevent breaking SEO URLs.
    // The slug should remain permanent once the job is published.
    
    if (jobData.updatePublishDate) {
      jobData.publishedAt = new Date();
    }
    delete jobData.updatePublishDate;

    const job = await Job.findByIdAndUpdate(id, jobData, { new: true });
    if (!job) {
      return Response.json({ message: "Job not found" }, { status: 404 });
    }

    revalidateContentPaths("job", job.slug);

    return Response.json(job);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext<"/api/jobs/[id]">
) {
  const auth = verifyAdminRequest(request);
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectToDatabase();
    const { id } = await context.params;
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return Response.json({ message: "Job not found" }, { status: 404 });
    }

    revalidateContentPaths("job", job.slug);

    return Response.json({ message: "Job deleted successfully" });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to delete job" },
      { status: 500 }
    );
  }
}
