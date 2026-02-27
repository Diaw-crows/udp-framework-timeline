import { phases } from "@/lib/timeline-data";

export function PhaseProgress() {
  const phaseData = phases.map((phase) => {
    const minCol = Math.min(...phase.tasks.map((t) => t.startCol));
    const maxCol = Math.max(...phase.tasks.map((t) => t.endCol));
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const startMonth = months[Math.floor(minCol / 2)];
    const endMonth = months[Math.floor(maxCol / 2)];
    const totalSpan = maxCol - minCol + 1;
    const now = new Date();
    const currentCol = now.getMonth() * 2 + (now.getDate() > 15 ? 1 : 0);
    const elapsed = Math.max(0, Math.min(totalSpan, currentCol - minCol));
    const progress = Math.round((elapsed / totalSpan) * 100);

    return {
      ...phase,
      startMonth,
      endMonth,
      taskCount: phase.tasks.length,
      progress: Math.min(100, progress),
    };
  });

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {phaseData.map((phase) => (
        <div
          key={phase.name}
          className={`rounded-xl border ${phase.borderColor} ${phase.bgColor} px-4 py-3`}
        >
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-bold ${phase.color}`}>
              {phase.name}
            </h4>
            <span className="text-xs text-muted-foreground">
              {phase.startMonth} - {phase.endMonth}
            </span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {phase.taskCount} tasks
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${
                phase.name === "KUMO"
                  ? "from-blue-500 to-blue-400"
                  : phase.name.includes("Apollo")
                  ? "from-emerald-500 to-emerald-400"
                  : "from-amber-500 to-amber-400"
              } transition-all duration-700`}
              style={{ width: `${phase.progress}%` }}
            />
          </div>
          <div className="mt-1 text-right text-[10px] text-muted-foreground">
            {phase.progress}% elapsed
          </div>
        </div>
      ))}
    </div>
  );
}
