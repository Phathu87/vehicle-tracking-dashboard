import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a71a0e6e236bf9b6b0c3134/9de1b5629_generated_image.png';

export default function LandingHero() {
  return (
    <section className="relative flex min-h-[calc(100svh-3rem)] items-center overflow-hidden border-b border-border bg-[#07111f] pt-24 pb-16 text-white">
      <img src={HERO_IMAGE} alt="Fleet vehicle operating at night" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-[#07111f]/75" />
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#07111f] via-[#07111f]/80 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Working full-stack demonstration
          </div>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">Fleet Drive AI</h1>
          <p className="mt-5 max-w-2xl text-xl font-semibold leading-snug text-white sm:text-2xl">A clearer operational picture for every vehicle, driver and service decision.</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">Explore the intended commercial fleet-management product through a real React and Express Demo powered by transparent simulated fleet data.</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-6 text-[15px]"><Link to="/register">Get Started <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-white/30 bg-black/20 px-6 text-[15px] text-white hover:bg-white hover:text-[#07111f]"><Link to="/app/dashboard"><LayoutDashboard className="h-4 w-4" /> Open Dashboard Demo</Link></Button>
          </div>

          <div className="mt-8 flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Real authentication</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Simulated fleet telemetry</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Explicit product boundaries</span>
          </div>
        </motion.div>
      </div>

      <Link to="/prototype" className="absolute bottom-4 right-5 text-[11px] text-white/55 underline-offset-4 hover:text-white hover:underline">Read the Demo disclosure</Link>
    </section>
  );
}
