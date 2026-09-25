import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, Mail, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { useAuth } from '@/lib/AuthContext';
import GoogleIcon from '@/components/GoogleIcon';
import MicrosoftIcon from '@/components/MicrosoftIcon';

const BG_IMG = '/assets/fleet-operations.png';
const inputClass = 'w-full h-12 pl-10 pr-3 rounded-lg bg-secondary border border-input text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username.trim().length < 3 || password.length < 8) {
      setError('Enter your username and password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login({ username: username.trim(), password, rememberMe });
      const requestedPath = searchParams.get('returnTo');
      navigate(requestedPath?.startsWith('/app') ? requestedPath : '/app/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src={BG_IMG} alt="Fleet operations at night" className="absolute inset-0 w-full h-full" fittingType="fill" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center"><Truck className="w-5 h-5 text-primary" /></div>
            <span className="font-heading font-bold">Fleet Drive AI Demo</span>
          </Link>
          <div>
            <h2 className="font-heading text-3xl font-bold leading-tight max-w-sm">A clear operational view of your fleet.</h2>
            <p className="mt-3 text-muted-foreground max-w-sm">Explore fleet workflows using simulated data served through the Demo API.</p>
          </div>
          <p className="text-xs text-muted-foreground">Fleet Drive AI Demo</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="lg:hidden flex items-center gap-2 p-6">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center"><Truck className="w-5 h-5 text-primary" /></div>
          <span className="font-heading font-bold">Fleet Drive AI Demo</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to continue</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {error && <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">{error}</div>}
              <div>
                <label htmlFor="username" className="text-sm font-medium mb-1.5 block">Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <input id="username" autoComplete="username" minLength={3} maxLength={64} required value={username} onChange={(event) => setUsername(event.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" minLength={8} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClass} pr-10`} />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="rounded border-input bg-secondary" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 text-[15px]">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in</> : 'Sign in'}
              </Button>
            </form>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OAuth unavailable</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" disabled title="Google OAuth is not available in the Demo" className="h-11 rounded-lg border border-input bg-card flex items-center justify-center gap-2 text-sm text-muted-foreground opacity-60 cursor-not-allowed">
                <GoogleIcon className="w-4 h-4" /> Google
              </button>
              <button type="button" disabled title="Microsoft OAuth is not available in the Demo" className="h-11 rounded-lg border border-input bg-card flex items-center justify-center gap-2 text-sm text-muted-foreground opacity-60 cursor-not-allowed">
                <MicrosoftIcon className="w-4 h-4" /> Microsoft
              </button>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">No account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link></p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
