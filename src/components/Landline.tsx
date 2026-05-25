"use client";

import { useEffect, useRef, useState } from "react";

type State = "idle" | "recording" | "edit";

declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

export function Landline() {
  const [state, setState] = useState<State>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState<"" | "sending" | "sent" | "error">("");
  const recRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (ev: SpeechRecognitionEvent) => {
      let final = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        final += ev.results[i][0].transcript;
      }
      setTranscript((prev) => (ev.results[ev.results.length - 1].isFinal ? prev + " " + final : prev));
    };
    rec.onend = () => setState((s) => (s === "recording" ? "edit" : s));
    recRef.current = rec;
  }, []);

  const startRecording = () => {
    setState("recording");
    recRef.current?.start();
  };

  const stopRecording = () => {
    recRef.current?.stop();
    setState("edit");
  };

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
      setState("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="border border-outline-variant p-stack-lg flex flex-col gap-stack-md">
      <div className="flex items-center justify-between font-mono text-label-mono uppercase tracking-[0.18em]">
        <span className="text-primary">
          <span className={`inline-block h-1.5 w-1.5 rounded-pill mr-2 ${state === "recording" ? "bg-error pulse-dot" : "bg-secondary"}`} />
          {state === "idle" && "Line ready"}
          {state === "recording" && "Recording…"}
          {state === "edit" && "Review and send"}
        </span>
        <span className="text-on-surface-variant">State · {state}</span>
      </div>

      {state === "idle" && (
        <div className="flex flex-col gap-stack-md">
          <p className="editorial-text text-on-surface">
            Speak into the handset or type below. The line stays open.
          </p>
          <div className="flex flex-wrap gap-stack-sm">
            <button
              onClick={startRecording}
              className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 bg-primary text-primary-on rounded-pill hover:bg-secondary hover:text-secondary-on transition-colors"
            >
              ◉ Start recording
            </button>
            <button
              onClick={() => setState("edit")}
              className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 border border-outline-variant rounded-pill text-on-surface hover:border-primary hover:text-primary transition-colors"
            >
              Type instead
            </button>
          </div>
        </div>
      )}

      {state === "recording" && (
        <div className="flex flex-col gap-stack-md">
          <div className="font-display italic text-headline-md text-on-surface min-h-[120px]">
            {transcript || <span className="text-on-surface-variant">Listening…</span>}
            <span className="blink">▍</span>
          </div>
          <button
            onClick={stopRecording}
            className="self-start font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 bg-error text-on-surface rounded-pill hover:opacity-90 transition-opacity"
          >
            ■ Stop
          </button>
        </div>
      )}

      {state === "edit" && (
        <div className="flex flex-col gap-stack-md">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={6}
            placeholder="Your message…"
            className="bg-surface-container-lowest border border-outline-variant px-stack-md py-stack-sm text-body-md text-on-surface focus:border-primary outline-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-surface-container-lowest border border-outline-variant px-stack-md py-stack-sm text-body-md text-on-surface focus:border-primary outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              className="bg-surface-container-lowest border border-outline-variant px-stack-md py-stack-sm text-body-md text-on-surface focus:border-primary outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-stack-sm">
            <button
              onClick={send}
              disabled={status === "sending" || !transcript || !email}
              className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 bg-primary text-primary-on rounded-pill hover:bg-secondary hover:text-secondary-on transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Sending…" : "Send transmission →"}
            </button>
            <button
              onClick={() => setState("idle")}
              className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 border border-outline-variant rounded-pill text-on-surface hover:border-primary hover:text-primary transition-colors"
            >
              Cancel
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
      )}
    </div>
  );
}
