import { Landline } from "@/components/Landline";
import { site } from "@/content/site";

export const metadata = {
  title: "Contact · Abhinav Pangaria",
  description: "Pick up the line. Voice or keyboard.",
};

export default function ContactPage() {
  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <div className="grid md:grid-cols-12 gap-column-gap mb-stack-xl">
        <div className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary">
          06 / Contact · Open line
          <div className="mt-stack-md text-on-surface-variant">
            Reply window · 48h
            <br />
            Hours · 09:00 to 23:00 IST
          </div>
        </div>
        <div className="md:col-span-9 max-w-3xl">
          <h1 className="font-display text-display-lg-mobile md:text-display-lg leading-[0.95] tracking-[-0.02em] text-on-surface mb-stack-md">
            Pick up <em className="italic text-primary">the line.</em>
          </h1>
          <p className="font-display italic text-headline-md text-on-surface-variant leading-[1.3]">
            Voice or keyboard. Both routes end at the same inbox.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-column-gap">
        <div className="md:col-span-5">
          <div className="aspect-[4/5] w-full bg-surface-container-low brutalist-rule-t brutalist-rule-b brutalist-rule-l brutalist-rule-r relative overflow-hidden">
            <div className="absolute inset-0 grid-paper opacity-25" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="font-mono text-label-mono uppercase tracking-[0.2em] text-on-surface-variant">
                [ Spline · landline ]
              </div>
            </div>
            <div className="absolute bottom-stack-md left-stack-md right-stack-md font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
              <div className="text-secondary mb-1">
                <span className="inline-block h-1.5 w-1.5 rounded-pill bg-secondary pulse-dot mr-2" />
                Line open
              </div>
              <div>Direct · {site.email}</div>
            </div>
          </div>
        </div>
        <div className="md:col-span-7">
          <Landline />
        </div>
      </div>
    </section>
  );
}
