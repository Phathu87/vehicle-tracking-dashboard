import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Award, CalendarClock, Car, Mail, Pencil, Phone, Save, Trash2 } from 'lucide-react';
import AssignedVehicles from '@/components/drivers/AssignedVehicles';
import { driversApi } from '@/api/drivers';
import { getVehicles } from '@/api/vehicles';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

const inputClass = 'h-9 w-full rounded-md border border-[#1b3551] bg-[#071426] px-3 text-sm outline-none focus:border-primary';
const licenceStyle = { valid: 'bg-success/10 text-success', expiring: 'bg-warning/10 text-warning', expired: 'bg-danger/10 text-danger' };

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { canMutateSharedDemo } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [form, setForm] = useState({ name: '', licenceNumber: '', licenceExpiry: '', phone: '', email: '' });
  const [selectedVehicles, setSelectedVehicles] = useState(new Set());
  const driverQuery = useQuery({ queryKey: ['driver', id], queryFn: ({ signal }) => driversApi.get(id, { signal }), refetchInterval: 30_000 });
  const vehiclesQuery = useQuery({ queryKey: ['vehicles'], queryFn: ({ signal }) => getVehicles({ signal }) });
  const driver = driverQuery.data;

  useEffect(() => {
    if (!driver) return;
    setForm({ name: driver.name, licenceNumber: driver.licenceNumber, licenceExpiry: driver.licenceExpiry, phone: driver.phone || '', email: driver.email || '' });
  }, [driver]);

  const updateMutation = useMutation({ mutationFn: () => driversApi.update(id, form), onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ['driver', id] }), queryClient.invalidateQueries({ queryKey: ['drivers'] }), queryClient.invalidateQueries({ queryKey: ['vehicles'] })]); setEditOpen(false); toast({ title: 'Driver updated', description: 'Changes were persisted by the backend.' }); } });
  const assignmentMutation = useMutation({ mutationFn: () => driversApi.assignVehicles(id, [...selectedVehicles]), onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ['driver', id] }), queryClient.invalidateQueries({ queryKey: ['drivers'] }), queryClient.invalidateQueries({ queryKey: ['vehicles'] })]); setAssignOpen(false); toast({ title: 'Assignments updated', description: 'Vehicle assignments were saved by the backend.' }); } });
  const deleteMutation = useMutation({ mutationFn: () => driversApi.remove(id), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['drivers'] }); toast({ title: 'Driver deleted', description: 'The driver record was removed.' }); navigate('/app/drivers'); } });
  const vehicles = useMemo(() => Array.isArray(vehiclesQuery.data) ? vehiclesQuery.data : [], [vehiclesQuery.data]);

  if (driverQuery.isPending) return <div className="space-y-3"><Skeleton className="h-8 w-40" /><Skeleton className="h-28" /><Skeleton className="h-72" /></div>;
  if (driverQuery.isError) return <div className="rounded-lg border border-danger/30 bg-danger/5 p-10 text-center"><AlertCircle className="mx-auto h-8 w-8 text-danger" /><h1 className="mt-3 font-semibold">Driver unavailable</h1><p className="mt-1 text-sm text-muted-foreground">{driverQuery.error.message}</p><Button className="mt-4" asChild><Link to="/app/drivers">Back to drivers</Link></Button></div>;

  const openAssignments = () => { setSelectedVehicles(new Set(driver.assignedVehicles.map((vehicle) => vehicle.id))); setAssignOpen(true); };
  const toggleVehicle = (vehicleId) => setSelectedVehicles((current) => { const next = new Set(current); if (next.has(vehicleId)) next.delete(vehicleId); else next.add(vehicleId); return next; });
  const removeDriver = () => { if (window.confirm(`Delete ${driver.name}? This cannot be undone.`)) deleteMutation.mutate(); };
  const initials = driver.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4 pb-8">
      <Link to="/app/drivers" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-white"><ArrowLeft className="h-4 w-4" />Back to drivers</Link>
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-sm font-semibold text-white">{initials}</div><div><h1 className="font-heading text-xl font-bold">{driver.name}</h1><p className="text-xs text-muted-foreground">{driver.id} · {driver.assignedVehicleCount} assigned vehicle{driver.assignedVehicleCount === 1 ? '' : 's'}</p></div></div>{canMutateSharedDemo && <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setEditOpen(true)}><Pencil className="h-4 w-4" />Edit</Button><Button size="sm" variant="destructive" disabled={driver.assignedVehicleCount > 0 || deleteMutation.isPending} title={driver.assignedVehicleCount ? 'Unassign all vehicles before deleting' : undefined} onClick={removeDriver}><Trash2 className="h-4 w-4" />Delete</Button></div>}</div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4"><p className="flex items-center gap-2 text-xs text-[#8298b2]"><Award className="h-4 w-4 text-primary" />Licence</p><p className="mt-2 font-semibold">{driver.licenceNumber}</p><span className={cn('mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize', licenceStyle[driver.licenceStatus])}>{driver.licenceStatus}</span></div>
        <div className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4"><p className="flex items-center gap-2 text-xs text-[#8298b2]"><CalendarClock className="h-4 w-4 text-primary" />Expiry</p><p className="mt-2 font-semibold">{driver.licenceExpiry}</p><p className="mt-2 text-[10px] capitalize text-[#8298b2]">Renewal: {driver.renewalState.replace('_', ' ')}</p></div>
        <div className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4"><p className="flex items-center gap-2 text-xs text-[#8298b2]"><Phone className="h-4 w-4 text-primary" />Phone</p>{driver.phone ? <a className="mt-2 block font-semibold hover:text-primary" href={`tel:${driver.phone}`}>{driver.phone}</a> : <p className="mt-2 text-muted-foreground">Not supplied</p>}<p className="mt-2 text-[10px] text-[#60748d]">Opens your phone handler; no delivery claim.</p></div>
        <div className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4"><p className="flex items-center gap-2 text-xs text-[#8298b2]"><Mail className="h-4 w-4 text-primary" />Email</p>{driver.email ? <a className="mt-2 block truncate font-semibold hover:text-primary" href={`mailto:${driver.email}`}>{driver.email}</a> : <p className="mt-2 text-muted-foreground">Not supplied</p>}<p className="mt-2 text-[10px] text-[#60748d]">Opens your mail client; nothing is sent here.</p></div>
      </div>

      <section><div className="mb-2 flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-semibold"><Car className="h-4 w-4 text-primary" />Assigned Vehicles</h2>{canMutateSharedDemo && <Button size="sm" variant="outline" onClick={openAssignments}>Manage assignments</Button>}</div><AssignedVehicles vehicles={driver.assignedVehicles} /></section>

      {(updateMutation.isError || assignmentMutation.isError || deleteMutation.isError) && <p className="rounded-md border border-danger/30 bg-danger/5 p-3 text-xs text-danger">{(updateMutation.error || assignmentMutation.error || deleteMutation.error).message}</p>}

      <Dialog open={editOpen} onOpenChange={setEditOpen}><DialogContent className="border-[#1b3551] bg-[#091a2e]"><DialogHeader><DialogTitle>Edit driver</DialogTitle></DialogHeader><form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); updateMutation.mutate(); }}>{Object.entries({ name: 'Full name', licenceNumber: 'Licence number', licenceExpiry: 'Licence expiry', phone: 'Phone', email: 'Email' }).map(([field, label]) => <label key={field} className="space-y-1 text-xs text-[#8298b2]"><span>{label}</span><input required={['name', 'licenceNumber', 'licenceExpiry'].includes(field)} type={field === 'licenceExpiry' ? 'date' : field === 'email' ? 'email' : 'text'} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} className={inputClass} /></label>)}<div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button><Button type="submit" disabled={updateMutation.isPending}><Save className="h-4 w-4" />Save changes</Button></div></form></DialogContent></Dialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}><DialogContent className="max-w-2xl border-[#1b3551] bg-[#091a2e]"><DialogHeader><DialogTitle>Manage vehicle assignments</DialogTitle></DialogHeader><p className="text-xs text-[#8298b2]">Saving replaces this driver&apos;s assignment set. Vehicles selected here are reassigned by the backend transaction.</p><div className="max-h-[50vh] overflow-auto rounded-md border border-[#1b3551]">{vehicles.map((vehicle) => <label key={vehicle.id} className="flex cursor-pointer items-center gap-3 border-b border-[#1b3551] px-3 py-2 last:border-0 hover:bg-[#0d223a]"><input type="checkbox" checked={selectedVehicles.has(vehicle.id)} onChange={() => toggleVehicle(vehicle.id)} /><span className="min-w-0 flex-1 text-xs"><strong>{vehicle.id}</strong> · {vehicle.plate} · {vehicle.make} {vehicle.model}</span><span className="text-[10px] text-[#8298b2]">{vehicle.driver || 'Unassigned'}</span></label>)}</div><div className="flex items-center justify-between"><span className="text-xs text-[#8298b2]">{selectedVehicles.size} selected</span><div className="flex gap-2"><Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button><Button disabled={assignmentMutation.isPending} onClick={() => assignmentMutation.mutate()}>Save assignments</Button></div></div></DialogContent></Dialog>
    </div>
  );
}
