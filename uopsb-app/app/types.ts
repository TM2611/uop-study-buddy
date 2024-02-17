export interface Course {
  code: string;
  name: string;
}

export interface FormPopulation {
  courses: Course[];
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
}

export interface SetupFormInitValues {
  year: string;
  course_code: string;
  gender: string;
  slots: boolean[][];
}
