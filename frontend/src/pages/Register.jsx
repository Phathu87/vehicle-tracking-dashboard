import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, Mail, Truck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const inputClass = 'w-full h-12 pl-10 pr-3 rounded-lg bg-secondary border border-input text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', username: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = form.username.trim();
    if (!form.name.trim() || username.length < 3 || !/^[a-zA-Z0-9._@+-]+$/.test(username)) {
      setError('Complete all required fields.');
      return;
    }
    if (form.password.length < 8 || form.password.length > 128) {
      setError('Password must be between 8 and 128 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register({ name: form.name.trim(), username, password: form.password });
      navigate('/app/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 lg:p-8">
      <Link to="/" className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center"><Truck className="w-5 h-5 text-primary" /></div>
        <span className="font-heading font-bold">Fleet Drive AI Demo</span>
      </Link>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-lg border border-border bg-card p-6 lg:p-8">
        <h1 className="font-heading text-2xl font-bold">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Register with the Fleet Drive Demo API</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">{error}</div>}
          <div>
            <label htmlFor="name" className="text-sm font-medium mb-1.5 block">Full name</label>
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" /><input id="name" autoComplete="name" required value={form.name} onChange={(event) => setField('name', event.target.value)} className={inputClass} /></div>
          </div>
          <div>
            <label htmlFor="register-username" className="text-sm font-medium mb-1.5 block">Username</label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" /><input id="register-username" autoComplete="username" minLength={3} maxLength={64} required value={form.username} onChange={(event) => setField('username', event.target.value)} className={inputClass} /></div>
          </div>
          <div>
            <label htmlFor="register-password" className="text-sm font-medium mb-1.5 block">Password</label>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" /><input id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} maxLength={128} required value={form.password} onChange={(event) => setField('password', event.target.value)} className={`${inputClass} pr-10`} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="text-sm font-medium mb-1.5 block">Confirm password</label>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" /><input id="confirm-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} maxLength={128} required value={form.confirm} onChange={(event) => setField('confirm', event.target.value)} className={inputClass} /></div>
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 text-[15px]">{loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account</> : 'Create account'}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">Already registered? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></p>
      </motion.div>
    </div>
  );
}
