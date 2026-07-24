import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "cultivator-dev-secret-change-in-production"
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
