import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { usePageMetadata } from '@/hooks/use-page-metadata';

export default function PublicInfoPage({ page }) {
  usePageMetadata(page.title, page.summary);

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <section className="border-b border-border bg-secondary/35 pt-28 pb-16 lg:pt-36 lg:pb-24">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <p className="text-sm font-semibold text-primary">{page.group}</p>
            <h1 className="mt-4 max-w-4xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{page.summary}</p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {page.status}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto grid max-w-5xl gap-px overflow-hidden rounded-lg border border-border bg-border px-0 md:grid-cols-3">
            {page.sections.map(([title, copy]) => (
              <article key={title} className="bg-card p-6 lg:p-8">
                <h2 className="font-heading text-lg font-bold">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-secondary/35 py-14">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center lg:px-8">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold"><Truck className="h-4 w-4 text-primary" /> Fleet Drive AI Demo</div>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">Explore the working application with simulated data and a real Express authentication flow.</p>
            </div>
            <Button asChild>
              <Link to={page.action?.to || '/register'}>
                {page.action?.label || 'Get Started'} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
