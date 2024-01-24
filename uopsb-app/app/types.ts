export interface Course {
  code: string;
  name: string;
}

export interface FormPopulation {
  courses: Course[];
}

export interface CreateUserType {
  email: string;
  family_name: string;
  given_name: string;
  picture: string;
  year: number;
  course: string;
  gender: string;
}
