import {
  AvailabilitySlot,
  Course,
  SessionData,
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

const mockBookedSessions: SessionData[] = [
  {
    start_hour: 10,
    end_hour: 11,
    date: "2024-03-20",
    status: "ACCEPTED",
    session_id: 1,
    requester_id: "932759",
    email: "up932759@myport.ac.uk",
    given_name: "Jenny",
    family_name: "Smith",
    picture: "https://randomuser.me/api/portraits/women/2.jpg",
    course_code: "U0968PYC",
    course_name: "Software Engineering",
    topic_name: "Software Engineering and Design Patterns",
    requester_confidence: 4,
  },
  {
    start_hour: 14,
    end_hour: 15,
    date: "2024-03-20",
    status: "ACCEPTED",
    session_id: 2,
    requester_id: "932759",
    email: "up932759@myport.ac.uk",
    given_name: "Jenny",
    family_name: "Smith",
    picture: "https://randomuser.me/api/portraits/women/2.jpg",
    course_code: "U0968PYC",
    course_name: "Software Engineering",
    topic_name: "Architecture and Operating Systems",
    requester_confidence: 4,
  },
];

const expectedSlotIndexes: [number, number][] = [
  [2, 3],
  [2, 7],
];

export const availabilitySlotsToStates = [
  {
    input: expectedAvailabilitySlots1,
    expected: mockWeeklySlotStates1,
  },
];

export const statesToAvailabilitySlots = [
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
