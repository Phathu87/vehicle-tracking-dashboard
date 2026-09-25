import { Clock3, Eye, Layers3, ShieldCheck } from 'lucide-react';

const BENEFITS = [
  [Eye, 'See the whole operation', 'Bring vehicles, drivers and service conditions into a shared operational view.'],
  [Clock3, 'Respond with context', 'Move from a fleet-level indicator to the record that needs attention.'],
  [Layers3, 'Build on one data path', 'Keep simulation at the data-source layer so screens can consume the same API patterns as future integrations.'],
  [ShieldCheck, 'Know what is real', 'Separate working Demo functions, simulated data and planned commercial features.'],
];

export default function LandingBenefits() {
  return (
    <section className="bg-secondary/35 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold text-primary">Why Fleet Drive AI</p>
            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Operational clarity without losing the details.</h2>
          </div>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {BENEFITS.map(([Icon, title, copy]) => (
              <article key={title} className="border-t border-border pt-5">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-heading font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
