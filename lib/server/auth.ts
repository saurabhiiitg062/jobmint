import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "SelectionSure-secret-key-12345";

export type AdminTokenPayload = {
  id: string;
  role: string;
};

export function signAdminToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length);
}

export function verifyAdminRequest(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return {
      error: Response.json(
        { message: "Authorization token required" },
        { status: 401 }
      ),
    };
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    return { payload };
  } catch {
    return {
      error: Response.json(
        { message: "Invalid or expired token" },
        { status: 403 }
      ),
    };
  }
}
