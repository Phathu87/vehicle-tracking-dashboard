import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TIERS = [
  { name: 'Starter', price: 'R299', period: '/month', desc: 'Concept tier · up to 10 vehicles', features: ['Fleet visibility', 'Basic alerts concept', 'Standard reporting concept', 'Support to be defined'], cta: 'Try the Demo', to: '/register', highlight: false },
  { name: 'Operations', price: 'R699', period: '/month', desc: 'Concept tier · up to 50 vehicles', features: ['Starter concept scope', 'Maintenance workflows', 'Geofencing concept', 'Operational reporting', 'Support to be defined'], cta: 'Try the Demo', to: '/register', highlight: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'Future commercial engagement', features: ['Operations concept scope', 'Integration discovery', 'Deployment planning', 'Service terms to be defined', 'Commercial analytics roadmap'], cta: 'Product Information', to: '/contact', highlight: false },
];

export default function LandingPricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-primary">Pricing</span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mt-3">An illustrative pricing presentation</h2>
          <p className="mt-4 text-sm text-muted-foreground">These figures demonstrate a possible packaging model. They are not final commercial pricing or an offer for sale.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {TIERS.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative rounded-lg border p-6 ${t.highlight ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-border bg-card'}`}>
              {t.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">Concept highlight</span>}
              <p className="font-heading font-semibold">{t.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              <div className="mt-4 flex items-baseline gap-1"><span className="font-heading text-3xl font-extrabold">{t.price}</span>{t.period && <span className="text-sm text-muted-foreground">{t.period}</span>}</div>
              <Button asChild variant={t.highlight ? 'default' : 'outline'} className="w-full mt-5"><Link to={t.to}>{t.cta}{t.highlight && <ArrowRight className="w-4 h-4 ml-1" />}</Link></Button>
              <ul className="mt-6 space-y-2.5">{t.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-success mt-0.5 shrink-0" />{f}</li>)}</ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
