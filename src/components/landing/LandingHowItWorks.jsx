import { Activity, Search, UserPlus } from 'lucide-react';

const STEPS = [
  [UserPlus, 'Create a Demo account', 'Register through the real Express authentication API and enter the protected application.'],
  [Search, 'Explore the simulated fleet', 'Inspect vehicles, drivers, maintenance conditions and dashboard indicators.'],
  [Activity, 'Evaluate the product direction', 'Use clear labels to distinguish working behavior from planned commercial capabilities.'],
];

export default function LandingHowItWorks() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-12 max-w-2xl"><p className="text-sm font-semibold text-primary">How it works</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">From account to fleet context in three steps.</h2></div>
        <ol className="grid gap-8 md:grid-cols-3">
          {STEPS.map(([Icon, title, copy], index) => (
            <li key={title} className="border-t-2 border-primary pt-5">
              <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-primary" /><span className="font-mono text-xs text-muted-foreground">0{index + 1}</span></div>
              <h3 className="mt-5 font-heading text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
