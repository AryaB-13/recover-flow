'use client'

import { useEffect, useState } from "react"
import type { Transaction } from '@/lib/data'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { StatCards } from '@/components/dashboard/stat-cards'
import { RecoveryChart } from '@/components/dashboard/recovery-chart'
import { AgentActivity } from '@/components/dashboard/agent-activity'
import { TransactionsTable } from '@/components/dashboard/transactions-table'
import { RecoveryDrawer } from '@/components/dashboard/recovery-drawer'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function Page() {
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [decisions, setDecisions] = useState<any[]>([])
  const [executions, setExecutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_URL}/payments`)
      const data = await response.json()

      setPayments(data.payments)
      console.log("REAL PAYMENTS:", data.payments)
    } catch (error) {
      console.error("Failed to fetch payments:", error)
      throw error
    }
  }
  const fetchDecisions = async () => {
  try {
    const response = await fetch(`${API_URL}/decisions`)
    const data = await response.json()

    setDecisions(data.decisions)
    console.log("REAL DECISIONS:", data.decisions)
  } catch (error) {
    console.error("Failed to fetch decisions:", error)
    throw error
  }
}
const fetchExecutions = async () => {
  try {
    const response = await fetch(`${API_URL}/executions`)
    const data = await response.json()

    setExecutions(data.executions)
    console.log("REAL EXECUTIONS:", data.executions)
  } catch (error) {
    console.error("Failed to fetch executions:", error)
    throw error
  }
}

  const fetchDashboardData = async () => {
  try {
    setLoading(true)
    setError(null)

    await Promise.all([
      fetchPayments(),
      fetchDecisions(),
      fetchExecutions(),
    ])
  } catch (error) {
    console.error("Dashboard loading failed:", error)
    setError("Unable to connect to the RecoverFlow API.")
  } finally {
    setLoading(false)
  }
}
fetchDashboardData()
}, [])

const enrichedPayments = (payments ?? []).map((payment) => {
  const decision = (decisions ?? []).find(
    (decision) => decision.payment_id === payment.id
  )

  const execution = (executions ?? []).find(
    (execution) => execution.payment_id === payment.id
  )
const timeline = [
  {
    label: "Payment failed",
    detail: payment.failure_reason || "Payment failure detected",
    timestamp: payment.created_at
      ? new Date(payment.created_at).toLocaleString("en-IN")
      : "",
    state: "done",
  },
]

if (decision) {
  timeline.push({
    label: "AI diagnosis generated",
    detail: decision.reasoning || "Recovery decision generated",
    timestamp: decision.created_at
      ? new Date(decision.created_at).toLocaleString("en-IN")
      : "",
    state: "done",
  })

  timeline.push({
    label: `${decision.final_action || decision.action} selected`,
    detail: "Recovery action selected by the AI and policy engine.",
    timestamp: decision.created_at
      ? new Date(decision.created_at).toLocaleString("en-IN")
      : "",
    state: "done",
  })
}
if (execution) {
  timeline.push({
    label:
      execution.status === "recovered"
        ? "Payment recovered"
        : "Recovery scheduled",
    detail:
      execution.message || "Recovery execution created.",
    timestamp: execution.created_at
      ? new Date(execution.created_at).toLocaleString("en-IN")
      : "",
    state: execution.status === "recovered" ? "done" : "active",
  })
}
  return {
  ...payment,
  action: decision?.final_action || decision?.action || "STOP",
  aiDiagnosis: decision?.reasoning || "No AI decision available",
  reasoning: decision?.reasoning || "No AI reasoning available",
  confidence: Number(decision?.confidence ?? 0),
  policyReason: decision?.policy_reason || "",
  status: execution?.status || "failed",
  timeline,
}
})

if (loading) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">
          Loading RecoverFlow...
        </p>
      </div>
    </main>
  )
}
if (error) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-md text-center">
        <h2 className="text-lg font-semibold text-foreground">
          RecoverFlow API unavailable
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </main>
  )
}

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 space-y-6 p-4 md:p-6">
          <StatCards
            payments={payments}
            executions={executions}
            />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RecoveryChart
                payments={payments}
                executions={executions}
              />
            </div>
            <div className="xl:col-span-1">
              <AgentActivity
                payments={payments}
                decisions={decisions}
              />
            </div>
          </div>

          <TransactionsTable
    payments={enrichedPayments}
    onSelect={setSelected}
/>
        </main>
      </div>

      <RecoveryDrawer tx={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
