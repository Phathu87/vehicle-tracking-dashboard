import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { driverInitials, resolveDriverPortrait } from '@/lib/driverPortraits';
import { cn } from '@/lib/utils';

export default function DriverAvatar({ driver, className }) {
  const portrait = resolveDriverPortrait(driver?.id);
  return (
    <Avatar aria-hidden="true" className={cn('h-10 w-10', className)}>
      {portrait && <AvatarImage src={portrait} alt="" className="object-cover" />}
      <AvatarFallback className="bg-primary text-sm font-semibold text-white">
        {driverInitials(driver?.name)}
      </AvatarFallback>
    </Avatar>
  );
}
