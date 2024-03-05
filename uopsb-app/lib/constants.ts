export const initSlotStates = Array(7)
  .fill(null)
  .map(() => Array(24).fill(false));

export const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const hours = Array.from({ length: 24 }, (_, i) => i);
