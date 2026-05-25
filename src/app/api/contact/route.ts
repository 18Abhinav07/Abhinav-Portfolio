import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, message } = (await req.json()) as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!email || !message) {
    return NextResponse.json({ error: "email and message required" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "mail service unconfigured" }, { status: 503 });
  }

  const { error } = await resend.emails.send({
    from: "Landline <noreply@abhinavpangaria.com>",
    to: ["abhinavpangaria2003@gmail.com"],
    replyTo: email,
    subject: `[Landline] ${name || "Unnamed"} · new transmission`,
    text: `From: ${name || "Unnamed"} <${email}>\n\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
