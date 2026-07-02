import { NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/server/auth";
import { connectToDatabase } from "@/lib/server/db";
import { State } from "@/lib/server/models/State";
import { generateSlug } from "@/lib/server/content";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") ?? "50";
    const lim = Number.parseInt(limit, 10);

    const states = await State.find().sort({ name: 1 }).limit(lim);
    return Response.json(states);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to fetch states" },
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
      return Response.json({ message: "State name is required" }, { status: 400 });
    }

    if (!data.slug) {
      data.slug = generateSlug(data.name);
    }

    const state = new State(data);
    await state.save();

    return Response.json(state, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Failed to create state" },
      { status: 500 }
    );
  }
}
