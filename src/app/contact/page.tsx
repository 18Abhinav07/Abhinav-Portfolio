import { Landline } from "@/components/Landline";

export const metadata = {
  title: "Contact · Abhinav Pangaria",
  description: "Pick up the line. Direct transmission.",
};

export default function ContactPage() {
  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <div className="grid md:grid-cols-12 gap-column-gap mb-stack-xl">
        <div className="md:col-span-4 font-mono text-label-mono uppercase tracking-[0.18em] text-primary">
          07 / Contact · Open line
          <div className="mt-stack-md text-on-surface-variant">
            Reply window · 48h
            <br />
            Hours · 09:00 to 23:00 IST
          </div>
        </div>
        <div className="md:col-span-8 max-w-2xl">
          <h1 className="font-display text-display-lg-mobile md:text-display-lg leading-[0.95] tracking-[-0.02em] text-on-surface mb-stack-md">
            Pick up <em className="italic text-primary">the line.</em>
          </h1>
          <p className="font-display italic text-headline-md text-on-surface-variant leading-[1.3]">
            Direct transmission. No noise, just the core message.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-column-gap">
        <div className="md:col-start-5 md:col-span-8 max-w-2xl">
          <Landline />
        </div>
      </div>
    </section>
  );
}
