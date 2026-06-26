import { HDate, gematriya, gematriyaStrToNum } from "@hebcal/core";

export const HEBREW_MONTHS = [
  { value: 7,  label: "תשרי" },
  { value: 8,  label: "חשוון" },
  { value: 9,  label: "כסלו" },
  { value: 10, label: "טבת" },
  { value: 11, label: "שבט" },
  { value: 12, label: "אדר" },
  { value: 13, label: "אדר ב׳" },
  { value: 1,  label: "ניסן" },
  { value: 2,  label: "אייר" },
  { value: 3,  label: "סיוון" },
  { value: 4,  label: "תמוז" },
  { value: 5,  label: "אב" },
  { value: 6,  label: "אלול" },
];

const MONTH_NAME: Record<number, string> = Object.fromEntries(
  HEBREW_MONTHS.map(m => [m.value, m.label])
);

const MONTH_BY_NAME: Record<string, number> = {
  "תשרי": 7, "חשוון": 8, "חשון": 8, "כסלו": 9, "טבת": 10, "שבט": 11,
  "אדר": 12, "אדרב": 13, "אדרב׳": 13, "ניסן": 1, "אייר": 2,
  "סיוון": 3, "סיון": 3, "תמוז": 4, "אב": 5, "אלול": 6,
};

const normalizeQuotes = (s: string) =>
  s.replace(/[״"]/g, '"').replace(/[׳']/g, "'");

export const gregorianToHDate = (isoDate: string): HDate | null => {
  if (!isoDate) return null;
  try {
    return new HDate(new Date(isoDate + "T00:00:00"));
  } catch {
    return null;
  }
};

export const formatHebrewDate = (isoDate: string): string => {
  const hd = gregorianToHDate(isoDate);
  if (!hd) return "";
  const day = gematriya(hd.getDate());
  const month = MONTH_NAME[hd.getMonth()] ?? "";
  const year = gematriya(hd.getFullYear() % 1000);
  return `${day} ב${month} ${year}`;
};

export const getHebrewDateParts = (isoDate: string): { day: string; month: number; year: string } | null => {
  const hd = gregorianToHDate(isoDate);
  if (!hd) return null;
  return {
    day: gematriya(hd.getDate()),
    month: hd.getMonth(),
    year: gematriya(hd.getFullYear() % 1000),
  };
};

export const parseHebrewDay = (text: string): number | null => {
  try {
    const n = gematriyaStrToNum(normalizeQuotes(text));
    return n >= 1 && n <= 30 ? n : null;
  } catch { return null; }
};

export const parseHebrewYear = (text: string): number | null => {
  try {
    const n = gematriyaStrToNum(normalizeQuotes(text));
    return n > 0 ? (n < 1000 ? n + 5000 : n) : null;
  } catch { return null; }
};

export const parseHebrewDateText = (text: string): string | null => {
  const parts = normalizeQuotes(text.trim()).split(/\s+/).filter(Boolean);
  if (parts.length < 3) return null;
  try {
    const day = gematriyaStrToNum(parts[0]);
    const rawMonth = parts[1].startsWith("ב") ? parts[1].slice(1) : parts[1];
    const month = MONTH_BY_NAME[rawMonth];
    if (!month || day < 1 || day > 30) return null;

    const yearShort = gematriyaStrToNum(parts[2]);
    const year = yearShort < 1000 ? yearShort + 5000 : yearShort;

    const hd = new HDate(day, month, year);
    return hd.greg().toISOString().split("T")[0];
  } catch {
    return null;
  }
};

export const hebrewToGregorianISO = (day: number, month: number, year: number): string => {
  try {
    return new HDate(day, month, year).greg().toISOString().split("T")[0];
  } catch {
    return "";
  }
};
