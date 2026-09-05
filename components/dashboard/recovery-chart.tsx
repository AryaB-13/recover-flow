'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { inr } from "@/lib/data"

const seriesMeta = {
  ai: { label: 'AI Recovery', color: 'var(--chart-1)' },
  baseline: { label: 'Baseline Recovery', color: 'var(--chart-2)' },
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover/95 p-3 shadow-xl backdrop-blur-sm">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => {
          const meta = seriesMeta[entry.dataKey as keyof typeof seriesMeta]
          return (
            <div
              key={entry.dataKey}
              className="flex items-center justify-between gap-6 text-sm"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                {meta.label}
              </span>
              <span className="font-mono font-medium tabular-nums text-foreground">
                {inr(entry.value)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function RecoveryChart({
  payments,
  executions,
}: {
  payments: any[]
  executions: any[]
}) {
  type RecoveryTrendPoint = {
  day: string
  ai: number
  baseline: number
}

const groupedByDay = (payments ?? []).reduce<
  Record<string, RecoveryTrendPoint>
>((acc, payment) => {
  const day = new Date(payment.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  })

  const execution = (executions ?? []).find(
    (execution) => execution.payment_id === payment.id
  )

  if (!acc[day]) {
    acc[day] = {
      day,
      ai: 0,
      baseline: 0,
    }
  }

  acc[day].baseline += Number(payment.amount)

  if (execution?.status === "recovered") {
    acc[day].ai += Number(payment.amount)
  }

  return acc
}, {})

const realRecoveryTrend: RecoveryTrendPoint[] =
  Object.values(groupedByDay)
  const totalAi = realRecoveryTrend.reduce((a, d) => a + d.ai, 0)
const totalBaseline = realRecoveryTrend.reduce(
  (a, d) => a + d.baseline,
  0
)

const recoveredPaymentIds = new Set(
  (executions ?? [])
    .filter((execution) => execution.status === "recovered")
    .map((execution) => execution.payment_id)
)

const recoveryRate =
  (payments ?? []).length > 0
    ? Math.round(
        (recoveredPaymentIds.size / (payments ?? []).length) * 100
      )
    : 0

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">
            Recovery Performance
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            AI agent vs. rule-based baseline · last 7 days
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-mono text-lg font-semibold tabular-nums text-primary">
              {recoveryRate}%
            </p>
            <p className="text-[11px] text-muted-foreground">recovery rate</p>
          </div>
          <div className="flex flex-col gap-1.5">
            {Object.entries(seriesMeta).map(([key, meta]) => (
              <span
                key={key}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span
                  className="h-2 w-3 rounded-sm"
                  style={{ backgroundColor: meta.color }}
                />
                {meta.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 h-64 w-full flex-1 lg:min-h-[16rem]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={realRecoveryTrend}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillAi" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              width={40}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="baseline"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#fillBaseline)"
              strokeDasharray="5 4"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="ai"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#fillAi)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--chart-1)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
