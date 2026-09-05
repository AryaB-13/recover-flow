'use client'

import { Button } from '@/components/ui/button'
import { Search, Bell, Sparkles, ChevronDown } from 'lucide-react'

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold tracking-tight md:text-lg">
          Recovery Dashboard
        </h1>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Autonomous recovery agent · live
        </p>
      </div>

      <div className="ml-auto hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 md:flex">
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search transactions, customers…"
          aria-label="Search"
          className="w-56 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          /
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2 md:ml-0">
        <span className="hidden items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary sm:inline-flex">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Agent active
        </span>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <span className="relative">
            <Bell className="size-4" aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-destructive" />
          </span>
        </Button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-border bg-card py-1 pl-1 pr-2 text-sm transition-colors hover:bg-accent"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-accent text-xs font-semibold text-accent-foreground">
            PM
          </span>
          <ChevronDown
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  )
}
