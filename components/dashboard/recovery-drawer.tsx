'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { inr, type Transaction } from '@/lib/data'
import { ActionBadge, StatusBadge } from './badges'
import {
  X,
  CreditCard,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Check,
  Circle,
  CircleDot,
} from 'lucide-react'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

function ConfidenceMeter({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const tone =
    pct >= 90 ? 'text-success' : pct >= 75 ? 'text-info' : 'text-warning'
  const bar =
    pct >= 90 ? 'bg-success' : pct >= 75 ? 'bg-info' : 'bg-warning'
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Confidence score</span>
        <span className={cn('font-mono text-2xl font-semibold', tone)}>
          {pct}%
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-all', bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function RecoveryDrawer({
  tx,
  onClose,
}: {
  tx: Transaction | null
  onClose: () => void
}) {
  const open = tx !== null

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Recovery detail"
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out sm:max-w-lg',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {tx && (
          <>
            <header className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs text-muted-foreground">
                    {tx.id}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
                <h2 className="mt-1.5 truncate text-lg font-semibold tracking-tight">
                  {tx.customer}
                </h2>
                <p className="truncate text-sm text-muted-foreground">
                  {tx.email}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              {/* Payment information */}
              <section>
                <SectionTitle icon={CreditCard} label="Payment information" />
                <div className="mt-2 rounded-lg border border-border bg-background/40 px-4 py-2">
                  <Row label="Amount" value={inr(tx.amount)} />
                  <Row label="Payment method" value={tx.payment_method || "N/A"} />
                  <Row label="Gateway" value="Simulated Provider" />
                  <Row label="Attempts" value={`${tx.attempt_count ?? 0}`} />
                  <Row
                    label="First failed"
                      value={
                        tx.created_at
                          ? new Date(tx.created_at).toLocaleString("en-IN")
                          : "N/A"
                      }
                    />
                </div>
              </section>

              {/* Failure reason */}
              <section>
                <SectionTitle icon={AlertTriangle} label="Failure reason" />
                <div className="mt-2 rounded-lg border border-destructive/25 bg-destructive/8 px-4 py-3">
                  <p className="text-sm font-medium text-destructive">
                    {tx.failureReason}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tx.aiDiagnosis}
                  </p>
                </div>
              </section>

              {/* AI reasoning */}
              <section>
                <SectionTitle icon={Sparkles} label="AI reasoning" />
                <div className="mt-2 rounded-lg border border-primary/20 bg-primary/[0.06] px-4 py-3">
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {tx.reasoning}
                  </p>
                </div>
              </section>

              {/* Confidence + chosen action */}
              <section className="rounded-lg border border-border bg-background/40 px-4 py-4">
                <ConfidenceMeter value={tx.confidence} />
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm text-muted-foreground">
                    Chosen action
                  </span>
                  <ActionBadge action={tx.action} />
                </div>
              </section>

              {/* Policy validation */}
              <section>
                <SectionTitle icon={ShieldCheck} label="Policy validation" />
                <ul className="mt-2 space-y-1.5">
                  {(!tx.policyChecks || tx.policyChecks.length === 0) && (
                    <div className="rounded-lg border border-border bg-background/40 px-4 py-3">
                    <p className="text-sm text-foreground">
                      {tx.policyReason || "No detailed policy checks available for this recovery."}
                    </p>
                    </div>
                  )}
                  {(tx.policyChecks ?? []).map((check) => (
                    <li
                      key={check.label}
                      className="flex items-center gap-2.5 rounded-lg border border-border bg-background/40 px-3 py-2 text-sm"
                    >
                      {check.passed ? (
                        <span className="flex size-5 items-center justify-center rounded-full bg-success/15 text-success">
                          <Check className="size-3" aria-hidden="true" />
                        </span>
                      ) : (
                        <span className="flex size-5 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                          <ShieldAlert className="size-3" aria-hidden="true" />
                        </span>
                      )}
                      <span
                        className={cn(
                          check.passed
                            ? 'text-foreground/90'
                            : 'text-muted-foreground',
                        )}
                      >
                        {check.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Recovery timeline */}
              <section>
                <SectionTitle icon={CircleDot} label="Recovery timeline" />
                <ol className="relative mt-3 space-y-4 pl-1">
                  <span
                    className="absolute left-[9px] top-1 bottom-1 w-px bg-border"
                    aria-hidden="true"
                  />
                  {(!tx.timeline || tx.timeline.length === 0) && (
                    <li className="text-xs text-muted-foreground">
                      No recovery timeline available.
                    </li>
                  )}
                  {(tx.timeline ?? []).map((step) => (
                    <li key={step.label} className="relative flex gap-3">
                      <span className="z-10 mt-0.5">
                        {step.state === 'done' ? (
                          <span className="flex size-[18px] items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" aria-hidden="true" />
                          </span>
                        ) : step.state === 'active' ? (
                          <CircleDot
                            className="size-[18px] animate-pulse text-primary"
                            aria-hidden="true"
                          />
                        ) : (
                          <Circle
                            className="size-[18px] text-muted-foreground/50"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <div className="min-w-0 flex-1 pb-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              'text-sm font-medium',
                              step.state === 'pending'
                                ? 'text-muted-foreground'
                                : 'text-foreground',
                            )}
                          >
                            {step.label}
                          </p>
                          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

           <footer className="border-t border-border p-4">
  {tx.status === "recovered" ? (
    <div className="flex items-center justify-center rounded-lg border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success">
      ✓ Recovery completed successfully
    </div>
  ) : (
    <div className="flex gap-2">
      <button
        type="button"
        className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors"
      >
        Approve action
      </button>

      <button
        type="button"
        className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground"
      >
        Override
      </button>
    </div>
  )}
</footer>
          </>
        )}
      </aside>
    </div>
  )
}

function SectionTitle({
  icon: Icon,
  label,
}: {
  icon: typeof CreditCard
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      <h3 className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </h3>
    </div>
  )
}
