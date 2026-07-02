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
import { State } from "@/lib/server/models/State";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const state = searchParams.get("state");
    const qualification = searchParams.get("qualification");
    const organization = searchParams.get("organization");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") ?? "20";
    const page = searchParams.get("page") ?? "1";

    const filter: Record<string, unknown> = {};

    if (category) filter.category = category;
    if (state) filter.state = new RegExp(`^${state}$`, "i");
    if (qualification) filter.qualification = new RegExp(`^${qualification}$`, "i");
    if (organization) filter.organization = new RegExp(`^${organization}$`, "i");
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { postName: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
      ];
    }

    const lim = Number.parseInt(limit, 10);
    const pg = Number.parseInt(page, 10);

    const jobs = await Job.find(filter)
      .sort({ publishedAt: -1 })
      .skip((pg - 1) * lim)
      .limit(lim);

    const total = await Job.countDocuments(filter);

    return Response.json({
      jobs,
      pagination: {
        total,
        page: pg,
        limit: lim,
        pages: Math.ceil(total / lim),
      },
    });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to fetch jobs" },
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

    if (!jobData.slug) {
      jobData.slug = generateSlug(jobData.title);
    }

    const existing = await Job.findOne({ slug: jobData.slug });
    if (existing) {
      jobData.slug = `${jobData.slug}-${Date.now()}`;
    }

    const job = new Job(jobData);
    await job.save();

    if (jobData.state) {
      await State.findOneAndUpdate(
        { name: jobData.state },
        { name: jobData.state, slug: generateSlug(jobData.state) },
        { upsert: true }
      );
    }

    revalidateContentPaths("job", job.slug);

    return Response.json(job, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to create job" },
      { status: 500 }
    );
  }
}
