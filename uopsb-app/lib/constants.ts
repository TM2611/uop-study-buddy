import { MatchType, WeeklySlotStates } from "@/app/types";

// 07:00 - 23:00, 1 hour slots
export const initSlotStates : WeeklySlotStates = Array(7)
  .fill(null)
  .map(() => Array(16).fill(0));

export const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const hours = Array.from({ length: 16 }, (_, i) => i + 7);

export const matchTypes: MatchType[] = [
  "Department",
  "Confidence",
  "Similarity",
];

export const SIMILARITY_THRESHOLD = 0.2;
