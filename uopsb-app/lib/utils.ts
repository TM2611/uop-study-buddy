import {
  AvailabilitySlot,
  Course,
  SessionData,
  SlotStatus,
  Topic,
  WeeklySlotStates,
} from "@/app/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { days, hours } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertDMYToYMD(dateString: string): string {
  const [day, month, year] = dateString.split(/[-/]/); // Use a regular expression to split on both '-' and '/'
  if (day === undefined || month === undefined || year === undefined) {
    throw new Error("Incorrect date format (not DMY)");
  }
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function createDateFromDMY(dateString: string): Date | string {
  const separator = dateString.includes("/") ? "/" : "-";
  const [day, month, year] = dateString.split(separator).map(Number);
  const adjustedMonth = month - 1;

  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    year < 0 ||
    adjustedMonth < 0 ||
    adjustedMonth > 11 ||
    day < 1 ||
    day > 31
  ) {
    return "Invalid date";
  }

  return new Date(year, adjustedMonth, day);
}

export function isDateInRange(
  dateStr: string,
  startOfWeek: string
): boolean | string {
  // Convert date strings to Date objects
  const date = new Date(dateStr);
  const startDate = new Date(startOfWeek);

  // Check if the input date strings are valid
  if (isNaN(date.getTime()) || isNaN(startDate.getTime())) {
    return "Invalid date";
  }

  // Calculate the end date of the week
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  // Check if the date is within the range
  return date >= startDate && date <= endDate;
}

export function getDayFromDateStr(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  const dayIndex = (date.getDay() + 6) % 7; // Adjust the dayIndex calculation (MON..)
  return days[dayIndex];
}

export function extractUpNum(email: string) {
  const match = email.match(/\d+/);
  if (!match) throw new Error("Could not extract upNum from email");
  return match[0];
}

export function weeklyStatesToSelectedSlots(
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

export function slotsToAvailableStates(
  availableSlots: AvailabilitySlot[]
): WeeklySlotStates {
  try {
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

export function slotsToSelectedStates(
  availableSlots: AvailabilitySlot[]
): WeeklySlotStates {
  try {
    const slotStates: WeeklySlotStates = days.map(
      () => hours.map(() => -0 as SlotStatus) // Grey out all slots
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
          slotStates[dayIndex][hourIndex] = 1; // Set the SlotStatus to 0
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
  weekBookedSessions: SessionData[]
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

export const getFilteredTopics = (
  courses: Course[],
  course_code: string,
  topics: Topic[]
) => {
  const CourseDeptId = courses?.find(
    (x) => x.course_code === course_code
  )?.department_id;
  let filteredTopics: Omit<Topic, "department_id">[] = [];
  filteredTopics = topics
    .filter((topic) => topic.department_id === CourseDeptId)
    .map(({ department_id, ...rest }) => rest);
  return filteredTopics;
};
