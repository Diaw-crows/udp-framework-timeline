import { phases } from "@/lib/timeline-data";
import {
  Database,
  Layers,
  CheckCircle2,
  Clock,
  Users,
  Server,
} from "lucide-react";

function countByType(type: string) {
  return phases.reduce(
    (acc, phase) => acc + phase.tasks.filter((t) => t.type === type).length,
    0
  );
}

const stats = [
  {
    label: "Total Tasks",
    value: phases.reduce((acc, p) => acc + p.tasks.length, 0),
    icon: Layers,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    label: "Development",
    value: countByType("development"),
    icon: Database,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    label: "Deployments",
    value: countByType("deployment"),
    icon: Server,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    label: "Testing Phases",
    value: countByType("testing"),
    icon: CheckCircle2,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    label: "Data Migrations",
    value: countByType("migration"),
    icon: Clock,
    color: "text-fuchsia-400",
    bgColor: "bg-fuchsia-500/10",
    borderColor: "border-fuchsia-500/20",
  },
  {
    label: "Onboarding",
    value: countByType("onboarding"),
    icon: Users,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl border ${stat.borderColor} ${stat.bgColor} px-4 py-3`}
        >
          <div className="flex items-center gap-2">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <div className={`mt-1 text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
