import {
  AvailabilitySlot,
  AvailabilityStatus,
  WeeklyAvailabilityStates,
} from "@/app/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { days, hours } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractUpNum(email: string) {
  const match = email.match(/\d+/);
  if (!match) throw new Error("Could not extract upNum from email");
  return match[0];
}

export function availabilityStatesToSlots(
  availabilityStates: WeeklyAvailabilityStates
): AvailabilitySlot[] {
  try {
    let slots: AvailabilitySlot[] = [];

    days.forEach((day, dayIndex) => {
      let startHour: number | null = null;

      availabilityStates[dayIndex].forEach((availabilityStatus, hourIndex) => {
        if (availabilityStatus === 1 && startHour === null) {
          startHour = hours[hourIndex];
        }

        if (
          (availabilityStatus !== 1 || hourIndex === hours.length - 1) &&
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
  availabilitySlots: AvailabilitySlot[]
): WeeklyAvailabilityStates {
  try {
    // Initialize a 2D array with all values set to 0 (AvailabilityStatus)
    const availabilityStates: WeeklyAvailabilityStates = days.map(() =>
      hours.map(() => -1 as AvailabilityStatus) // Grey out all slots
    );

    availabilitySlots.forEach((slot) => {
      const dayIndex = days.indexOf(slot.day);
      const startHourIndex = hours.indexOf(slot.start_hour);
      const endHourIndex = hours.indexOf(slot.end_hour);

      if (dayIndex !== -1 && startHourIndex !== -1 && endHourIndex !== -1) {
        for (
          let hourIndex = startHourIndex;
          hourIndex < endHourIndex;
          hourIndex++
        ) {
          availabilityStates[dayIndex][hourIndex] = 0; // Set the AvailabilityStatus to 0
        }
      }
    });

    return availabilityStates;
  } catch (error) {
    console.error(
      "Error converting JSON slots to Availability States array:",
      error
    );
    return [];
  }
}
