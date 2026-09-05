export type RecoveryAction =
  | 'RETRY'
  | 'SEND_REMINDER'
  | 'WAIT'
  | 'STOP'
  | 'ESCALATE'

export type TxStatus =
  | 'recovered'
  | 'in_progress'
  | 'scheduled'
  | 'failed'
  | 'escalated'

export type TimelineState = 'done' | 'active' | 'pending'

export interface TimelineStep {
  label: string
  detail: string
  timestamp: string
  state: TimelineState
}

export interface PolicyCheck {
  label: string
  passed: boolean
}

export interface Transaction {
  id: string
  customer: string
  email: string
  amount: number
  failureReason: string
  aiDiagnosis: string
  action: RecoveryAction
  status: TxStatus
  attempts: number
  confidence: number
  reasoning: string
  policyChecks: PolicyCheck[]
  timeline: TimelineStep[]
  card: string
  gateway: string
  createdAt: string
  policyReason?: string

  // Real backend payment fields
customer_name?: string
customer_email?: string
payment_method?: string
attempt_count?: number
failure_reason?: string
created_at?: string
}

export interface AgentEvent {
  id: string
  action: RecoveryAction
  customer: string
  amount: number
  summary: string
  confidence: number
  time: string
}

export const inr = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

export const stats = [
  {
    key: 'at-risk',
    label: 'Revenue At Risk',
    value: 462450,
    delta: -8.2,
    trend: 'down' as const,
    tone: 'warning' as const,
    caption: 'across 312 failed charges',
  },
  {
    key: 'recovered',
    label: 'Revenue Recovered',
    value: 182320,
    delta: 12.6,
    trend: 'up' as const,
    tone: 'success' as const,
    caption: 'this billing cycle',
  },
  {
    key: 'rate',
    label: 'Recovery Rate',
    value: 39.4,
    isPercent: true,
    delta: 4.1,
    trend: 'up' as const,
    tone: 'info' as const,
    caption: 'vs 22.9% baseline',
  },
  {
    key: 'active',
    label: 'Active Recoveries',
    value: 127,
    isCount: true,
    delta: 5.0,
    trend: 'up' as const,
    tone: 'neutral' as const,
    caption: 'agent working now',
  },
]

export const recoveryTrend = [
  { day: 'Mon', baseline: 14200, ai: 21800 },
  { day: 'Tue', baseline: 16800, ai: 26400 },
  { day: 'Wed', baseline: 15100, ai: 29900 },
  { day: 'Thu', baseline: 18900, ai: 34200 },
  { day: 'Fri', baseline: 17400, ai: 38600 },
  { day: 'Sat', baseline: 19800, ai: 42100 },
  { day: 'Sun', baseline: 21200, ai: 47300 },
]

export const agentEvents: AgentEvent[] = [
  {
    id: 'ae-1',
    action: 'RETRY',
    customer: 'Meera Nair',
    amount: 2499,
    summary:
      'Detected transient issuer decline. Scheduled smart retry during payday window.',
    confidence: 0.94,
    time: '2 min ago',
  },
  {
    id: 'ae-2',
    action: 'SEND_REMINDER',
    customer: 'Aditya Rao',
    amount: 5999,
    summary:
      'Card expired. Sent branded update-card email with one-tap recovery link.',
    confidence: 0.88,
    time: '9 min ago',
  },
  {
    id: 'ae-3',
    action: 'ESCALATE',
    customer: 'Kabir Sethi',
    amount: 24999,
    summary:
      'High-value account, repeated fraud block. Routed to human success manager.',
    confidence: 0.71,
    time: '17 min ago',
  },
  {
    id: 'ae-4',
    action: 'WAIT',
    customer: 'Sanya Iyer',
    amount: 1299,
    summary:
      'Insufficient funds. Holding 36h per policy before next low-friction attempt.',
    confidence: 0.82,
    time: '31 min ago',
  },
  {
    id: 'ae-5',
    action: 'STOP',
    customer: 'Rohan Verma',
    amount: 899,
    summary:
      'Customer requested cancellation. Halted recovery and flagged for churn review.',
    confidence: 0.97,
    time: '48 min ago',
  },
]

