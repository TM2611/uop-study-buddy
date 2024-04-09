import {
  AvailabilitySlot,
  Course,
  UserSessionData,
  SessionSlot,
  SlotStatus,
  Topic,
  WeeklySlotStates,
} from "@/app/types";
import { days } from "../../constants";

const mockWeeklySlotStates1: WeeklySlotStates = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, 0, 0, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

const mockWeeklySlotStates2: WeeklySlotStates = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 0, 2, 0, 0, 0, 2, 1, 0, 0, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, 0, 0, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

const expectedAvailabilitySlots1: AvailabilitySlot[] = [
  {
    day: "WED",
    start_hour: 9,
    end_hour: 18,
  },
  {
    day: "THU",
    start_hour: 15,
    end_hour: 17,
  },
];

const expectedAvailabilitySlots2: AvailabilitySlot[] = [
  {
    day: "WED",
    start_hour: 15,
    end_hour: 16,
  },
];

const mockBookedSessions: UserSessionData[] = [
  {
    start_hour: 17,
    end_hour: 18,
    date: "2024-04-10T23:00:00.000Z",
    status: "ACCEPTED",
    session_id: 8,
    partner_id: "932759",
    is_user_request: false,
    email: "up932759@myport.ac.uk",
    given_name: "Jenny",
    family_name: "Smith",
    picture: "https://randomuser.me/api/portraits/women/2.jpg",
    course_code: "U0968PYC",
    course_name: "Software Engineering",
    topic_name: "Data Structures and Algorithms",
    partner_confidence: 5,
  },
];

const expectedSlotIndexes: [number, number][] = [[3, 10]];

export const slotsToAvailableStates = [
  {
    input: expectedAvailabilitySlots1,
    expected: mockWeeklySlotStates1,
  },
];

export const weeklyStatesToSelectedSlots = [
  {
    input: mockWeeklySlotStates2,
    expected: expectedAvailabilitySlots2,
  },
];

export const getBookedSlotIndexes = [
  {
    input: mockBookedSessions,
    expected: expectedSlotIndexes,
  },
];
