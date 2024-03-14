import {
  AvailabilitySlot,
  SessionSlot,
  SlotStatus,
  WeeklySlotStates,
} from "@/app/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { days, hours } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// needed for db insertion
export function convertDateToYMD(dateString: string): string {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function convertDateToDMY(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

export function createDateFromString(dateString: string): Date {
  const [day, month, year] = dateString.split("/").map(Number);
  const adjustedMonth = month - 1;
  return new Date(year, adjustedMonth, day);
}

export function isDateInRange(dateStr: string, startOfWeek: string): boolean {
  // Convert date strings to Date objects
  const date = new Date(dateStr);
  const startDate = new Date(startOfWeek);

  // Calculate the end date of the week
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  // Check if the date is within the range
  return date >= startDate && date <= endDate;
}

export function getDayFromDateStr(dateString: string): string {
  const date = new Date(dateString);
  const dayIndex = date.getDay();
  return days[dayIndex];
}

export function extractUpNum(email: string) {
  const match = email.match(/\d+/);
  if (!match) throw new Error("Could not extract upNum from email");
  return match[0];
}

export function statesToAvailabilitySlots(
  slotStates: WeeklySlotStates
): AvailabilitySlot[] {
  try {
    let slots: AvailabilitySlot[] = [];

    days.forEach((day, dayIndex) => {
      let startHour: number | null = null;

      slotStates[dayIndex].forEach((slotState, hourIndex) => {
        if (slotState === 1 && startHour === null) {
          startHour = hours[hourIndex];
        }

        if (
          (slotState !== 1 || hourIndex === hours.length - 1) &&
          startHour !== null
        ) {
          slots.push({
            day,
            start_hour: startHour,
            end_hour: hours[hourIndex],
          });
          startHour = null;
        }
      });
    });

    return slots;
  } catch (error) {
    console.error("Error converting Availability States to JSON:", error);
    return [];
  }
}

export function availabilitySlotsToStates(
  availableSlots: AvailabilitySlot[]
): WeeklySlotStates {
  try {
    // Initialize a 2D array with all values set to 0 (SlotStatus)
    const slotStates: WeeklySlotStates = days.map(
      () => hours.map(() => -1 as SlotStatus) // Grey out all slots
    );

    availableSlots.forEach((slot) => {
      const dayIndex = days.indexOf(slot.day);
      const startHourIndex = hours.indexOf(slot.start_hour);
      const endHourIndex = hours.indexOf(slot.end_hour);

      if (dayIndex !== -1 && startHourIndex !== -1 && endHourIndex !== -1) {
        for (
          let hourIndex = startHourIndex;
          hourIndex < endHourIndex;
          hourIndex++
        ) {
          slotStates[dayIndex][hourIndex] = 0; // Set the SlotStatus to 0
        }
      }
    });

    return slotStates;
  } catch (error) {
    console.error(
      "Error converting JSON slots to Availability States array:",
      error
    );
    return [];
  }
}

export function getBookedSlotIndexes(
  weekBookedSessions: Omit<SessionSlot, "day">[]
): [number, number][] {
  const indexes: [number, number][] = [];

  weekBookedSessions.forEach((session) => {
    const date = new Date(session.date);
    const dayOfWeek = (date.getDay() + 6) % 7;

    for (let hour = session.start_hour; hour < session.end_hour; hour++) {
      const dayIndex = days.indexOf(days[dayOfWeek]);
      const hourIndex = hours.indexOf(hour);

      if (dayIndex !== -1 && hourIndex !== -1) {
        indexes.push([dayIndex, hourIndex]);
      }
    }
  });

  return indexes;
}
