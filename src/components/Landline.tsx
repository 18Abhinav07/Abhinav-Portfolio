"use client";

import { useState } from "react";

export function Landline() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState<"" | "sending" | "sent" | "error">("");

  const send = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: transcript }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("sent");
      setTranscript("");
      setName("");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="border border-outline-variant p-stack-lg flex flex-col gap-stack-md">
      <div className="flex items-center justify-between font-mono text-label-mono uppercase tracking-[0.18em]">
        <span className="text-primary">
          <span className="inline-block h-1.5 w-1.5 rounded-pill mr-2 bg-secondary" />
          Line ready
        </span>
        <span className="text-on-surface-variant">Direct Transmission</span>
      </div>

      <div className="flex flex-col gap-stack-md">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={6}
          placeholder="Your message…"
          className="input-field w-full"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="input-field w-full"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@domain.com"
            className="input-field w-full"
          />
        </div>
        <div className="flex flex-wrap gap-stack-sm">
          <button
            onClick={send}
            disabled={status === "sending" || !transcript || !email}
            className="btn-primary"
          >
            {status === "sending" ? "Sending…" : "Send transmission →"}
          </button>
        </div>
        {status === "sent" && (
          <p className="font-mono text-label-mono uppercase tracking-[0.18em] text-secondary">
            ✓ Transmission received. Reply within 48h.
          </p>
        )}
        {status === "error" && (
          <p className="font-mono text-label-mono uppercase tracking-[0.18em] text-error">
            ✕ Line dropped. Try email directly.
          </p>
        )}
      </div>
    </div>
  );
}

