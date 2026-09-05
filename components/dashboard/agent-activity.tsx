import { inr } from '@/lib/data'
import { ActionBadge } from './badges'
import { Bot } from 'lucide-react'

export function AgentActivity({
  payments,
  decisions,
}: {
  payments: any[]
  decisions: any[]
}) {
  const realAgentEvents = (decisions ?? []).map((decision) => {
  const payment = (payments ?? []).find(
  (payment) => payment.id === decision.payment_id
)
  return {
    id: decision.id,
    action: decision.final_action || decision.action,
    time: new Date(decision.created_at).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    summary: decision.reasoning,
    customer: payment?.customer_name || "Unknown customer",
    amount: Number(payment?.amount || 0),
    confidence: Number(decision.confidence || 0),
  }
})
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2.5 border-b border-border p-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <Bot className="size-4" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-tight">
            AI Agent Activity
          </h2>
          <p className="text-xs text-muted-foreground">
            Recent autonomous decisions
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          Live
        </span>
      </div>

      <ol className="relative flex-1 space-y-5 overflow-y-auto p-5">
        <span
          className="absolute left-[26px] top-6 bottom-6 w-px bg-border"
          aria-hidden="true"
        />
        {realAgentEvents.map((event) => (
          <li key={event.id} className="relative flex gap-3.5">
            <span className="z-10 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-card bg-primary/70 ring-1 ring-border" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <ActionBadge action={event.action} />
                <span className="text-xs text-muted-foreground">
                  {event.time}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                {event.summary}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground/90">
                  {event.customer}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {inr(event.amount)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{Math.round(event.confidence * 100)}% conf.</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
