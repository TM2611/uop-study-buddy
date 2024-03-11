export interface Course {
  course_code: string;
  name: string;
  department_id: string;
}

export interface Topic {
  name: string;
  id: number;
  department_id: String;
}

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
  gender: string;
}

export interface AvailabilitySlot {
  day: string;
  start_hour: number;
  end_hour: number;
}

export interface SessionSlot extends AvailabilitySlot {
  date: string;
}

export interface UserProfileType extends UserType {
  slots: [AvailabilitySlot];
  topic_confidence: TopicConfidence[];
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
  gender: string;
  weekyAvailabilityStates: DailySlotStates[];
  topic_confidence: TopicConfidence[];
}
