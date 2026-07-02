import { NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/server/auth";
import { connectToDatabase } from "@/lib/server/db";
import { State } from "@/lib/server/models/State";
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

    if (data.name && !data.slug) {
      data.slug = generateSlug(data.name);
    }

    const state = await State.findByIdAndUpdate(id, data, { new: true });
    
    if (!state) {
      return Response.json({ message: "State not found" }, { status: 404 });
    }

    return Response.json(state);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to update state" },
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

    const state = await State.findByIdAndDelete(id);
    if (!state) {
      return Response.json({ message: "State not found" }, { status: 404 });
    }

    return Response.json({ message: "State deleted successfully" });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to delete state" },
      { status: 500 }
    );
  }
}
