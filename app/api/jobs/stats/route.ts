import { connectToDatabase } from "@/lib/server/db";
import { Job } from "@/lib/server/models/Job";

export async function GET() {
  try {
    await connectToDatabase();

    const [states, qualifications, organizations, categories] = await Promise.all([
      Job.distinct("state"),
      Job.distinct("qualification"),
      Job.distinct("organization"),
      Job.distinct("category"),
    ]);

    return Response.json({ states, qualifications, organizations, categories });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
