export default function AuthPanel({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center bg-primary mb-4">
            <Icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        <div className="bg-card shadow-sm border border-border p-6 sm:p-8">
          {children}
        </div>
        {footer && <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>}
      </div>
    </div>
  );
}
