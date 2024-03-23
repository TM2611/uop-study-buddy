export interface Course {
  course_code: string;
  name: string;
  department_id: string;
  level: "UG" | "PG";
}

export interface Topic {
  topic_name: string;
  topic_id: number;
  department_id: String;
}

export type SelectedTopic = {
  name: string;
  id: string;
};

export interface FormPopulation {
  courses: Course[];
  topics: Topic[];
}

export interface UserType {
  email: string;
  family_name: string;
  given_name: string;
  picture: string;
  year: number;
  course_code: string;
}

export interface AvailabilitySlot {
  day: string;
  start_hour: number;
  end_hour: number;
}

export interface SessionSlot extends AvailabilitySlot {
  date: string;
}

export interface SessionData {
  start_hour: number;
  end_hour: number;
  date: string;
  status: string;
  session_id: number;
  requester_id: string;
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
  course_code: string;
  course_name: string;
  topic_name: string;
  requester_confidence: number;
}
export type SessionTableType = "Requests" | "Bookings";

export type SessionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export interface UserProfileType extends UserType {
  slots: [AvailabilitySlot];
  confidence: TopicConfidence[];
}

export interface TopicConfidence {
  topic_id: number;
  topic_name: string;
  confidence_value: number;
}

const SlotStatusMap = {
  available: 0,
  unavailable: -1,
  selected: 1,
  booked: 2,
};

export type SlotStatus = (typeof SlotStatusMap)[keyof typeof SlotStatusMap];
type DailySlotStates = SlotStatus[];
export type WeeklySlotStates = DailySlotStates[];

export interface SetupFormInitValues {
  year: string;
  course_code: string;
  weekyAvailabilityStates: DailySlotStates[];
  confidence: TopicConfidence[];
}

export type MatchType = "Department" | "Confidence" | "Similarity";

export type UserAvailabilityConfidence = UserType & {
  availability_slots: AvailabilitySlot[];
  confidence: TopicConfidence[];
  bookings: SessionData[]
};
