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

export interface SlotDetails {
  day: string;
  start_hour: number;
  end_hour: number;
}

export interface UserProfileType extends UserType {
  slots: [SlotDetails];
  topic_confidence: TopicConfidence[];
}

export interface TopicConfidence {
  topic_id: number;
  topic_name: string;
  confidence_value: number;
}

export interface SetupFormInitValues {
  year: string;
  course_code: string;
  gender: string;
  slots: boolean[][];
  topic_confidence: TopicConfidence[];
}
