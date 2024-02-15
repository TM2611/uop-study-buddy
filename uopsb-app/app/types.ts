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
