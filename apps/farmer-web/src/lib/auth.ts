import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || (process.env.NODE_ENV === "production"
    ? (() => { throw new Error("JWT_SECRET environment variable is required in production"); })()
    : "cultivator-dev-secret-change-in-production")
);

export interface AuthSession {
  userId: string;
  email?: string;
  phone?: string;
  name: string;
  role: string;
  dealerId?: string;
  enterpriseId?: string;
}

export async function signToken(session: AuthSession): Promise<string> {
  return new SignJWT(session as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthSession;
  } catch {
    return null;
  }
}

// ─── PIN helpers (bcrypt via Web Crypto — no npm dependency) ──
// We use a simple SHA-256 hash + salt for PIN storage.
// For a 4-digit PIN this is sufficient — only 10,000 combinations.

export async function hashPin(pin: string): Promise<string> {
  const salt = crypto.randomUUID();
  const hash = await sha256(salt + pin);
  return `${salt}:${hash}`;
}

export async function verifyPin(pin: string, pinHash: string): Promise<boolean> {
  const [salt, hash] = pinHash.split(":");
  if (!salt || !hash) return false;
  const computed = await sha256(salt + pin);
  return computed === hash;
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getSession(req: NextRequest): Promise<AuthSession | null> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  return verifyToken(token);
}

export function jsonResponse(data: any, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function jsonError(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}

// Require authenticated session — returns session or null (callers should return jsonError("Unauthorized", 401) if null)
export async function requireAuth(req: NextRequest): Promise<AuthSession | null> {
  return getSession(req);
}

// Require specific roles — returns session or null
export async function requireRole(req: NextRequest, ...roles: string[]): Promise<AuthSession | null> {
  const session = await getSession(req);
  if (!session) return null;
  if (!roles.includes(session.role)) return null;
  return session;
}
