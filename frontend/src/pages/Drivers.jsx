import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Plus, Search } from 'lucide-react';
import DriverCard from '@/components/drivers/DriverCard';
import { driversApi } from '@/api/drivers';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/AuthContext';

const emptyForm = { id: '', name: '', licenceNumber: '', licenceExpiry: '', phone: '', email: '' };
const inputClass = 'h-9 w-full rounded-md border border-[#1b3551] bg-[#071426] px-3 text-sm outline-none focus:border-primary';

export default function Drivers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { canMutateSharedDemo } = useAuth();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const driversQuery = useQuery({ queryKey: ['drivers'], queryFn: ({ signal }) => driversApi.list({ signal }), refetchInterval: 30_000 });
  const createMutation = useMutation({
    mutationFn: () => driversApi.create(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setOpen(false); setForm(emptyForm);
      toast({ title: 'Driver created', description: 'The driver was saved by the Fleet Drive API.' });
    },
  });
  const drivers = Array.isArray(driversQuery.data) ? driversQuery.data : [];
  const filtered = useMemo(() => drivers.filter((driver) => [driver.id, driver.name, driver.licenceNumber, driver.email, ...driver.assignedPlates].join(' ').toLowerCase().includes(query.toLowerCase())), [drivers, query]);

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = (event) => { event.preventDefault(); createMutation.mutate(); };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-heading text-xl font-bold">Drivers</h1><p className="text-xs text-muted-foreground">{drivers.length} persistent driver records</p></div>
        {canMutateSharedDemo && <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4" />Add driver</Button></DialogTrigger><DialogContent className="border-[#1b3551] bg-[#091a2e]"><DialogHeader><DialogTitle>Add driver</DialogTitle></DialogHeader><form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>{[['id', 'Driver ID'], ['name', 'Full name'], ['licenceNumber', 'Licence number'], ['licenceExpiry', 'Licence expiry'], ['phone', 'Phone'], ['email', 'Email']].map(([field, label]) => <label key={field} className="space-y-1 text-xs text-[#8298b2]"><span>{label}</span><input required={['id', 'name', 'licenceNumber', 'licenceExpiry'].includes(field)} type={field === 'licenceExpiry' ? 'date' : field === 'email' ? 'email' : 'text'} value={form[field]} onChange={set(field)} className={inputClass} /></label>)}{createMutation.isError && <p className="sm:col-span-2 text-xs text-danger">{createMutation.error.message}</p>}<div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Saving…' : 'Create driver'}</Button></div></form></DialogContent></Dialog>}
      </div>
      <label className="relative block"><span className="sr-only">Search drivers</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#60748d]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ID, name, licence, email or plate" className="h-9 w-full rounded-md border border-[#1b3551] bg-[#091a2e] pl-9 pr-3 text-xs outline-none focus:border-primary" /></label>
      {driversQuery.isPending ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className="h-64 rounded-lg" />)}</div> : driversQuery.isError ? <div className="rounded-lg border border-danger/30 bg-danger/5 p-8 text-center"><AlertCircle className="mx-auto h-7 w-7 text-danger" /><p className="mt-2 text-sm">{driversQuery.error.message}</p><Button className="mt-4" onClick={() => driversQuery.refetch()}>Retry</Button></div> : filtered.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filtered.map((driver) => <DriverCard key={driver.id} driver={driver} />)}</div> : <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted-foreground">No drivers match this search.</div>}
    </div>
  );
}
