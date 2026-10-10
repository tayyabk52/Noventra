"use client";
import Link from "next/link";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

interface SubmissionResult { reference?: string; error?: string }
export function ContactForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [reference, setReference] = useState("");
  const requestId = useRef<string | null>(null);
  const emailError = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Use a valid email, such as you@company.com." : "";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    const form = event.currentTarget;
    if (!form.reportValidity() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setError(""); setStatus("loading");
    requestId.current ??= crypto.randomUUID();
    const fields = new FormData(form);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": requestId.current },
        body: JSON.stringify({ email, message: fields.get("message"), consent: fields.get("consent") === "on", website: fields.get("website") }),
        signal: AbortSignal.timeout(15000)
      });
      const result: SubmissionResult = await response.json();
      if (!response.ok || !result.reference) throw new Error(result.error || "Your enquiry could not be saved. Please try again.");
      setReference(result.reference); setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "The connection timed out. Your details are still here; please try again.");
      setStatus("error");
    }
  }

  if (status === "success") return <div className="form-success" role="status"><CheckCircle2 size={30} aria-hidden="true" /><h3>Your enquiry is saved.</h3><p>Thanks for sharing your next step.<br />Your reference: <strong>{reference}</strong></p><Button variant="outline" arrow={false} onClick={() => { setStatus("idle"); setEmail(""); setTouched(false); requestId.current = null; }}>Send another enquiry</Button></div>;
  return <form className="contact-form" onSubmit={submit} noValidate aria-busy={status === "loading"}>
    <div className="field-group"><label htmlFor="contact-email">Work email <span aria-hidden="true">*</span></label><input id="contact-email" name="email" className="field" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" value={email} onChange={event => setEmail(event.target.value)} onBlur={() => setTouched(true)} required maxLength={254} aria-invalid={!!emailError} aria-describedby="email-help" /><p id="email-help" className={`field-help${emailError ? " is-error" : ""}`}>{emailError || "An address where we can continue the conversation."}</p></div>
    <div className="field-group"><label htmlFor="contact-message">What would you like to move forward?</label><textarea id="contact-message" name="message" className="field" placeholder="A workflow, a product idea, a business challenge…" rows={3} maxLength={3000} /><p className="field-help">A few details are enough to start.</p></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="website" type="text" autoComplete="off" tabIndex={-1} /></div>
    <label className="consent"><input name="consent" type="checkbox" required /><span>I agree to the <Link href="/privacy">privacy policy</Link> and consent to Noventra using these details for this enquiry.</span></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-footer"><Button type="submit" disabled={status === "loading"} arrow={status !== "loading"}>{status === "loading" && <LoaderCircle size={18} aria-hidden="true" />}{status === "loading" ? "Saving enquiry…" : status === "error" ? "Try again" : "Let’s talk"}</Button><p>A conversation starts here.</p></div>
  </form>;
}
