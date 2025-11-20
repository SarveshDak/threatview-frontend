import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function IocsTable({ iocs }) {

  // Prevent any crash by forcing correct format
  const safeIocs = Array.isArray(iocs) ? iocs : [];

  const getThreatLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'bg-critical text-critical-foreground';
      case 'high':
        return 'bg-warning text-warning-foreground';
      case 'medium':
        return 'bg-primary/20 text-primary';
      case 'low':
        return 'bg-success/20 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence?.toString().toLowerCase()) {
      case 'high':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground font-semibold">Type</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Value</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Source</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Threat Level</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Confidence</TableHead>
            <TableHead className="text-muted-foreground font-semibold">First Seen</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {safeIocs.map((ioc) => (
            <TableRow
              key={`${ioc._id || ioc.value}`}
              className="border-border hover:bg-accent/50 transition-colors"
            >
              <TableCell>
                <Badge variant="outline" className="uppercase">
                  {ioc.type}
                </Badge>
              </TableCell>

              <TableCell className="font-mono text-sm break-all">
                {ioc.value}
              </TableCell>

              <TableCell className="text-muted-foreground">
                {ioc.source}
              </TableCell>

              <TableCell>
                <Badge
                  className={cn('capitalize', getThreatLevelColor(ioc.severity))}
                >
                  {ioc.severity}
                </Badge>
              </TableCell>

              <TableCell>
                <span
                  className={cn(
                    'capitalize font-medium',
                    getConfidenceColor(ioc.confidence)
                  )}
                >
                  {ioc.confidence}
                </span>
              </TableCell>

              <TableCell className="text-muted-foreground">
                {ioc.dateDetected
                  ? new Date(ioc.dateDetected).toLocaleString()
                  : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
