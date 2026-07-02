import { connectToDatabase } from "@/lib/server/db";
import { signAdminToken } from "@/lib/server/auth";
import { Admin } from "@/lib/server/models/Admin";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await (
      admin as typeof admin & {
        comparePassword: (candidatePassword: string) => Promise<boolean>;
      }
    ).comparePassword(password);
    if (!isMatch) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signAdminToken({
      id: String(admin._id),
      role: admin.role,
    });

    return Response.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Login failed" },
      { status: 500 }
    );
  }
}
