import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

const COLUMNS = [
  { title: 'Product', links: [['Features', '/features'], ['Pricing', '/pricing'], ['Mobile Apps', '/mobile-apps'], ['Changelog', '/changelog'], ['Roadmap', '/roadmap']] },
  { title: 'Solutions', links: [['Fleet Tracking', '/solutions/fleet-tracking'], ['Driver Management', '/solutions/driver-management'], ['Maintenance', '/solutions/maintenance'], ['Geofencing', '/solutions/geofencing'], ['Reports', '/solutions/reports']] },
  { title: 'Company', links: [['About', '/about'], ['Careers', '/careers'], ['Blog', '/blog'], ['Contact', '/contact'], ['Partners', '/partners']] },
  { title: 'Resources', links: [['Documentation', '/documentation'], ['Support', '/support'], ['API Reference', '/api-reference'], ['Status', '/status'], ['Community', '/community']] },
  { title: 'Legal', links: [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Cookie Policy', '/cookies'], ['Prototype Disclaimer', '/prototype']] },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-border bg-secondary/35">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><Truck className="h-4 w-4" /></span>
              <span className="font-heading text-sm font-bold">Fleet Drive AI</span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">Smarter fleet management for modern operations.</p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">This is the working Demo environment. Fleet data is simulated.</p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">{column.title}</h2>
              <ul className="space-y-2">
                {column.links.map(([label, to]) => <li key={to}><Link to={to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© 2026 Fleet Drive AI. Demo environment.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/cookies" className="hover:text-foreground">Cookies</Link>
            <Link to="/prototype" className="font-medium text-warning hover:text-foreground">Demo disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
