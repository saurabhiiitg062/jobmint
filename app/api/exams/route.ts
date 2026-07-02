import { NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/server/auth";
import { connectToDatabase } from "@/lib/server/db";
import { Exam } from "@/lib/server/models/Exam";
import { generateSlug } from "@/lib/server/content";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") ?? "50";
    const lim = Number.parseInt(limit, 10);
    const search = searchParams.get("search");

    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
      ];
    }

    const exams = await Exam.find(filter).sort({ createdAt: -1 }).limit(lim);
    return Response.json(exams);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to fetch exams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    await connectToDatabase();
    const data = await request.json();

    if (!data.title || !data.organization) {
      return Response.json({ message: "Title and Organization are required" }, { status: 400 });
    }

    if (!data.slug) {
      data.slug = generateSlug(data.title);
    }

    // Check for existing slug to prevent duplicates
    const existing = await Exam.findOne({ slug: data.slug });
    if (existing) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    const exam = new Exam(data);
    await exam.save();

    return Response.json(exam, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to create exam" },
      { status: 500 }
    );
  }
}
