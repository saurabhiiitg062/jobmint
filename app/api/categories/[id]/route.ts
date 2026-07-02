import { NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/server/auth";
import { connectToDatabase } from "@/lib/server/db";
import { Category } from "@/lib/server/models/Category";
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

    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    
    if (!category) {
      return Response.json({ message: "Category not found" }, { status: 404 });
    }

    return Response.json(category);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to update category" },
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

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return Response.json({ message: "Category not found" }, { status: 404 });
    }

    return Response.json({ message: "Category deleted successfully" });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to delete category" },
      { status: 500 }
    );
  }
}
