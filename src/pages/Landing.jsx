import React from 'react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingDashboardPreview from '@/components/landing/LandingDashboardPreview';
import LandingBenefits from '@/components/landing/LandingBenefits';
import LandingStats from '@/components/landing/LandingStats';
import LandingHowItWorks from '@/components/landing/LandingHowItWorks';
import LandingTestimonials from '@/components/landing/LandingTestimonials';
import LandingPricing from '@/components/landing/LandingPricing';
import LandingMobileApps from '@/components/landing/LandingMobileApps';
import LandingFAQ from '@/components/landing/LandingFAQ';
import LandingFinalCTA from '@/components/landing/LandingFinalCTA';
import LandingFooter from '@/components/landing/LandingFooter';
import { usePageMetadata } from '@/hooks/use-page-metadata';

export default function Landing() {
  usePageMetadata('Fleet Drive AI Demo', 'Explore Fleet Drive AI through a working full-stack Demo with real authentication, responsive fleet workflows and transparent simulated data.');

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingDashboardPreview />
        <LandingBenefits />
        <LandingStats />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingPricing />
        <LandingMobileApps />
        <LandingFAQ />
        <LandingFinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
