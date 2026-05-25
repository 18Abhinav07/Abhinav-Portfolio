import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.name} · Abhinav Pangaria`,
    description: p.tagline,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const next = projects[(projects.findIndex((x) => x.slug === p.slug) + 1) % projects.length];

  return (
    <article>
      <header className="px-6 md:px-[80px] pt-[120px] pb-stack-xl">
        <div className="grid md:grid-cols-12 gap-column-gap">
          <div className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary">
            {p.index} · {p.ecosystem}
            <div className="mt-stack-md text-on-surface-variant">
              {p.role}
              <br />
              {p.year}
            </div>
          </div>
          <div className="md:col-span-9 max-w-3xl">
            <h1 className="font-display text-display-lg-mobile md:text-display-lg leading-[0.95] tracking-[-0.02em] text-on-surface mb-stack-md">
              {p.name}.
            </h1>
            <p className="font-display italic text-headline-md text-on-surface-variant leading-[1.3]">
              {p.tagline}
            </p>
          </div>
        </div>
      </header>

      <Reveal className="px-6 md:px-[80px] mb-[120px]" y={48}>
        <div className="relative aspect-video w-full overflow-hidden brutalist-rule-t brutalist-rule-b brutalist-rule-l brutalist-rule-r">
          <Image
            src={p.heroImage}
            alt={p.name}
            fill
            className="object-cover"
            sizes="(min-width: 768px) calc(100vw - 160px), 100vw"
            priority
          />
        </div>
      </Reveal>

      <section className="px-6 md:px-[80px] mb-[120px]">
        <div className="grid md:grid-cols-12 gap-column-gap">
          <div className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary">
            Brief
          </div>
          <div className="md:col-span-9 max-w-3xl">
            <p className="editorial-text text-on-surface drop-cap">
              {p.description}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-[80px] mb-[120px] grid md:grid-cols-12 gap-column-gap">
        <div className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary mb-stack-md md:mb-0">
          Metrics
        </div>
        <StaggerGroup className="md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-stack-md">
          {p.metrics.map((m) => (
            <StaggerItem key={m.label} className="border-l-2 border-primary pl-stack-md">
              <div className="font-display text-headline-md text-on-surface tracking-[-0.01em]">
                {m.value}
              </div>
              <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant mt-1">
                {m.label}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="px-6 md:px-[80px] mb-[120px] grid md:grid-cols-12 gap-column-gap">
        <div className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary mb-stack-md md:mb-0">
          Stack
        </div>
        <div className="md:col-span-9 flex flex-wrap gap-stack-sm">
          {p.stack.map((t) => (
            <span
              key={t}
              className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-sm py-1.5 border border-outline-variant rounded-pill text-on-surface-variant"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {p.screenshots.length > 1 && (
        <section className="px-6 md:px-[80px] mb-[120px]">
          <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-primary mb-stack-lg">
            Surface · {p.screenshots.length.toString().padStart(2, "0")} frames
          </div>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            {p.screenshots.slice(1).map((s, i) => (
              <StaggerItem key={s.src} className="relative">
                <div className="relative aspect-video w-full overflow-hidden brutalist-rule-t brutalist-rule-b brutalist-rule-l brutalist-rule-r">
                  <Image
                    src={s.src}
                    alt={s.caption || `${p.name} frame ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                {s.caption && (
                  <div className="mt-stack-sm font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
                    {s.caption}
                  </div>
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}

      {(p.liveUrl || p.githubUrl) && (
        <section className="px-6 md:px-[80px] mb-[120px] flex flex-wrap gap-stack-md">
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 bg-primary text-primary-on rounded-pill hover:bg-secondary hover:text-secondary-on transition-colors"
            >
              Live site →
            </a>
          )}
          {p.githubUrl && (
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 border border-outline-variant rounded-pill text-on-surface hover:border-primary hover:text-primary transition-colors"
            >
              Source →
            </a>
          )}
        </section>
      )}

      <nav className="px-6 md:px-[80px] py-[120px] brutalist-rule-t">
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-end justify-between"
        >
          <div>
            <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-primary mb-stack-sm">
              Next · {next.index}
            </div>
            <div className="font-display text-headline-lg tracking-[-0.02em] text-on-surface group-hover:text-secondary transition-colors">
              {next.name}.
            </div>
          </div>
          <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant group-hover:text-primary transition-colors">
            →
          </div>
        </Link>
      </nav>
    </article>
  );
}
