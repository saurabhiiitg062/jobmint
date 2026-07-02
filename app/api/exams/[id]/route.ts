import { NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/server/auth";
import { connectToDatabase } from "@/lib/server/db";
import { Exam } from "@/lib/server/models/Exam";
import { generateSlug } from "@/lib/server/content";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json();

    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }

    const exam = await Exam.findByIdAndUpdate(id, data, { new: true });
    
    if (!exam) {
      return Response.json({ message: "Exam not found" }, { status: 404 });
    }

    return Response.json(exam);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to update exam" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyAdminRequest(request);
  if (auth.error) return auth.error;

  try {
    await connectToDatabase();
    const { id } = await params;

    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) {
      return Response.json({ message: "Exam not found" }, { status: 404 });
    }

    return Response.json({ message: "Exam deleted successfully" });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to delete exam" },
      { status: 500 }
    );
  }
}
