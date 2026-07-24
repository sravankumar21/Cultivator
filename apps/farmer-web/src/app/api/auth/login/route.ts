import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { signToken, jsonError, jsonResponse } from "@/lib/auth";

const users = [
  {
    id: "user-dealer-001",
    email: "dealer@lakshmi.com",
    passwordHash: bcrypt.hashSync("dealer123", 10),
    name: "Sri Lakshmi Agro",
    role: "dealer_owner",
    dealerId: "dlr-001",
    enterpriseId: "ent-001",
  },
  {
    id: "user-admin-001",
    email: "admin@cultivator.in",
    passwordHash: bcrypt.hashSync("admin123", 10),
    name: "Admin User",
    role: "enterprise_admin",
    enterpriseId: "ent-001",
  },
];

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return jsonError("Email and password are required");

    const user = users.find((u) => u.email === email);
    if (!user) return jsonError("Invalid credentials", 401);

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return jsonError("Invalid credentials", 401);

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      dealerId: user.dealerId,
      enterpriseId: user.enterpriseId,
    });

    return jsonResponse({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        dealerId: user.dealerId,
        enterpriseId: user.enterpriseId,
      },
    });
  } catch {
    return jsonError("Login failed", 500);
  }
}
