export type TaskType =
  | "infra"
  | "development"
  | "testing"
  | "deployment"
  | "migration"
  | "onboarding"
  | "milestone";

export interface TimelineTask {
  name: string;
  type: TaskType;
  startCol: number; // 0-23 (Jan H1=0, Jan H2=1, Feb H1=2, ...)
  endCol: number;
  note?: string;
}

export interface Phase {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  tasks: TimelineTask[];
}

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const TASK_TYPE_COLORS: Record<
  TaskType,
  { bg: string; text: string; border: string }
> = {
  infra: {
    bg: "bg-sky-500/20",
    text: "text-sky-400",
    border: "border-sky-500/40",
  },
  development: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/40",
  },
  testing: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/40",
  },
  deployment: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/40",
  },
  migration: {
    bg: "bg-fuchsia-500/20",
    text: "text-fuchsia-400",
    border: "border-fuchsia-500/40",
  },
  onboarding: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/40",
  },
  milestone: {
    bg: "bg-rose-500/20",
    text: "text-rose-400",
    border: "border-rose-500/40",
  },
};

export const TASK_TYPE_BAR_COLORS: Record<TaskType, string> = {
  infra: "from-sky-500 to-sky-400",
  development: "from-blue-500 to-blue-400",
  testing: "from-amber-500 to-amber-400",
  deployment: "from-emerald-500 to-emerald-400",
  migration: "from-fuchsia-500 to-fuchsia-400",
  onboarding: "from-cyan-500 to-cyan-400",
  milestone: "from-rose-500 to-rose-400",
};

export const phases: Phase[] = [
  {
    name: "KUMO",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    tasks: [
      { name: "UDP NonProd Infra", type: "infra", startCol: 0, endCol: 3 },
      { name: "UDP Prod Infra", type: "infra", startCol: 2, endCol: 5 },
      {
        name: "Dev - UDP Framework",
        type: "development",
        startCol: 4,
        endCol: 10,
        note: "PST, CICD, CRT, OBD",
      },
      {
        name: "Dev - DAP Outbound (DAP, DGW, ESP)",
        type: "development",
        startCol: 4,
        endCol: 11,
      },
      {
        name: "Dev - UDP Pipeline",
        type: "development",
        startCol: 6,
        endCol: 9,
        note: "PST \u2192 CRT, OBD",
      },
      {
        name: "SIT",
        type: "testing",
        startCol: 8,
        endCol: 11,
        note: "PST \u2192 CRT, OBD",
      },
      {
        name: "Data Migration - KUMO NonProd",
        type: "migration",
        startCol: 8,
        endCol: 11,
      },
      {
        name: "Deploy - UDP Framework & Pipeline",
        type: "deployment",
        startCol: 11,
        endCol: 13,
        note: "PST \u2192 CRT, OBD",
      },
      {
        name: "Data Migration - KUMO Prod",
        type: "migration",
        startCol: 10,
        endCol: 12,
        note: "PST \u2192 CRT",
      },
      { name: "PVT", type: "testing", startCol: 12, endCol: 14 },
      {
        name: "User Onboard & Migration",
        type: "onboarding",
        startCol: 13,
        endCol: 17,
        note: "CRM Migrate + Mule",
      },
    ],
  },
  {
    name: "Apollo (One Retail)",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    tasks: [
      {
        name: "Dev - Apollo Code Conversion",
        type: "development",
        startCol: 3,
        endCol: 9,
        note: "Req \u2192 Run + Feedback \u2192 Migrate \u2192 UIS",
      },
      {
        name: "Dev - Apollo Migration Productionize",
        type: "development",
        startCol: 8,
        endCol: 13,
      },
      {
        name: "Dev - UDP Enhance Framework (Apollo)",
        type: "development",
        startCol: 8,
        endCol: 11,
        note: "CSV to YAML",
      },
      {
        name: "Data Migration - Apollo NonProd",
        type: "migration",
        startCol: 10,
        endCol: 13,
      },
      {
        name: "Dev - UDP Pipeline (Apollo)",
        type: "development",
        startCol: 10,
        endCol: 13,
        note: "No Feature Apollo",
      },
      { name: "SIT", type: "testing", startCol: 12, endCol: 15 },
      {
        name: "Deploy - UDP Enhance Framework",
        type: "deployment",
        startCol: 14,
        endCol: 16,
      },
      {
        name: "Deploy - UDP Pipeline (Apollo)",
        type: "deployment",
        startCol: 15,
        endCol: 17,
      },
      {
        name: "Data Migration - Apollo Prod",
        type: "migration",
        startCol: 16,
        endCol: 18,
        note: "Unhash",
      },
      { name: "PVT", type: "testing", startCol: 17, endCol: 19 },
      {
        name: "User Apollo Onboard",
        type: "onboarding",
        startCol: 18,
        endCol: 20,
      },
    ],
  },
  {
    name: "AIVS",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    tasks: [
      {
        name: "Dev - UDP Enhance Framework ML",
        type: "development",
        startCol: 12,
        endCol: 15,
        note: "Oat",
      },
      {
        name: "Data Migration - AIVS NonProd",
        type: "migration",
        startCol: 14,
        endCol: 16,
      },
      {
        name: "Dev - UDP DE Pipeline (AIVS)",
        type: "development",
        startCol: 14,
        endCol: 17,
        note: "Oat",
      },
      {
        name: "Dev - UDP MLE Pipeline (AIVS)",
        type: "development",
        startCol: 16,
        endCol: 19,
      },
      { name: "SIT - AIVS", type: "testing", startCol: 17, endCol: 19 },
      {
        name: "UAT - AIVS",
        type: "testing",
        startCol: 18,
        endCol: 20,
        note: "Need confirm timeline",
      },
      {
        name: "Deploy - UDP Framework ML",
        type: "deployment",
        startCol: 20,
        endCol: 22,
      },
      {
        name: "Deploy - UDP Pipeline ML",
        type: "deployment",
        startCol: 21,
        endCol: 23,
      },
      {
        name: "Data Migration - AIVS Prod",
        type: "migration",
        startCol: 20,
        endCol: 22,
      },
      { name: "PVT - AIVS", type: "testing", startCol: 22, endCol: 23 },
      {
        name: "User AIVS Onboard",
        type: "onboarding",
        startCol: 13,
        endCol: 23,
        note: "Tentative migrate 3.1, 3.2",
      },
    ],
  },
];

export const specialItems = [
  {
    name: "Switch OBD: Apollo \u2192 UDP",
    startCol: 18,
    endCol: 20,
  },
  {
    name: "TBD: Oracle Framework (Jul 2027)",
    startCol: 20,
    endCol: 23,
  },
];
