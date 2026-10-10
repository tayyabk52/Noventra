import { NextResponse } from "next/server";
import { checkRateLimit, getExistingEnquiry, saveEnquiry, validateEnquiry } from "@/lib/enquiries";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try { if (new URL(origin).host !== (request.headers.get("host") || new URL(request.url).host)) return NextResponse.json({ error: "Submit your enquiry from the Noventra website." }, { status: 403 }); }
    catch { return NextResponse.json({ error: "Invalid request origin." }, { status: 403 }); }
  }
  if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Use a JSON request." }, { status: 415 });
  if (Number(request.headers.get("content-length") || 0) > 16000) return NextResponse.json({ error: "Your message is too long." }, { status: 413 });
  const raw = await request.text();
  if (raw.length > 16000) return NextResponse.json({ error: "Your message is too long." }, { status: 413 });
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return NextResponse.json({ error: "Your enquiry could not be read. Please try again." }, { status: 400 }); }
  const enquiry = validateEnquiry(input);
  if (!enquiry) return NextResponse.json({ error: "Enter a valid email, keep your message under 3,000 characters, and agree to the privacy policy." }, { status: 400 });
  const key = request.headers.get("idempotency-key");
  if (!key || !/^[0-9a-f-]{36}$/i.test(key)) return NextResponse.json({ error: "Refresh the page before submitting." }, { status: 400 });
  const existing = getExistingEnquiry(key, enquiry);
  if (existing) return NextResponse.json({ reference: existing.reference }, { headers: { "Cache-Control": "no-store" } });
  const identifier = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || enquiry.email;
  if (!checkRateLimit(identifier)) return NextResponse.json({ error: "You’ve sent several enquiries. Please wait ten minutes before trying again." }, { status: 429, headers: { "Retry-After": "600" } });
  try {
    const result = await saveEnquiry(enquiry, key);
    return NextResponse.json({ reference: result.reference }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Your enquiry could not be saved. Your details are still here; please try again." }, { status: 503 });
  }
}
