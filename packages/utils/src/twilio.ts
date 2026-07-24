// Twilio IVR/Bot Call integration
// In production, replace with real Twilio API calls
// Docs: https://www.twilio.com/docs/voice

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  webhookBaseUrl: string;
}

function getTwilioConfig(): TwilioConfig | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
  const webhookBaseUrl = process.env.WEBHOOK_BASE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  if (!accountSid || !authToken || !phoneNumber) return null;
  return { accountSid, authToken, phoneNumber, webhookBaseUrl };
}

// ─── Outbound Calls ────────────────────────────

export async function makeCall(to: string, twiml: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  const config = getTwilioConfig();

  if (!config) {
    console.log(`[Twilio Demo] Outbound call to: ${to}\nTwiml: ${twiml.substring(0, 100)}...`);
    return { success: true, sid: `demo-call-${Date.now()}` };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Calls.json`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to,
        From: config.phoneNumber,
        Twiml: twiml,
      }),
    });

    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message || "Call failed" };
    return { success: true, sid: data.sid };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── TwiML Generators ──────────────────────────

export function ivrWelcomeTwiML(): string {
  return `
    <Response>
      <Say language="te-IN" voice="Polly.Aditi">
        Namaskaram! Welcome to Cultivator. Your agricultural marketplace.
      </Say>
      <Gather numDigits="1" action="/api/ivr/menu" method="POST" timeout="5">
        <Say language="te-IN" voice="Polly.Aditi">
          Press 1 to speak with a dealer.
          Press 2 to check your order status.
          Press 3 for product information.
          Press 9 to repeat this menu.
        </Say>
      </Gather>
      <Say language="te-IN" voice="Polly.Aditi">
        We did not receive your selection. Goodbye.
      </Say>
      <Hangup />
    </Response>
  `.trim();
}

export function ivrRouteToDealerTwiML(dealerPhone: string, dealerName: string): string {
  return `
    <Response>
      <Say language="te-IN" voice="Polly.Aditi">
        Connecting you to ${dealerName}. Please hold.
      </Say>
      <Dial timeout="30" action="/api/ivr/dial-status" method="POST">
        <Number>${dealerPhone}</Number>
      </Dial>
      <Say language="te-IN" voice="Polly.Aditi">
        The dealer is not available. We will connect you to the next nearest dealer.
      </Say>
      <Redirect>/api/ivr/route-dealer</Redirect>
    </Response>
  `.trim();
}

export function ivrOrderStatusTwiML(): string {
  return `
    <Response>
      <Say language="te-IN" voice="Polly.Aditi">
        Please enter your 6-digit order number followed by the hash key.
      </Say>
      <Gather numDigits="6" action="/api/ivr/order-status" method="POST" timeout="10" finishOnKey="#">
        <Say>Waiting for your order number.</Say>
      </Gather>
      <Say language="te-IN" voice="Polly.Aditi">
        We did not receive your order number. Goodbye.
      </Say>
      <Hangup />
    </Response>
  `.trim();
}

export function ivrProductInfoTwiML(): string {
  return `
    <Response>
      <Say language="te-IN" voice="Polly.Aditi">
        For product information, press 1 for seeds, press 2 for fertilizers,
        press 3 for pesticides, or press 0 to speak with a dealer.
      </Say>
      <Gather numDigits="1" action="/api/ivr/product-category" method="POST" timeout="5">
        <Say>Press your choice now.</Say>
      </Gather>
      <Hangup />
    </Response>
  `.trim();
}

export function ivrMissedCallResponse(from: string): string {
  return `
    <Response>
      <Say language="te-IN" voice="Polly.Aditi">
        Thank you for calling Cultivator. A dealer will call you back shortly.
      </Say>
      <Hangup />
    </Response>
  `.trim();
}

// ─── Call Logging ──────────────────────────────

export interface CallLog {
  from: string;
  to: string;
  direction: "inbound" | "outbound";
  status: string;
  duration?: number;
  recordingUrl?: string;
  twilioSid?: string;
  ivrSelection?: string;
}

export function generateCallId(): string {
  return `call-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
