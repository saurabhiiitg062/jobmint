import { NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/server/auth";
import { connectToDatabase } from "@/lib/server/db";
import { Category } from "@/lib/server/models/Category";
import { generateSlug } from "@/lib/server/content";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") ?? "50";
    const lim = Number.parseInt(limit, 10);

    const categories = await Category.find().sort({ name: 1 }).limit(lim);
    return Response.json(categories);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to fetch categories" },
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

    if (!data.name) {
      return Response.json({ message: "Category name is required" }, { status: 400 });
    }

    if (!data.slug) {
      data.slug = generateSlug(data.name);
    }

    const category = new Category(data);
    await category.save();

    return Response.json(category, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to create category" },
      { status: 500 }
    );
  }
}
