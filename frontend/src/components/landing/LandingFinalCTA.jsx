import { Link } from 'react-router-dom';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTA_IMAGE = 'https://media.base44.com/images/public/6a71a0e6e236bf9b6b0c3134/8802cc267_generated_image.png';

export default function LandingFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#07111f] py-20 text-white lg:py-28">
      <img src={CTA_IMAGE} alt="City routes at night" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-[#07111f]/65" />
      <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
        <h2 className="font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl">See the Fleet Drive AI product direction in motion.</h2>
        <p className="mx-auto mt-5 max-w-xl text-white/70">Create a Demo account or sign in to explore the working application with transparent simulated fleet data.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg"><Link to="/register">Get Started <ArrowRight className="h-4 w-4" /></Link></Button>
          <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white hover:text-[#07111f]"><Link to="/app/dashboard"><LayoutDashboard className="h-4 w-4" /> Dashboard Demo</Link></Button>
        </div>
      </div>
    </section>
  );
}
