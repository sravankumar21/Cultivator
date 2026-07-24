import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

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

// Store OTP in MongoDB (survives serverless cold starts)
export async function storeOTP(phone: string, otp: string): Promise<void> {
  // Delete any existing OTPs for this phone
  await prisma.otpToken.deleteMany({ where: { phone } });
  // Create new OTP
  await prisma.otpToken.create({
    data: {
      phone,
      otp,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    },
  });
}

// Verify OTP from MongoDB
export async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  const record = await prisma.otpToken.findFirst({
    where: {
      phone,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return false;
  if (record.otp !== otp) return false;

  // Mark as used
  await prisma.otpToken.update({
    where: { id: record.id },
    data: { used: true },
  });

  return true;
}

// Send OTP via Twilio SMS (or log in dev)
export async function sendOTPSms(phone: string, otp: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    // No Twilio configured — log OTP for dev/testing
    console.log(`[OTP] No Twilio configured. OTP for ${phone}: ${otp}`);
    return false;
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const body = new URLSearchParams({
      To: `+91${phone}`,
      From: fromNumber,
      body: `Your Cultivator verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[OTP] Twilio SMS failed:", err);
      return false;
    }

    console.log(`[OTP] SMS sent to ${phone}`);
    return true;
  } catch (err) {
    console.error("[OTP] Twilio error:", err);
    return false;
  }
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