export const transactions: Transaction[] = [
  {
    id: 'txn_8fa21c',
    customer: 'Meera Nair',
    email: 'meera.nair@brightloom.in',
    amount: 2499,
    failureReason: 'Issuer declined (do not honor)',
    aiDiagnosis: 'Transient bank-side decline, high retry success probability',
    action: 'RETRY',
    status: 'in_progress',
    attempts: 2,
    confidence: 0.94,
    reasoning:
      'Historical data shows this issuer clears 91% of "do not honor" declines within 24h. Customer has a 14-month tenure with zero prior chargebacks. Retrying inside the detected payday window (28th) maximizes recovery odds without adding friction.',
    policyChecks: [
      { label: 'Within max retry limit (2 of 4)', passed: true },
      { label: 'Retry cadence respects 6h cooldown', passed: true },
      { label: 'Customer not on suppression list', passed: true },
      { label: 'Amount under auto-approval cap', passed: true },
    ],
    timeline: [
      {
        label: 'Payment failed',
        detail: 'HDFC issuer returned code 05',
        timestamp: 'Today, 08:12',
        state: 'done',
      },
      {
        label: 'AI diagnosis',
        detail: 'Classified as transient decline',
        timestamp: 'Today, 08:12',
        state: 'done',
      },
      {
        label: 'Smart retry scheduled',
        detail: 'Queued for payday window',
        timestamp: 'Today, 08:13',
        state: 'active',
      },
      {
        label: 'Recovery confirmation',
        detail: 'Awaiting settlement',
        timestamp: 'Pending',
        state: 'pending',
      },
    ],
    card: 'HDFC •••• 4821',
    gateway: 'Razorpay',
    createdAt: 'Today, 08:12',
  },
  {
    id: 'txn_5db77e',
    customer: 'Aditya Rao',
    email: 'aditya@rao.studio',
    amount: 5999,
    failureReason: 'Expired card',
    aiDiagnosis: 'Card expiry — requires customer update, no retry value',
    action: 'SEND_REMINDER',
    status: 'scheduled',
    attempts: 1,
    confidence: 0.88,
    reasoning:
      'A blind retry on an expired card will always fail and risks a hard decline flag. The agent instead triggered a branded update-card email with a one-tap secure link. Open-rate model predicts 63% recovery within 72 hours for this segment.',
    policyChecks: [
      { label: 'Reminder frequency within cap (1 of 3)', passed: true },
      { label: 'Email domain verified', passed: true },
      { label: 'No active support ticket', passed: true },
      { label: 'Consent to transactional email', passed: true },
    ],
    timeline: [
      {
        label: 'Payment failed',
        detail: 'Card expired 07/25',
        timestamp: 'Today, 07:40',
        state: 'done',
      },
      {
        label: 'AI diagnosis',
        detail: 'Update required, retry suppressed',
        timestamp: 'Today, 07:40',
        state: 'done',
      },
      {
        label: 'Reminder sent',
        detail: 'Update-card email delivered',
        timestamp: 'Today, 07:41',
        state: 'active',
      },
      {
        label: 'Card updated',
        detail: 'Awaiting customer action',
        timestamp: 'Pending',
        state: 'pending',
      },
    ],
    card: 'ICICI •••• 2093',
    gateway: 'Stripe',
    createdAt: 'Today, 07:40',
  },
  {
    id: 'txn_1c9a04',
    customer: 'Kabir Sethi',
    email: 'kabir.sethi@northgate.co',
    amount: 24999,
    failureReason: 'Fraud block (risk rule)',
    aiDiagnosis: 'High-value repeat block — human judgment recommended',
    action: 'ESCALATE',
    status: 'escalated',
    attempts: 3,
    confidence: 0.71,
    reasoning:
      'Three consecutive risk-engine blocks on a high-value enterprise seat exceed the autonomous confidence threshold. Auto-retrying could damage the relationship or trip a permanent block. Escalated to a human success manager with full context and a suggested manual verification path.',
    policyChecks: [
      { label: 'Amount over auto-approval cap', passed: false },
      { label: 'Retry attempts exhausted (3 of 3)', passed: false },
      { label: 'Account flagged high-value', passed: true },
      { label: 'Escalation route available', passed: true },
    ],
    timeline: [
      {
        label: 'Payment failed',
        detail: 'Risk rule R-217 triggered',
        timestamp: 'Today, 06:55',
        state: 'done',
      },
      {
        label: 'AI diagnosis',
        detail: 'Confidence below threshold',
        timestamp: 'Today, 06:55',
        state: 'done',
      },
      {
        label: 'Escalated to human',
        detail: 'Assigned to P. Menon',
        timestamp: 'Today, 06:56',
        state: 'active',
      },
      {
        label: 'Manual resolution',
        detail: 'In review',
        timestamp: 'Pending',
        state: 'pending',
      },
    ],
    card: 'Amex •••• 1007',
    gateway: 'Razorpay',
    createdAt: 'Today, 06:55',
  },
  {
    id: 'txn_77be12',
    customer: 'Sanya Iyer',
    email: 'sanya.iyer@fernwood.in',
    amount: 1299,
    failureReason: 'Insufficient funds',
    aiDiagnosis: 'Low balance — delay retry to funded window',
    action: 'WAIT',
    status: 'scheduled',
    attempts: 1,
    confidence: 0.82,
    reasoning:
      'Insufficient-funds declines recover best when retried after a salary credit. The agent is holding for 36 hours to align with this customer\u2019s historical funding pattern rather than burning a retry immediately.',
    policyChecks: [
      { label: 'Retry within limit (1 of 4)', passed: true },
      { label: 'Wait window under policy max (36h)', passed: true },
      { label: 'No dunning fatigue detected', passed: true },
      { label: 'Amount under auto-approval cap', passed: true },
    ],
    timeline: [
      {
        label: 'Payment failed',
        detail: 'Insufficient balance',
        timestamp: 'Today, 05:20',
        state: 'done',
      },
      {
        label: 'AI diagnosis',
        detail: 'Timing-sensitive decline',
        timestamp: 'Today, 05:20',
        state: 'done',
      },
      {
        label: 'Retry deferred',
        detail: 'Holding for funded window',
        timestamp: 'Today, 05:21',
        state: 'active',
      },
      {
        label: 'Scheduled retry',
        detail: 'Tomorrow, 17:00',
        timestamp: 'Pending',
        state: 'pending',
      },
    ],
    card: 'SBI •••• 6642',
    gateway: 'Cashfree',
    createdAt: 'Today, 05:20',
  },
  {
    id: 'txn_44ef90',
    customer: 'Rohan Verma',
    email: 'rohan.verma@meadowlark.in',
    amount: 899,
    failureReason: 'Customer requested cancellation',
    aiDiagnosis: 'Intentional churn — halt recovery to protect brand',
    action: 'STOP',
    status: 'failed',
    attempts: 1,
    confidence: 0.97,
    reasoning:
      'The customer submitted a cancellation request 20 minutes before this charge failed. Continuing recovery would be non-compliant and harm brand trust. The agent halted all attempts and flagged the account for the churn analytics pipeline.',
    policyChecks: [
      { label: 'Active cancellation request honored', passed: true },
      { label: 'No further retries permitted', passed: true },
      { label: 'Suppression list updated', passed: true },
      { label: 'Churn review flag set', passed: true },
    ],
    timeline: [
      {
        label: 'Cancellation received',
        detail: 'Self-serve portal',
        timestamp: 'Today, 04:02',
        state: 'done',
      },
      {
        label: 'Payment failed',
        detail: 'Subscription charge',
        timestamp: 'Today, 04:22',
        state: 'done',
      },
      {
        label: 'Recovery halted',
        detail: 'Compliance stop',
        timestamp: 'Today, 04:22',
        state: 'done',
      },
      {
        label: 'Flagged for churn review',
        detail: 'Sent to analytics',
        timestamp: 'Today, 04:23',
        state: 'done',
      },
    ],
    card: 'Axis •••• 3388',
    gateway: 'Stripe',
    createdAt: 'Today, 04:02',
  },
  {
    id: 'txn_9a02fd',
    customer: 'Priya Kulkarni',
    email: 'priya.k@lumina.co.in',
    amount: 3499,
    failureReason: 'Network timeout',
    aiDiagnosis: 'Gateway timeout — safe immediate retry',
    action: 'RETRY',
    status: 'recovered',
    attempts: 1,
    confidence: 0.96,
    reasoning:
      'A gateway-side timeout left the charge in an indeterminate state. Idempotency-keyed retry confirmed no double-charge and settled successfully on the first attempt within 40 seconds.',
    policyChecks: [
      { label: 'Idempotency key enforced', passed: true },
      { label: 'Retry within limit (1 of 4)', passed: true },
      { label: 'No duplicate settlement', passed: true },
      { label: 'Amount under auto-approval cap', passed: true },
    ],
    timeline: [
      {
        label: 'Payment failed',
        detail: 'Gateway timeout',
        timestamp: 'Today, 03:11',
        state: 'done',
      },
      {
        label: 'AI diagnosis',
        detail: 'Safe to retry',
        timestamp: 'Today, 03:11',
        state: 'done',
      },
      {
        label: 'Retry executed',
        detail: 'Idempotent charge',
        timestamp: 'Today, 03:12',
        state: 'done',
      },
      {
        label: 'Recovered',
        detail: 'Settled successfully',
        timestamp: 'Today, 03:12',
        state: 'done',
      },
    ],
    card: 'Kotak •••• 5510',
    gateway: 'Razorpay',
    createdAt: 'Today, 03:11',
  },
]
