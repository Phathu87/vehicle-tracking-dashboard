import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5"><Construction className="w-8 h-8 text-primary" /></div>
      <h1 className="font-heading text-2xl font-bold">{title || 'Module Coming Soon'}</h1>
      <p className="mt-2 text-muted-foreground max-w-md">This module is not implemented in the current Demo.</p>
      <Button asChild className="mt-6"><Link to="/app/dashboard"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard</Link></Button>
    </div>
  );
}
