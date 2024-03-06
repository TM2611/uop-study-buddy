export const initSlotStates = Array(7)
  .fill(null)
  .map(() => Array(16).fill(false));

export const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const hours = Array.from({ length: 16 }, (_, i) => i + 7);
