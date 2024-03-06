"use client";
import { useAuth } from "@/app/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useFormik } from "formik";
import {
  AvailabilitySlot,
  Course,
  FormPopulation,
  SetupFormInitValues,
} from "@/app/types";

import AvailabilitySelection from "./AvailabilitySelection";
import ConfidenceGrid from "./ConfidenceGrid";
import Form from "@/app/_components/Form";
import { convertBooleanSlots } from "@/lib/utils";

const handleSubmit = async (
  values: any,
  user: any,
  router: any,
  setIsLoggedIn: any
) => {
  const availabilitySlots = convertBooleanSlots(values.slots);
  values.slots = availabilitySlots; // Replace the bool array with JSON array
  const userProfile = {
    ...user,
    ...values,
  };

  const response = await fetch("/api/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userProfile),
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
  const initialValues: SetupFormInitValues = {
    year: "",
    course_code: "",
    gender: "",
    slots: Array(7)
      .fill(null)
      .map(() => Array(24).fill(false)),
    topic_confidence: [],
  };
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleSubmit(values, user, router, setIsLoggedIn),
  });
  //Redirect to home if user isn't logged in
  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token]); // Runs on initial page load and when the value of 'token' changes

  const step1 = (
    <>
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
          name="course_code"
          value={formik.values.course_code}
          onChange={formik.handleChange}
          className="w-full p-2 border border-purple-300 rounded-md focus:border-purple-500 focus:outline-none"
        >
          <option value="">Select a course</option>
          {formPopulation?.courses?.map((course: Course) => (
            <option key={course.course_code} value={course.course_code}>
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
          value={formik.values.gender}
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
    </>
  );

  const step2 = (
    <>
      <ConfidenceGrid
        topics={formPopulation?.topics}
        courses={formPopulation?.courses}
        course_code={formik.values.course_code}
        onConfidenceSelect={(updatedConfidence) =>
          formik.setFieldValue("topic_confidence", updatedConfidence)
        }
      />
    </>
  );

  const step3 = (
    <>
      <div className="mb-4">
        <label className="block text-purple-700 font-bold mb-2">
          Availability
        </label>
        <AvailabilitySelection
          onChange={(newSlotStates) =>
            formik.setFieldValue("slots", newSlotStates)
          }
        />
      </div>
    </>
  );

  return <Form steps={[step1, step2, step3]} onSubmit={formik.handleSubmit} />;
}

export default SetupForm;
