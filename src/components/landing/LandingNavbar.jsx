import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Menu, Truck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const NAV_LINKS = [
  { label: 'Features', to: '/features' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Support', to: '/support' },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${scrolled ? 'border-border bg-background/95 backdrop-blur-xl' : 'border-transparent bg-background/80 backdrop-blur-md'}`}>
      <nav aria-label="Primary navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Fleet Drive AI home">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><Truck className="h-[18px] w-[18px]" /></span>
          <span className="font-heading text-[15px] font-bold">Fleet Drive AI</span>
          <span className="hidden rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline">DEMO</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `px-3 py-2 text-sm transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Log In</Link>
          <Button asChild size="sm" variant={isAuthenticated ? 'outline' : 'default'}>
            <Link to={isAuthenticated ? '/app/dashboard' : '/register'}>
              {isAuthenticated && <LayoutDashboard className="h-4 w-4" />}
              {isAuthenticated ? 'Dashboard' : 'Get Started'}
            </Link>
          </Button>
        </div>

        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-border bg-background lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-4">
                <Button asChild variant="outline"><Link to="/login" onClick={() => setOpen(false)}>Log In</Link></Button>
                <Button asChild><Link to={isAuthenticated ? '/app/dashboard' : '/register'} onClick={() => setOpen(false)}>{isAuthenticated ? 'Dashboard' : 'Get Started'}</Link></Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
