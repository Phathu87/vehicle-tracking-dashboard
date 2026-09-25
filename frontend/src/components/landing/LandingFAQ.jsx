import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const FAQS = [
  ['Is Fleet Drive AI a real product?', 'Fleet Drive AI is the intended commercial fleet-management product. Fleet Drive AI Demo is its working full-stack demonstration environment.'],
  ['Is the Demo connected to live vehicles?', 'No. Vehicle locations, telemetry, drivers and operational scenarios are simulated. The Demo does not claim production GPS hardware.'],
  ['Which features really work?', 'Registration, login, session restoration, protected routing, API communication and the available fleet screens execute as real Demo functions. Other surfaces identify their current boundary.'],
  ['Is the displayed pricing final?', 'No. Pricing is an illustrative presentation for product discovery and is not a commercial quotation or final pricing model.'],
  ['Can I install a Fleet Drive AI mobile app?', 'No. Mobile applications are planned commercial features and are not currently published in app stores.'],
  ['Does the Demo have real customers or contracts?', 'No such claims are made. Named scenarios and records in the Demo are fictional and exist only to demonstrate product workflows.'],
];

export default function LandingFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className="mb-10 text-center"><p className="text-sm font-semibold text-primary">FAQ</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Clear answers about the Demo.</h2></div>
        <div className="divide-y divide-border border-y border-border">
          {FAQS.map(([question, answer], index) => (
            <div key={question}>
              <button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 py-5 text-left" aria-expanded={open === index}>
                <span className="font-medium">{question}</span>
                {open === index ? <Minus className="h-4 w-4 shrink-0 text-primary" /> : <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />}
              </button>
              {open === index && <p className="max-w-2xl pb-5 text-sm leading-7 text-muted-foreground">{answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
