import { cn } from '@/lib/utils'
import { inr } from '@/lib/data'
import { TrendingUp, TrendingDown } from 'lucide-react'

const toneRing: Record<string, string> = {
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-info',
  neutral: 'text-foreground',
}

function formatValue(s: {
  value: number
  isPercent?: boolean
  isCount?: boolean
}) {
  if (s.isPercent) return `${s.value.toFixed(1)}%`
  if (s.isCount) return s.value.toLocaleString("en-IN")
  return inr(s.value)
}

export function StatCards({
  payments = [],
  executions = [],
}: {
  payments?: any[]
  executions?: any[]
}) {
  const revenueAtRisk = payments
  .filter((payment) => payment.status === "failed")
  .reduce((total, payment) => total + Number(payment.amount), 0)

const activeRecoveries = executions.filter(
  (execution) => execution.status === "scheduled"
).length

const recoveredExecutions = executions.filter(
  (execution) => execution.status === "recovered"
)

const revenueRecovered = recoveredExecutions.reduce((total, execution) => {
  const payment = payments.find(
    (payment) => payment.id === execution.payment_id
  )

  return total + (payment ? Number(payment.amount) : 0)
}, 0)

const recoveryRate =
  payments.length > 0
    ? (recoveredExecutions.length / payments.length) * 100
    : 0
    const realStats = [
  {
    key: "risk",
    label: "Revenue at Risk",
    value: revenueAtRisk,
    delta: 0,
    trend: "down",
    caption: `across ${payments.length} failed charges`,
    tone: "warning",
  },
  {
    key: "recovered",
    label: "Revenue Recovered",
    value: revenueRecovered,
    delta: 0,
    trend: "up",
    caption: "from successful recoveries",
    tone: "success",
  },
  {
    key: "rate",
    label: "Recovery Rate",
    value: recoveryRate,
    delta: 0,
    trend: "up",
    caption: "of failed payments recovered",
    tone: "info",
    isPercent: true,
  },
  {
    key: "active",
    label: "Active Recoveries",
    value: activeRecoveries,
    delta: 0,
    trend: "up",
    caption: "recovery actions scheduled",
    tone: "neutral",
    isCount: true,
  },
]
  return (
    <section
      aria-label="Recovery summary"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {realStats.map((s) => {
        const positive = s.trend === 'up'
        return (
          <div
            key={s.key}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium',
                  positive
                    ? 'bg-success/12 text-success'
                    : 'bg-warning/12 text-warning',
                )}
              >
                {positive ? (
                  <TrendingUp className="size-3" aria-hidden="true" />
                ) : (
                  <TrendingDown className="size-3" aria-hidden="true" />
                )}
                {Math.abs(s.delta)}%
              </span>
            </div>

            <p
              className={cn(
                'mt-3 font-mono text-3xl font-semibold tracking-tight tabular-nums',
                toneRing[s.tone],
              )}
            >
              {formatValue(s)}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">{s.caption}</p>

            <div
              className={cn(
                'absolute inset-x-0 bottom-0 h-0.5 opacity-70',
                s.tone === 'success' && 'bg-success',
                s.tone === 'warning' && 'bg-warning',
                s.tone === 'info' && 'bg-info',
                s.tone === 'neutral' && 'bg-border',
              )}
              aria-hidden="true"
            />
          </div>
        )
      })}
    </section>
  )
}
