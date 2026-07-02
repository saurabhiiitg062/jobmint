import { connectToDatabase } from "@/lib/server/db";
import { Admin } from "@/lib/server/models/Admin";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { name, email, password, role } = await request.json();

    const existing = await Admin.findOne({ email });
    if (existing) {
      return Response.json(
        { message: "Admin email already exists" },
        { status: 400 }
      );
    }

    const admin = new Admin({ name, email, password, role });
    await admin.save();

    return Response.json(
      {
        message: "Admin registered successfully",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 }
    );
  }
}
