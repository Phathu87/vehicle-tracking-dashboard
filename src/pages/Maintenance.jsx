import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CalendarClock, CheckCircle2, Pencil, Plus, Trash2, Wrench } from 'lucide-react';
import { maintenanceApi } from '@/api/maintenance';
import { getVehicles } from '@/api/vehicles';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

const tabs = [
  { key: 'overdue', label: 'Overdue / Due' },
  { key: 'due_soon', label: 'Due soon' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'completed', label: 'Completed / History' },
];
const blankForm = { vehicleId: '', type: '', dueMileage: '', dueDate: '' };
const inputClass = 'h-9 w-full rounded-md border border-[#1b3551] bg-[#071426] px-3 text-sm outline-none focus:border-primary';
const stateClass = { overdue: 'bg-danger/10 text-danger', due_soon: 'bg-warning/10 text-warning', scheduled: 'bg-primary/10 text-primary', completed: 'bg-success/10 text-success' };

function TaskCard({ task, onEdit, onComplete, onDelete, busy, canMutate }) {
  const dueLabel = task.dueMileage != null ? `${Math.round(task.dueMileage).toLocaleString()} km` : task.dueDate || 'No due threshold';
  return (
    <article className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4">
      <div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-semibold text-white">{task.type}</h2><p className="mt-0.5 text-[11px] text-[#8298b2]">{task.vehicle.id} · {task.vehicle.plate}</p></div><span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium capitalize', stateClass[task.status])}>{task.status.replace('_', ' ')}</span></div>
      <div className="mt-3 space-y-1 text-xs text-[#a9b8ca]"><p>{task.vehicle.make} {task.vehicle.model} · {task.vehicle.city || 'Unknown city'}</p><p>Driver: {task.vehicle.driver || 'Unassigned'}</p><p className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-primary" />{task.status === 'completed' ? `Completed ${new Date(task.completedAt).toLocaleString()}` : `Due ${dueLabel}`}</p></div>
      {task.status !== 'completed' && task.dueMileage != null && <div className="mt-3"><div className="flex justify-between text-[10px] text-[#8298b2]"><span>Current mileage</span><span>{Math.round(task.vehicle.mileage).toLocaleString()} / {Math.round(task.dueMileage).toLocaleString()} km</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#071426]"><div className={cn('h-full rounded-full', task.status === 'overdue' ? 'bg-danger' : task.status === 'due_soon' ? 'bg-warning' : 'bg-primary')} style={{ width: `${Math.min(100, task.vehicle.mileage / task.dueMileage * 100)}%` }} /></div></div>}
      {canMutate && <div className="mt-4 flex gap-2"><Button size="sm" variant="outline" onClick={() => onEdit(task)} disabled={busy || task.status === 'completed'}><Pencil className="h-3.5 w-3.5" />Edit</Button>{task.status !== 'completed' && <Button size="sm" onClick={() => onComplete(task)} disabled={busy}><CheckCircle2 className="h-3.5 w-3.5" />Complete</Button>}<Button size="icon" variant="ghost" className="ml-auto h-8 w-8 text-danger hover:bg-danger/10 hover:text-danger" aria-label="Delete maintenance task" onClick={() => onDelete(task)} disabled={busy}><Trash2 className="h-4 w-4" /></Button></div>}
    </article>
  );
}

export default function Maintenance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { canMutateSharedDemo } = useAuth();
  const [tab, setTab] = useState('overdue');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankForm);
  const maintenanceQuery = useQuery({ queryKey: ['maintenance'], queryFn: ({ signal }) => maintenanceApi.list({ signal }), refetchInterval: 30_000 });
  const vehiclesQuery = useQuery({ queryKey: ['vehicles'], queryFn: ({ signal }) => getVehicles({ signal }) });
  const tasks = Array.isArray(maintenanceQuery.data) ? maintenanceQuery.data : [];
  const vehicles = Array.isArray(vehiclesQuery.data) ? vehiclesQuery.data : [];
  const counts = useMemo(() => Object.fromEntries(tabs.map(({ key }) => [key, tasks.filter((task) => task.status === key).length])), [tasks]);
  const visible = tasks.filter((task) => task.status === tab);
  const refresh = async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ['maintenance'] }), queryClient.invalidateQueries({ queryKey: ['vehicle'] }), queryClient.invalidateQueries({ queryKey: ['vehicles'] })]); };
  const createMutation = useMutation({ mutationFn: () => maintenanceApi.create(form.vehicleId, { type: form.type, dueMileage: form.dueMileage === '' ? undefined : Number(form.dueMileage), dueDate: form.dueDate || undefined }), onSuccess: async () => { await refresh(); setDialogOpen(false); toast({ title: 'Maintenance added', description: 'The task was stored by the backend.' }); } });
  const updateMutation = useMutation({ mutationFn: () => maintenanceApi.update(editing.vehicleId, editing.id, { type: form.type, dueMileage: form.dueMileage === '' ? undefined : Number(form.dueMileage), dueDate: form.dueDate || null }), onSuccess: async () => { await refresh(); setDialogOpen(false); toast({ title: 'Maintenance updated', description: 'The task changes were persisted.' }); } });
  const completeMutation = useMutation({ mutationFn: (task) => maintenanceApi.complete(task.vehicleId, task.id, task.vehicle.mileage), onSuccess: async () => { await refresh(); toast({ title: 'Maintenance completed', description: 'Completion and service mileage were saved.' }); } });
  const deleteMutation = useMutation({ mutationFn: (task) => maintenanceApi.remove(task.vehicleId, task.id), onSuccess: async () => { await refresh(); toast({ title: 'Maintenance deleted', description: 'The task was removed from the backend.' }); } });
  const busy = createMutation.isPending || updateMutation.isPending || completeMutation.isPending || deleteMutation.isPending;
  const error = maintenanceQuery.error || vehiclesQuery.error || createMutation.error || updateMutation.error || completeMutation.error || deleteMutation.error;

  const openCreate = () => { setEditing(null); setForm({ ...blankForm, vehicleId: vehicles[0]?.id || '' }); setDialogOpen(true); };
  const openEdit = (task) => { setEditing(task); setForm({ vehicleId: task.vehicleId, type: task.type, dueMileage: task.dueMileage ?? '', dueDate: task.dueDate || '' }); setDialogOpen(true); };
  const removeTask = (task) => { if (window.confirm(`Delete ${task.type} for ${task.vehicleId}?`)) deleteMutation.mutate(task); };
  const submit = (event) => { event.preventDefault(); if (editing) updateMutation.mutate(); else createMutation.mutate(); };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-heading text-xl font-bold">Maintenance</h1><p className="text-xs text-muted-foreground">Mileage and date rules · no machine-learning claim</p></div>{canMutateSharedDemo && <Button size="sm" onClick={openCreate} disabled={!vehicles.length}><Plus className="h-4 w-4" />Add maintenance</Button>}</div>
      <div className="flex gap-1 overflow-x-auto rounded-md bg-[#071426] p-1">{tabs.map(({ key, label }) => <button key={key} type="button" onClick={() => setTab(key)} className={cn('whitespace-nowrap rounded px-3 py-1.5 text-xs font-medium', tab === key ? 'bg-[#133156] text-white' : 'text-[#8298b2] hover:text-white')}>{label} ({counts[key] || 0})</button>)}</div>
      {error && !maintenanceQuery.isPending && <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/5 p-3 text-xs text-danger"><AlertCircle className="h-4 w-4" />{error.message}</div>}
      {maintenanceQuery.isPending ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-64 rounded-lg" />)}</div> : visible.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{visible.map((task) => <TaskCard key={task.id} task={task} onEdit={openEdit} onComplete={(item) => completeMutation.mutate(item)} onDelete={removeTask} busy={busy} canMutate={canMutateSharedDemo} />)}</div> : <div className="rounded-lg border border-border bg-card p-12 text-center"><Wrench className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-2 text-sm text-muted-foreground">No {tabs.find((item) => item.key === tab)?.label.toLowerCase()} records.</p></div>}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent className="border-[#1b3551] bg-[#091a2e]"><DialogHeader><DialogTitle>{editing ? 'Update maintenance' : 'Add maintenance'}</DialogTitle></DialogHeader><form className="space-y-3" onSubmit={submit}><label className="block space-y-1 text-xs text-[#8298b2]"><span>Vehicle</span><select required disabled={Boolean(editing)} value={form.vehicleId} onChange={(event) => setForm((current) => ({ ...current, vehicleId: event.target.value }))} className={inputClass}><option value="">Select a vehicle</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.id} · {vehicle.plate} · {vehicle.make} {vehicle.model}</option>)}</select></label><label className="block space-y-1 text-xs text-[#8298b2]"><span>Maintenance type</span><input required value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} className={inputClass} placeholder="Oil and filter service" /></label><div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-xs text-[#8298b2]"><span>Due mileage</span><input type="number" min="0" value={form.dueMileage} onChange={(event) => setForm((current) => ({ ...current, dueMileage: event.target.value }))} className={inputClass} /></label><label className="space-y-1 text-xs text-[#8298b2]"><span>Due date</span><input type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} className={inputClass} /></label></div><p className="text-[11px] text-[#60748d]">Status is calculated from persisted mileage and due thresholds. It is deterministic rule-based logic.</p><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={busy}>{editing ? 'Save changes' : 'Add task'}</Button></div></form></DialogContent></Dialog>
    </div>
  );
}
