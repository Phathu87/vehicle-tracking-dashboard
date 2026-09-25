import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Cpu, Wrench, BarChart3, Fuel, Shield, Users, Route, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: MapPin, title: 'Fleet Tracking', desc: 'Inspect simulated vehicle location and status context.', status: 'Simulated data', to: '/solutions/fleet-tracking' },
  { icon: Cpu, title: 'Operational Indicators', desc: 'Review deterministic Demo signals while commercial AI remains future work.', status: 'Real Demo function', to: '/features' },
  { icon: Wrench, title: 'Maintenance', desc: 'Compare mileage and service intervals to prioritise attention.', status: 'Real Demo function', to: '/solutions/maintenance' },
  { icon: BarChart3, title: 'Reports', desc: 'Review maintenance and trip reports generated from persisted Demo records.', status: 'Real Demo function', to: '/solutions/reports' },
  { icon: Fuel, title: 'Fuel Visibility', desc: 'Review simulated fuel conditions alongside vehicle context.', status: 'Simulated data', to: '/features' },
  { icon: Shield, title: 'Geofencing', desc: 'Create Demo zones and inspect vehicle entry or exit state.', status: 'Real Demo function', to: '/solutions/geofencing' },
  { icon: Users, title: 'Driver Management', desc: 'Inspect profiles, assignments and demonstration performance data.', status: 'Real Demo function', to: '/solutions/driver-management' },
  { icon: Route, title: 'Route Optimisation', desc: 'Order stops with the transparent nearest-neighbour Demo algorithm.', status: 'Demo-only', to: '/solutions' },
];

export default function LandingFeatures() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-primary">Capabilities</span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mt-3">Everything you need to run a smarter fleet.</h2>
          <p className="mt-4 text-muted-foreground">A unified operational platform that centralises visibility, compliance and decision-making.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.article key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/40 hover:bg-accent/40">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary/20">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-[15px]">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <p className="mt-4 text-[10px] font-semibold uppercase text-muted-foreground">{f.status}</p>
              <Link to={f.to} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Learn more <ArrowRight className="w-3 h-3" /></Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
