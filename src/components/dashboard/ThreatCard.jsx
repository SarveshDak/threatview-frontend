import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCountAnimation } from "@/hooks/useCountAnimation";

export function ThreatCard({ title, value, icon: Icon, variant = 'default', trend }) {

  const variantStyles = {
    default: 'border-primary/30',
    critical: 'border-critical/50 bg-critical/5',
    warning: 'border-warning/50 bg-warning/5',
    success: 'border-success/50 bg-success/5',
  };

  const iconStyles = {
    default: 'text-primary',
    critical: 'text-critical',
    warning: 'text-warning',
    success: 'text-success',
  };

  // ⭐ SAFETY FIX → If value is undefined, keep old animated value instead of 0
  const safeValue = typeof value === "number" && !isNaN(value) ? value : 0;

  // ⭐ Smooth number animation
  const animatedValue = useCountAnimation(safeValue);

  return (
    <Card
      className={cn(
        'p-6 border bg-card hover:glow-effect transition-all duration-300',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>

          {/* ⭐ Animated number shown cleanly */}
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {animatedValue.toLocaleString()}
          </h3>

          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-critical'
                )}
              >
                {trend.value}
              </span>
              <span className="text-xs text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>

        <div className={cn('p-3 rounded-lg bg-background/50', iconStyles[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
