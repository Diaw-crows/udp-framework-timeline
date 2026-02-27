"use client";

import { useState } from "react";
import {
  type Phase,
  type TimelineTask,
  MONTHS,
  TASK_TYPE_BAR_COLORS,
  TASK_TYPE_COLORS,
  type TaskType,
} from "@/lib/timeline-data";

function TaskBar({ task }: { task: TimelineTask }) {
  const [hovered, setHovered] = useState(false);
  const barColors = TASK_TYPE_BAR_COLORS[task.type];
  const totalCols = 24;
  const left = (task.startCol / totalCols) * 100;
  const width = ((task.endCol - task.startCol + 1) / totalCols) * 100;

  return (
    <div className="group relative flex items-center gap-3 py-1.5">
      <div className="w-56 shrink-0 truncate pr-3 text-right text-xs text-muted-foreground">
        {task.name}
      </div>
      <div className="relative h-7 flex-1">
        <div
          className="absolute top-0.5 h-6 cursor-pointer rounded-md transition-all duration-200"
          style={{ left: `${left}%`, width: `${width}%` }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            className={`h-full w-full rounded-md bg-gradient-to-r ${barColors} ${
              hovered ? "opacity-100 shadow-lg" : "opacity-80"
            } transition-all duration-200`}
          />
          {task.note && hovered && (
            <div className="absolute top-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-xl">
              {task.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MonthGrid() {
  return (
    <div className="flex items-center">
      <div className="w-56 shrink-0" />
      <div className="relative flex-1">
        <div className="flex">
          {MONTHS.map((month) => (
            <div
              key={month}
              className="flex-1 border-l border-border/40 text-center"
            >
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                {month}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
          {MONTHS.map((month) => (
            <div key={month} className="flex flex-1">
              <div className="flex-1 border-l border-border/20 py-0.5 text-center">
                <span className="text-[9px] text-muted-foreground/60">H1</span>
              </div>
              <div className="flex-1 border-l border-border/10 py-0.5 text-center">
                <span className="text-[9px] text-muted-foreground/60">H2</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GridLines() {
  return (
    <div className="pointer-events-none absolute inset-0 flex" aria-hidden>
      <div className="w-56 shrink-0" />
      <div className="flex flex-1">
        {MONTHS.map((month, i) => (
          <div key={month} className="flex flex-1">
            <div
              className={`flex-1 ${
                i % 2 === 0
                  ? "border-l border-border/20"
                  : "border-l border-border/10"
              }`}
            />
            <div className="flex-1 border-l border-border/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CurrentDateLine() {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), month + 1, 0).getDate();
  const halfMonth = day <= daysInMonth / 2 ? 0 : 1;
  const col = month * 2 + halfMonth;
  const position = (col / 24) * 100;

  return (
    <div
      className="pointer-events-none absolute top-0 bottom-0 z-10"
      style={{ left: `calc(14rem + ${position}% * (100% - 14rem) / 100%)` }}
    >
      <div className="absolute top-0 h-full w-px bg-red-500/60" />
      <div className="absolute -top-1 -translate-x-1/2 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-semibold text-red-50">
        Today
      </div>
    </div>
  );
}

export function PhaseSection({ phase }: { phase: Phase }) {
  return (
    <div className="relative mb-2">
      <div
        className={`mb-1 flex items-center gap-2 border-l-2 ${phase.borderColor} ${phase.bgColor} rounded-r-md px-3 py-2`}
      >
        <h3 className={`text-sm font-bold tracking-wide ${phase.color}`}>
          {phase.name}
        </h3>
        <span className="text-xs text-muted-foreground">
          {phase.tasks.length} tasks
        </span>
      </div>
      <div className="relative">
        <GridLines />
        {phase.tasks.map((task) => (
          <TaskBar key={task.name} task={task} />
        ))}
      </div>
    </div>
  );
}

export function TimelineHeader() {
  return <MonthGrid />;
}

export function TodayLine() {
  return <CurrentDateLine />;
}

export function Legend() {
  const types: { type: TaskType; label: string }[] = [
    { type: "infra", label: "Infrastructure" },
    { type: "development", label: "Development" },
    { type: "testing", label: "Testing" },
    { type: "deployment", label: "Deployment" },
    { type: "migration", label: "Data Migration" },
    { type: "onboarding", label: "Onboarding" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      {types.map(({ type, label }) => {
        const colors = TASK_TYPE_COLORS[type];
        return (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className={`h-2.5 w-5 rounded-sm bg-gradient-to-r ${TASK_TYPE_BAR_COLORS[type]}`}
            />
            <span className={`text-xs ${colors.text}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function SpecialItemsBar({
  items,
}: {
  items: { name: string; startCol: number; endCol: number }[];
}) {
  return (
    <div className="relative mt-1 mb-2">
      <div className="mb-1 flex items-center gap-2 border-l-2 border-rose-500/30 rounded-r-md bg-rose-500/5 px-3 py-2">
        <h3 className="text-sm font-bold tracking-wide text-rose-400">
          Special Items
        </h3>
      </div>
      <div className="relative">
        <GridLines />
        {items.map((item) => {
          const totalCols = 24;
          const left = (item.startCol / totalCols) * 100;
          const width = ((item.endCol - item.startCol + 1) / totalCols) * 100;
          return (
            <div
              key={item.name}
              className="group relative flex items-center gap-3 py-1.5"
            >
              <div className="w-56 shrink-0 truncate pr-3 text-right text-xs text-muted-foreground">
                {item.name}
              </div>
              <div className="relative h-7 flex-1">
                <div
                  className="absolute top-0.5 h-6 rounded-md"
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  <div className="h-full w-full rounded-md border border-dashed border-rose-500/40 bg-rose-500/10" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
