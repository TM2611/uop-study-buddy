"use client";
import { useAuth } from "@/app/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useFormik } from "formik";
import { Course, FormPopulation } from "@/app/types";
import { TimeSlotGrid } from "./TimeSlotGrid";

const handleSubmit = async (
  values: any,
  user: any,
  router: any,
  setIsLoggedIn: any
) => {
  const mergedUserData = {
    ...user,
    ...values,
  };
  console.log("mergedUserData", mergedUserData);

  const response = await fetch("/api/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mergedUserData),
  });

  if (response.ok) {
    setIsLoggedIn(true);
    router.push("/");
  } else {
    console.log("FP ERROR");
    // Handle errors, e.g., show an error message
  }
};
export function SetupForm(formPopulation: FormPopulation) {
  const { token, setIsLoggedIn } = useAuth();
  const router = useRouter();
  const user = token ? jwtDecode(token as string) : null;
  const formik = useFormik({
    initialValues: {
      year: "",
      course: "",
      availability: Array(7)
        .fill(null)
        .map(() => Array(24).fill(false)),
    },
    onSubmit: (values) => handleSubmit(values, user, router, setIsLoggedIn),
  });
  //Redirect to home if user isn't logged in
  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token]); // Runs on initial page load and when the value of 'token' changes

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white p-6 rounded-md shadow-xl"
    >
      <div className="mb-4">
        <label htmlFor="year" className="block text-purple-700 font-bold mb-2">
          University Year
        </label>
        <select
          id="year"
          name="year"
          value={formik.values.year}
          onChange={formik.handleChange}
          className="w-full p-2 border border-purple-300 rounded-md focus:border-purple-500 focus:outline-none"
        >
          <option value="">Select a year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="course"
          className="block text-purple-700 font-bold mb-2"
        >
          Course
        </label>
        <select
          id="course"
          name="course"
          value={formik.values.course}
          onChange={formik.handleChange}
          className="w-full p-2 border border-purple-300 rounded-md focus:border-purple-500 focus:outline-none"
        >
          <option value="">Select a course</option>
          {formPopulation?.courses?.map((course: Course) => (
            <option key={course.code} value={course.code}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="gender"
          className="block text-purple-700 font-bold mb-2"
        >
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          onChange={formik.handleChange}
          className="w-full p-2 border border-purple-300 rounded-md focus:border-purple-500 focus:outline-none"
        >
          <option value="">Select a gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-purple-700 font-bold mb-2">
          Availability
        </label>
        <TimeSlotGrid
          onChange={(newAvailability) =>
            formik.setFieldValue("availability", newAvailability)
          }
        />
      </div>
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        Submit
      </button>
    </form>
  );
}

export default SetupForm;
