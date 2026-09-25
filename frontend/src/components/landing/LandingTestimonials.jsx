import { BellRing, Route, Wrench } from 'lucide-react';

const SCENARIOS = [
  [Route, 'Dispatch overview', 'An operations coordinator opens the fleet view, spots an active vehicle and follows its driver and route context.'],
  [Wrench, 'Service prioritisation', 'A maintenance planner compares mileage and service intervals to identify vehicles that need attention first.'],
  [BellRing, 'Exception response', 'A fleet manager reviews a critical simulated state and moves directly into the relevant vehicle detail.'],
];

export default function LandingTestimonials() {
  return (
    <section className="bg-secondary/35 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold text-primary">Demo scenarios</p>
          <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">See how the product fits an operational day.</h2>
          <p className="mt-4 text-muted-foreground">These are fictional usage scenarios, not customer testimonials or evidence of deployed contracts.</p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {SCENARIOS.map(([Icon, title, copy]) => (
            <article key={title} className="bg-card p-6 lg:p-8">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-5 font-heading text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
