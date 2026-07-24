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

// In-memory OTP store (resets on cold start — fine for dev/demo)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();
const OTP_EXPIRY_MS = 5 * 60 * 1000;

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

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(phone: string, otp: string): void {
  otpStore.set(phone, { otp, expiresAt: Date.now() + OTP_EXPIRY_MS });
}

export function verifyOTP(phone: string, otp: string): boolean {
  const stored = otpStore.get(phone);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  if (stored.otp !== otp) return false;
  otpStore.delete(phone);
  return true;
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
