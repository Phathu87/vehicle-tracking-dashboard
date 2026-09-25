import { ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthPanel from '@/components/authentication/AuthPanel';

export default function ResetPassword() {
  return (
    <AuthPanel
      icon={Lock}
      title="Password reset unavailable"
      subtitle="This workflow is outside the current Demo API"
      footer={<Link to="/login" className="text-primary font-medium hover:underline"><ArrowLeft className="w-3 h-3 inline mr-1" />Back to sign in</Link>}
    >
      <p className="text-sm text-center text-muted-foreground">
        The Demo does not claim a password-reset service until the backend supports it.
      </p>
    </AuthPanel>
  );
}
