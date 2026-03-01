"use client";

import { useState, useRef, useEffect } from "react";
import {
  type Phase,
  type TimelineTask,
  MONTHS,
  TASK_TYPE_BAR_COLORS,
  TASK_TYPE_COLORS,
  type TaskType,
} from "@/lib/timeline-data";

// Custom Hook สำหรับจัดการ Drag & Drop และ Resize
function useDraggableBar(
  initialStartCol: number,
  initialEndCol: number,
  totalCols: number,
  onUpdate?: (start: number, end: number) => void
) {
  const [startCol, setStartCol] = useState(initialStartCol);
  const [endCol, setEndCol] = useState(initialEndCol);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync กับ Props ในกรณีที่ข้อมูลจากภายนอกถูกอัปเดต
  useEffect(() => {
    setStartCol(initialStartCol);
    setEndCol(initialEndCol);
  }, [initialStartCol, initialEndCol]);

  const handleDragStart = (
    e: React.MouseEvent,
    type: "move" | "resize-left" | "resize-right"
  ) => {
    if (!containerRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const currentStartCol = startCol;
    const currentEndCol = endCol;
    const duration = currentEndCol - currentStartCol;
    const containerWidth = containerRef.current.getBoundingClientRect().width;

    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // แปลงระยะทางพิกเซลเป็นจำนวนช่อง (Column)
      const colsMoved = Math.round((deltaX / containerWidth) * totalCols);

      let newStartCol = currentStartCol;
      let newEndCol = currentEndCol;

      if (type === "move") {
        newStartCol += colsMoved;
        newEndCol += colsMoved;
        // ป้องกันไม่ให้ลากหลุดขอบเขต
        if (newStartCol < 0) {
          newStartCol = 0;
          newEndCol = duration;
        }
        if (newEndCol >= totalCols) {
          newEndCol = totalCols - 1;
          newStartCol = newEndCol - duration;
        }
      } else if (type === "resize-left") {
        newStartCol += colsMoved;
        if (newStartCol > newEndCol) newStartCol = newEndCol;
        if (newStartCol < 0) newStartCol = 0;
      } else if (type === "resize-right") {
        newEndCol += colsMoved;
        if (newEndCol < newStartCol) newEndCol = newStartCol;
        if (newEndCol >= totalCols) newEndCol = totalCols - 1;
      }

      setStartCol(newStartCol);
      setEndCol(newEndCol);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setIsDragging(false);

      const deltaX = upEvent.clientX - startX;
      const colsMoved = Math.round((deltaX / containerWidth) * totalCols);

      let newStartCol = currentStartCol;
      let newEndCol = currentEndCol;

      if (type === "move") {
        newStartCol += colsMoved;
        newEndCol += colsMoved;
        if (newStartCol < 0) {
          newStartCol = 0;
          newEndCol = duration;
        }
        if (newEndCol >= totalCols) {
          newEndCol = totalCols - 1;
          newStartCol = newEndCol - duration;
        }
      } else if (type === "resize-left") {
        newStartCol += colsMoved;
        if (newStartCol > newEndCol) newStartCol = newEndCol;
        if (newStartCol < 0) newStartCol = 0;
      } else if (type === "resize-right") {
        newEndCol += colsMoved;
        if (newEndCol < newStartCol) newEndCol = newStartCol;
        if (newEndCol >= totalCols) newEndCol = totalCols - 1;
      }

      setStartCol(newStartCol);
      setEndCol(newEndCol);

      // แจ้ง Parent Component เพื่อบันทึกข้อมูลหากมีการเปลี่ยนแปลง
      if (onUpdate && (newStartCol !== currentStartCol || newEndCol !== currentEndCol)) {
        onUpdate(newStartCol, newEndCol);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return { startCol, endCol, isDragging, containerRef, handleDragStart };
}

function TaskBar({
  task,
  onTaskUpdate,
}: {
  task: TimelineTask;
  onTaskUpdate?: (task: TimelineTask) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const barColors = TASK_TYPE_BAR_COLORS[task.type];
  const totalCols = 24;

  const { startCol, endCol, isDragging, containerRef, handleDragStart } =
    useDraggableBar(task.startCol, task.endCol, totalCols, (newStart, newEnd) => {
      if (onTaskUpdate) {
        onTaskUpdate({ ...task, startCol: newStart, endCol: newEnd });
      }
    });

  const left = (startCol / totalCols) * 100;
  const width = ((endCol - startCol + 1) / totalCols) * 100;

  return (
    <div className="group relative flex items-center gap-3 py-1.5">
      {/* ทำให้ชื่อ Task ติดอยู่ทางซ้าย (Sticky Left) */}
      <div className="sticky left-0 z-30 flex h-7 w-56 shrink-0 items-center justify-end bg-background pr-3 text-right text-xs text-muted-foreground shadow-[1px_0_0_0_rgba(255,255,255,0.05)]">
        <span className="truncate">{task.name}</span>
      </div>
      <div className="relative h-7 flex-1" ref={containerRef}>
        <div
          className={`absolute top-0.5 h-6 rounded-md ${
            isDragging ? "transition-none" : "transition-all duration-200"
          }`}
          style={{ left: `${left}%`, width: `${width}%` }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Main Bar (ลากเพื่อ Move) */}
          <div
            className={`h-full w-full rounded-md bg-gradient-to-r ${barColors} ${
              hovered || isDragging
                ? "opacity-100 shadow-lg cursor-grab active:cursor-grabbing"
                : "opacity-80 cursor-pointer"
            }`}
            onMouseDown={(e) => handleDragStart(e, "move")}
          />

          {/* Left Handle (ยืดหดด้านซ้าย) */}
          {(hovered || isDragging) && (
            <div
              className="absolute left-0 top-0 bottom-0 w-2.5 cursor-ew-resize rounded-l-md hover:bg-white/30 z-10"
              onMouseDown={(e) => handleDragStart(e, "resize-left")}
            />
          )}

          {/* Right Handle (ยืดหดด้านขวา) */}
          {(hovered || isDragging) && (
            <div
              className="absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize rounded-r-md hover:bg-white/30 z-10"
              onMouseDown={(e) => handleDragStart(e, "resize-right")}
            />
          )}

          {task.note && (hovered || isDragging) && (
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
    <div className="flex items-stretch">
      {/* ทำให้ช่องว่างด้านซ้ายสุดติดขอบ (Sticky Top-Left Corner) */}
      <div className="sticky left-0 z-50 w-56 shrink-0 bg-background/95 backdrop-blur border-r border-border/40 shadow-[1px_0_0_0_rgba(255,255,255,0.05)]" />
      <div className="relative flex-1 py-2">
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
      {/* ทำให้เส้น Grid ไม่ทับกับเมนูด้านซ้าย */}
      <div className="sticky left-0 z-20 w-56 shrink-0 bg-background" />
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
      className="pointer-events-none absolute top-0 bottom-0 z-40"
      style={{ left: `calc(14rem + ${position}% * (100% - 14rem) / 100%)` }}
    >
      <div className="absolute top-0 h-full w-px bg-red-500/60" />
      <div className="sticky top-12 mt-1 w-max -translate-x-1/2 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-semibold text-red-50 shadow-md">
        Today
      </div>
    </div>
  );
}

export function PhaseSection({
  phase,
  onTaskUpdate,
  onAddTask,
}: {
  phase: Phase;
  onTaskUpdate?: (updatedTask: TimelineTask) => void;
  onAddTask?: (phaseName: string, newTask: TimelineTask) => void;
}) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const handleAddTask = () => {
    if (newTaskName.trim() && onAddTask) {
      onAddTask(phase.name, {
        name: newTaskName.trim(),
        type: "development",
        startCol: 0,
        endCol: 3,
      });
    }
    setNewTaskName("");
    setIsAddingTask(false);
  };

  return (
    <div className="relative mb-2">
      <div
        className={`mb-1 flex items-center border-l-2 ${phase.borderColor} ${phase.bgColor} rounded-r-md`}
      >
        {/* ทำให้ชื่อ Phase ติดซ้ายเสมอ */}
        <div className="sticky left-0 z-30 flex w-max items-center gap-2 px-3 py-2 backdrop-blur-sm">
          <h3 className={`text-sm font-bold tracking-wide ${phase.color}`}>
            {phase.name}
          </h3>
          <span className="text-xs text-muted-foreground">
            {phase.tasks.length} tasks
          </span>
        </div>
      </div>
      <div className="relative">
        <GridLines />
        {phase.tasks.map((task) => (
          <TaskBar key={task.name} task={task} onTaskUpdate={onTaskUpdate} />
        ))}

        {/* Add Task Row */}
        <div className="group relative flex items-center gap-3 py-1.5">
          <div className="sticky left-0 z-30 flex h-7 w-56 shrink-0 items-center justify-end bg-background pr-3 text-right">
            {isAddingTask ? (
              <input
                autoFocus
                className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-right focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Task name..."
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask();
                  if (e.key === "Escape") {
                    setNewTaskName("");
                    setIsAddingTask(false);
                  }
                }}
                onBlur={() => {
                  if (newTaskName.trim()) handleAddTask();
                  else setIsAddingTask(false);
                }}
              />
            ) : (
              <button
                onClick={() => setIsAddingTask(true)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground/40 hover:text-foreground transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            )}
          </div>
          <div className="relative h-7 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function TimelineHeader() {
  return (
    // ทำให้ Header ล็อกติดด้านบน (Sticky Top)
    <div className="sticky top-0 z-50 border-b border-border/40 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <MonthGrid />
    </div>
  );
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

function SpecialItemRow({
  item,
  onUpdate,
}: {
  item: { name: string; startCol: number; endCol: number };
  onUpdate?: (name: string, startCol: number, endCol: number) => void;
}) {
  const totalCols = 24;
  const { startCol, endCol, isDragging, containerRef, handleDragStart } =
    useDraggableBar(item.startCol, item.endCol, totalCols, (newStart, newEnd) => {
      if (onUpdate) onUpdate(item.name, newStart, newEnd);
    });

  const left = (startCol / totalCols) * 100;
  const width = ((endCol - startCol + 1) / totalCols) * 100;
  const [hovered, setHovered] = useState(false);

  return (
    <div className="group relative flex items-center gap-3 py-1.5">
      {/* Sticky Left สำหรับ Special Items */}
      <div className="sticky left-0 z-30 flex h-7 w-56 shrink-0 items-center justify-end bg-background pr-3 text-right text-xs text-muted-foreground shadow-[1px_0_0_0_rgba(255,255,255,0.05)]">
        <span className="truncate">{item.name}</span>
      </div>
      <div className="relative h-7 flex-1" ref={containerRef}>
        <div
          className={`absolute top-0.5 h-6 rounded-md ${
            isDragging ? "transition-none" : "transition-all duration-200"
          }`}
          style={{ left: `${left}%`, width: `${width}%` }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            className={`h-full w-full rounded-md border border-dashed border-rose-500/40 bg-rose-500/10 ${
              hovered || isDragging
                ? "cursor-grab active:cursor-grabbing bg-rose-500/20"
                : "cursor-pointer"
            }`}
            onMouseDown={(e) => handleDragStart(e, "move")}
          />

          {(hovered || isDragging) && (
            <>
              <div
                className="absolute left-0 top-0 bottom-0 w-2.5 cursor-ew-resize rounded-l-md hover:bg-rose-500/20 z-10"
                onMouseDown={(e) => handleDragStart(e, "resize-left")}
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize rounded-r-md hover:bg-rose-500/20 z-10"
                onMouseDown={(e) => handleDragStart(e, "resize-right")}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function SpecialItemsBar({
  items,
  onItemUpdate,
}: {
  items: { name: string; startCol: number; endCol: number }[];
  onItemUpdate?: (name: string, startCol: number, endCol: number) => void;
}) {
  return (
    <div className="relative mt-1 mb-2">
      <div className="mb-1 flex items-center border-l-2 border-rose-500/30 rounded-r-md bg-rose-500/5">
        <div className="sticky left-0 z-30 flex w-max items-center gap-2 px-3 py-2">
          <h3 className="text-sm font-bold tracking-wide text-rose-400">
            Special Items
          </h3>
        </div>
      </div>
      <div className="relative">
        <GridLines />
        {items.map((item) => (
          <SpecialItemRow key={item.name} item={item} onUpdate={onItemUpdate} />
        ))}
      </div>
    </div>
  );
}

export function AddPhaseButton({
  onAddPhase,
}: {
  onAddPhase?: (phaseName: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [phaseName, setPhaseName] = useState("");

  const handleAdd = () => {
    if (phaseName.trim() && onAddPhase) {
      onAddPhase(phaseName.trim());
    }
    setPhaseName("");
    setIsAdding(false);
  };

  return (
    <div className="relative mb-6 group">
      {isAdding ? (
        <div className="mb-1 flex items-center border-l-2 border-dashed border-border/50 bg-muted/10 rounded-r-md">
          <div className="sticky left-0 z-30 px-3 py-2">
            <input
              autoFocus
              className="bg-background border border-border rounded px-2 py-1 text-sm font-bold w-48 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="New Phase name..."
              value={phaseName}
              onChange={(e) => setPhaseName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") {
                  setPhaseName("");
                  setIsAdding(false);
                }
              }}
              onBlur={() => {
                if (phaseName.trim()) handleAdd();
                else setIsAdding(false);
              }}
            />
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsAdding(true)}
          className="mb-1 flex items-center border-l-2 border-dashed border-border/30 bg-muted/5 rounded-r-md cursor-pointer hover:bg-muted/20 hover:border-border/60 transition-all"
        >
          <div className="sticky left-0 z-30 px-3 py-2">
            <h3 className="text-sm font-bold tracking-wide text-muted-foreground group-hover:text-foreground flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Phase
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------------
// เพิ่ม Component สำหรับครอบ Gantt Chart ทั้งหมด เพื่อบังคับ CSS ให้ Sticky ทำงานได้ถูกต้อง
// -------------------------------------------------------------------------
export function GanttLayout({ children }: { children: React.ReactNode }) {
  return (
    // กำหนดความสูงแบบจำกัด (เช่น h-[calc(100vh-8rem)] หรือ h-[800px]) และ overflow-auto
    // จะทำให้ Component ด้านในรับรู้ขอบเขต และ Sticky ทำงานได้ทั้งแนวตั้งและแนวนอน
    <div className="flex h-[calc(100vh-8rem)] min-h-[600px] w-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-md">
      <div className="flex-1 overflow-auto relative scroll-smooth">
        <div className="min-w-max pb-24">
          {children}
        </div>
      </div>
    </div>
  );
}