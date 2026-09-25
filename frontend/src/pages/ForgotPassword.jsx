import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthPanel from '@/components/authentication/AuthPanel';

export default function ForgotPassword() {
  return (
    <AuthPanel
      icon={Mail}
      title="Password recovery"
      subtitle="Recovery is not available in the current Demo API"
      footer={<Link to="/login" className="text-primary font-medium hover:underline"><ArrowLeft className="w-3 h-3 inline mr-1" />Back to sign in</Link>}
    >
      <p className="text-sm text-center text-muted-foreground">
        No password-reset endpoint is defined in the authoritative API contract.
      </p>
    </AuthPanel>
  );
}
