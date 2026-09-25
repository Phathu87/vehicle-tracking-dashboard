import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const handleMenu = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) setMobileOpen(true);
    else setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#030b16]">
      <div className="hidden lg:block"><DashboardSidebar collapsed={collapsed} /></div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Main navigation">
          <button type="button" className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <div className="absolute left-0 top-0 bottom-0 w-[min(18rem,86vw)]"><DashboardSidebar collapsed={false} onNavigate={() => setMobileOpen(false)} /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuToggle={handleMenu} />
        <main ref={mainRef} id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto bg-[#030b16] p-3 lg:p-4"><Outlet /></main>
      </div>
    </div>
  );
}
