import { phases, specialItems } from "@/lib/timeline-data";
import { StatsCards } from "@/components/stats-cards";
import { PhaseProgress } from "@/components/phase-progress";
import {
  PhaseSection,
  TimelineHeader,
  Legend,
  SpecialItemsBar,
} from "@/components/gantt-chart";
import { TodayMarker } from "@/components/today-marker";
import { CalendarRange } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CalendarRange className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  UDP Framework Timeline
                </h1>
                <p className="text-xs text-muted-foreground">
                  Unified Data Platform Implementation Roadmap 2025
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
                Updated: Feb 2025
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                In Progress
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 py-6">
        {/* Stats Row */}
        <section className="mb-6">
          <StatsCards />
        </section>

        {/* Phase Progress */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Phase Overview
          </h2>
          <PhaseProgress />
        </section>

        {/* Timeline Chart */}
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Gantt Chart Timeline
            </h2>
            <Legend />
          </div>

          <div className="overflow-x-auto">
            <div className="relative min-w-[1000px]">
              {/* Month Header */}
              <div className="sticky top-0 z-20 rounded-t-lg border-b border-border bg-card pb-1">
                <TimelineHeader />
              </div>

              {/* Chart Body */}
              <div className="relative">
                <TodayMarker />

                {/* Phase Sections */}
                <div className="py-2">
                  {phases.map((phase) => (
                    <PhaseSection key={phase.name} phase={phase} />
                  ))}

                  {/* Special Items */}
                  <SpecialItemsBar items={specialItems} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 flex items-center justify-between border-t border-border pt-4 pb-8 text-xs text-muted-foreground">
          <span>UDP Framework - Executive Dashboard</span>
          <span>Confidential - Internal Use Only</span>
        </footer>
      </div>
    </main>
  );
}
