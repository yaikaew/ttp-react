// --- Types ---
export interface ThemeOption {
  bg: string;
  text: string;
  border: string;
}

// --- Artist Themes ---
export const ARTIST_THEME_MAP: Record<string, ThemeOption> = {
  teeteepor: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  teetee: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
  },
  por: { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100" },
  dexx: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
};

export const DOW_THEME_MAP: Record<number, string> = {
  0: "bg-[#F87171]", // Sun: แดง (Rose/Red)
  1: "bg-[#FACC15]", // Mon: เหลือง (Amber/Yellow)
  2: "bg-[#F472B6]", // Tue: ชมพู (Pink)
  3: "bg-[#4ADE80]", // Wed: เขียว (Green)
  4: "bg-[#FB923C]", // Thu: ส้ม (Orange)
  5: "bg-[#60A5FA]", // Fri: ฟ้า (Blue)
  6: "bg-[#A78BFA]", // Sat: ม่วง (Violet)
};

// --- Type Themes ---
export const TYPE_THEME_MAP: Record<string, ThemeOption> = {
  Single: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-100",
  },
  MV: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
  Performance: {
    bg: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-100",
  },
  Cover: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
  },
  Special: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
  },
  Concert: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-100",
  },
  Event: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100",
  },
  "Private Event": {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
  },
  "Fan Meet": {
    bg: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-100",
  },
  "Fan Sign": {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
  },
  "Press Tour": {
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
  },
  Online: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100",
  },
};

// --- Helper Functions ---
export const getArtistTheme = (artist: string): ThemeOption => {
  const key = artist?.toLowerCase().replace(/\s/g, "") || "";
  return (
    ARTIST_THEME_MAP[key] || {
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-100",
    }
  );
};

export const getDOWTheme = (dateString: string): string => {
  const date = new Date(dateString);
  // getDay() คืนค่า 0 (Sun) ถึง 6 (Sat)
  const dayIndex = date.getDay();
  return DOW_THEME_MAP[dayIndex] || "bg-rose-300";
};

export const getTypeTheme = (type: string): ThemeOption => {
  return (
    TYPE_THEME_MAP[type] || {
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-100",
    }
  );
};
