import { AvailabilitySlot } from "@/app/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractUpNum(email: string) {
  const match = email.match(/\d+/);
  if (!match) throw new Error("Could not extract upNum from email");
  return match[0];
}

export function convertBooleanSlots(slotStates: boolean[][]): AvailabilitySlot[] {
    try {
      const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
      let slots: AvailabilitySlot[] = [];
  
      days.forEach((day, dayIndex) => {
        let startHour: number | null = null;
  
        slotStates[dayIndex].forEach((hourAvailable, hourIndex) => {
          if (hourAvailable && startHour === null) {
            startHour = hourIndex;
          }
  
          if ((!hourAvailable || hourIndex === 23) && startHour !== null) {
            slots.push({
              day,
              start_hour: startHour,
              end_hour: hourIndex,
            });
            startHour = null;
          }
        });
      });
  
      return slots;
    } catch (error) {
      console.error("Error converting Boolean slots to JSON:", error);
      return [];
    }
  }
