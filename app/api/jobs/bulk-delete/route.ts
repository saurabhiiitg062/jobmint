import { NextRequest } from "next/server";

import { verifyAdminRequest } from "@/lib/server/auth";
import { revalidateContentPaths } from "@/lib/server/content";
import { connectToDatabase } from "@/lib/server/db";
import { Job } from "@/lib/server/models/Job";

export async function POST(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (auth.error) {
    return auth.error;
  }

  try {
    await connectToDatabase();
    const { ids } = await request.json();

    if (!Array.isArray(ids)) {
      return Response.json({ message: "IDs must be an array" }, { status: 400 });
    }

    const result = await Job.deleteMany({ _id: { $in: ids } });
    revalidateContentPaths("job");

    return Response.json({
      message: `Successfully deleted ${result.deletedCount} jobs`,
    });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to bulk delete jobs" },
      { status: 500 }
    );
  }
}
