'use client'

import { inr, transactions, type Transaction } from '@/lib/data'
import { ActionBadge, StatusBadge } from './badges'
import { ChevronRight, ListFilter } from 'lucide-react'

export function TransactionsTable({
  payments,
  onSelect,
}: {
  payments: any[]
  onSelect: (tx: Transaction) => void
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">
            Failed Transactions
          </h2>
          <p className="text-xs text-muted-foreground">
            Diagnosed and actioned by the recovery agent
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ListFilter className="size-3.5" aria-hidden="true" />
          Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {[
                'Customer',
                'Amount',
                'Failure reason',
                'AI diagnosis',
                'Action',
                'Status',
                '',
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((tx) => (
              <tr
                key={tx.id}
                tabIndex={0}
                onClick={() => onSelect(tx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(tx)
                  }
                }}
                className="group cursor-pointer border-b border-border/60 outline-none transition-colors last:border-0 hover:bg-accent/40 focus-visible:bg-accent/40"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                      {tx.customer_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </span>
                    <div className="min-w-0 leading-tight">
                      <p className="truncate font-medium text-foreground">
                        {tx.customer_name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {tx.customer_email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono font-medium tabular-nums text-foreground">
                  {inr(tx.amount)}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {tx.failure_reason}
                </td>
                <td className="max-w-[240px] px-5 py-3.5 text-muted-foreground">
                  <span className="line-clamp-2">{tx.aiDiagnosis}</span>
                </td>
                <td className="px-5 py-3.5">
                  <ActionBadge action={tx.action} />
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <ChevronRight
                    className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                    aria-hidden="true"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
