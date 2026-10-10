import { createHash, randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export interface Enquiry { email: string; message: string; consent: true }
export interface StoredEnquiry extends Enquiry { reference: string; createdAt: string }
interface RequestState { timestamp: number; count: number }
const rateLimits = new Map<string, RequestState>();
const idempotentResults = new Map<string, { timestamp: number; result: StoredEnquiry }>();

export function validateEnquiry(input: unknown): Enquiry | null {
  if (typeof input !== "object" || input === null) return null;
  const fields = input as Record<string, unknown>;
  if (typeof fields.email !== "string" || fields.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()) || fields.consent !== true) return null;
  if (typeof fields.message !== "string" || fields.message.length > 3000 || (fields.website !== undefined && fields.website !== "")) return null;
  return { email: fields.email.trim().toLowerCase(), message: fields.message.trim(), consent: true };
}
export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  for (const [key, entry] of rateLimits) if (now - entry.timestamp > 600000) rateLimits.delete(key);
  const key = createHash("sha256").update(identifier).digest("hex");
  const current = rateLimits.get(key);
  if (!current) { rateLimits.set(key, { timestamp: now, count: 1 }); return true; }
  current.count += 1;
  return current.count <= 5;
}
export function getExistingEnquiry(key: string, enquiry: Enquiry): StoredEnquiry | undefined {
  const now = Date.now();
  for (const [id, entry] of idempotentResults) if (now - entry.timestamp > 600000) idempotentResults.delete(id);
  const entry = idempotentResults.get(key);
  return entry?.result.email === enquiry.email && entry.result.message === enquiry.message ? entry.result : undefined;
}
export async function saveEnquiry(enquiry: Enquiry, key: string): Promise<StoredEnquiry> {
  const record: StoredEnquiry = { ...enquiry, reference: `NV-${randomUUID().slice(0, 8).toUpperCase()}`, createdAt: new Date().toISOString() };
  if (process.env.CONTACT_WEBHOOK_URL) {
    const url = new URL(process.env.CONTACT_WEBHOOK_URL);
    if (url.protocol !== "https:") throw new Error("Contact webhook must use HTTPS.");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": key, ...(process.env.CONTACT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` } : {}) },
      body: JSON.stringify(record), signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error("Contact destination did not accept the enquiry.");
  } else {
    // Runtime-created, write-only data is not a build dependency.
    const directory = path.resolve(/*turbopackIgnore: true*/ process.env.LEAD_STORAGE_DIR || ".data");
    await mkdir(directory, { recursive: true });
    await appendFile(path.join(directory, "enquiries.jsonl"), `${JSON.stringify(record)}\n`, { encoding: "utf8", mode: 0o600 });
  }
  idempotentResults.set(key, { timestamp: Date.now(), result: record });
  return record;
}
