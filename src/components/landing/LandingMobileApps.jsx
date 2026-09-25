import { Link } from 'react-router-dom';
import { ArrowRight, Bell, MapPinned, Smartphone } from 'lucide-react';

export default function LandingMobileApps() {
  return (
    <section className="border-y border-border bg-secondary/35 py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground"><Smartphone className="h-3.5 w-3.5 text-primary" /> Mobile product direction</div>
          <h2 className="mt-5 font-heading text-3xl font-bold sm:text-4xl">Fleet context where the work happens.</h2>
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">Mobile experiences are planned for the commercial Fleet Drive AI product. No iOS or Android application is currently published.</p>
          <Link to="/mobile-apps" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Read the mobile roadmap <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <div className="mx-auto w-full max-w-md border-l-4 border-primary bg-card p-6 shadow-xl sm:p-8">
          <div className="flex items-center justify-between border-b border-border pb-4"><span className="text-sm font-bold">Mobile concept</span><span className="rounded-full bg-warning/10 px-2 py-1 text-[10px] font-semibold text-warning">NOT PUBLISHED</span></div>
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 rounded-md border border-border p-4"><MapPinned className="h-5 w-5 text-primary" /><div><p className="text-sm font-semibold">Vehicle status</p><p className="text-xs text-muted-foreground">Planned location and activity view</p></div></div>
            <div className="flex items-center gap-3 rounded-md border border-border p-4"><Bell className="h-5 w-5 text-warning" /><div><p className="text-sm font-semibold">Operational alerts</p><p className="text-xs text-muted-foreground">Planned priority notification flow</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
