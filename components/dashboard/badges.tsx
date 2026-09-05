import { cn } from '@/lib/utils'
import type { RecoveryAction, TxStatus } from '@/lib/data'
import {
  RotateCw,
  Bell,
  Clock,
  Ban,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'

const actionMap: Record<
  RecoveryAction,
  { className: string; icon: LucideIcon }
> = {
  RETRY: {
    className: 'bg-info/12 text-info border-info/25',
    icon: RotateCw,
  },
  'SEND_REMINDER': {
    className: 'bg-primary/12 text-primary border-primary/25',
    icon: Bell,
  },
  WAIT: {
    className: 'bg-warning/12 text-warning border-warning/25',
    icon: Clock,
  },
  STOP: {
    className: 'bg-muted text-muted-foreground border-border',
    icon: Ban,
  },
  ESCALATE: {
    className: 'bg-destructive/12 text-destructive border-destructive/25',
    icon: ArrowUpRight,
  },
}

export function ActionBadge({
  action,
  className,
}: {
  action: RecoveryAction
  className?: string
}) {
  const { className: tone, icon: Icon } = actionMap[action]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide',
        tone,
        className,
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {action}
    </span>
  )
}

const statusMap: Record<TxStatus, { label: string; className: string }> = {
  recovered: {
    label: 'Recovered',
    className: 'bg-success/12 text-success border-success/25',
  },
  in_progress: {
    label: 'In progress',
    className: 'bg-info/12 text-info border-info/25',
  },
  scheduled: {
    label: 'Scheduled',
    className: 'bg-warning/12 text-warning border-warning/25',
  },
  escalated: {
    label: 'Escalated',
    className: 'bg-destructive/12 text-destructive border-destructive/25',
  },
  failed: {
    label: 'Stopped',
    className: 'bg-muted text-muted-foreground border-border',
  },
}

export function StatusBadge({
  status,
  className,
}: {
  status: TxStatus
  className?: string
}) {
  const { label, className: tone } = statusMap[status]
  const isLive = status === 'in_progress'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        tone,
        className,
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full bg-current',
          isLive && 'animate-pulse',
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}
