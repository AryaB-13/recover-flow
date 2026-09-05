'use client'

import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  CreditCard,
  Bot,
  BarChart3,
  ScrollText,
  Waves,
  Settings,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react'

interface NavItem {
  label: string
  icon: LucideIcon
  badge?: string
}

const nav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Failed Payments', icon: CreditCard, badge: '312' },
  { label: 'Recovery Agent', icon: Bot, badge: 'AI' },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Audit Logs', icon: ScrollText },
]

export function Sidebar() {
  const active = 'Dashboard'
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Waves className="size-5" aria-hidden="true" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            RecoverFlow
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Revenue OS
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <p className="px-3 pb-2 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Operations
        </p>
        {nav.map((item) => {
          const isActive = item.label === active
          return (
            <button
              key={item.label}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
              )}
            >
              <item.icon
                className={cn(
                  'size-4 shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
                aria-hidden="true"
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold',
                    item.badge === 'AI'
                      ? 'bg-primary/15 text-primary'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span
                  className="absolute left-0 h-6 w-0.5 -translate-x-3 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto space-y-1 p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <Settings className="size-4" aria-hidden="true" />
          Settings
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <LifeBuoy className="size-4" aria-hidden="true" />
          Support
        </button>
      </div>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            PM
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              Priya Menon
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Revenue Lead
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
