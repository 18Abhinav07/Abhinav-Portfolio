"use client";

import { useState, KeyboardEvent } from "react";

export function Landline() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState<"" | "sending" | "sent" | "error" | "invalid-email">("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const send = async () => {
    if (!validateEmail(email)) {
      setStatus("invalid-email");
      return;
    }

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      if (status !== "sending" && transcript && email) {
        send();
      }
    }
  };

  const resetStatus = () => setStatus("");

  return (
    <div className="double-bezel-outer bg-on-surface/[0.01]">
      <div className="double-bezel-inner p-stack-lg flex flex-col gap-stack-lg bg-surface-container-low/40">
        <div className="flex items-center justify-between font-mono text-label-mono uppercase tracking-[0.18em]">
          <span className="bg-primary text-on-surface px-2 py-0.5 rounded font-bold flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-pill bg-on-surface" />
            Line ready
          </span>
          <span className="text-on-surface-variant font-bold">Direct Transmission</span>
        </div>

        <div className="flex flex-col gap-stack-md" onKeyDown={handleKeyDown}>
          <textarea
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              if (status) resetStatus();
            }}
            rows={5}
            maxLength={2000}
            placeholder="Your message… (Cmd+Enter to send)"
            className="input-field w-full text-base rounded-lg bg-surface-container-lowest/50 border border-outline-variant/30 hover:border-outline-variant/60 focus:border-primary/50 transition-all duration-300 ease-out placeholder:text-on-surface-variant/40"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (status) resetStatus();
              }}
              placeholder="Your name"
              maxLength={100}
              className="input-field h-12 w-full text-base rounded-lg bg-surface-container-lowest/50 border border-outline-variant/30 hover:border-outline-variant/60 focus:border-primary/50 transition-all duration-300 ease-out placeholder:text-on-surface-variant/40"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status) resetStatus();
              }}
              placeholder="email@domain.com"
              maxLength={150}
              required
              className={`input-field h-12 w-full text-base rounded-lg bg-surface-container-lowest/50 border transition-all duration-300 ease-out placeholder:text-on-surface-variant/40 ${status === "invalid-email" ? "border-error focus:ring-error" : "border-outline-variant/30 focus:border-primary/50"}`}
            />
          </div>
          <div className="flex flex-wrap gap-stack-sm mt-2">
            <button
              onClick={send}
              disabled={status === "sending" || !transcript || !email}
              className="group flex items-center gap-3 px-5 py-3 rounded-full bg-primary text-on-surface hover:bg-secondary hover:text-on-surface hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 uppercase font-mono text-[10px] tracking-widest font-semibold"
            >
              <span>{status === "sending" ? "Sending…" : "Send transmission"}</span>
              <div className="w-5 h-5 rounded-full bg-on-surface/5 group-hover:bg-on-surface/10 flex items-center justify-center text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500">
                ↗
              </div>
            </button>
          </div>

          <div aria-live="polite" className="mt-3">
            {status === "sent" && (
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface font-bold">
                ✓ Transmission received. Reply within 48h.
              </p>
            )}
            {status === "error" && (
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-error">
                ✕ Line dropped. Check your connection or retry.
              </p>
            )}
            {status === "invalid-email" && (
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-error">
                ✕ Invalid transmission address. Correct email required.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
