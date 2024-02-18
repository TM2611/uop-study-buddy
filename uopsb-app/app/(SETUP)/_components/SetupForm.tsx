"use client";
import { useAuth } from "@/app/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useFormik } from "formik";
import {
  SlotDetails,
  Course,
  FormPopulation,
  SetupFormInitValues,
} from "@/app/types";
import { TimeSlotGrid } from "./TimeSlotGrid";
import ConfidenceGrid from "./ConfidenceGrid";

function convertBooleanSlots(slotsBool: boolean[][]): SlotDetails[] {
  try {
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    let slots: SlotDetails[] = [];

    days.forEach((day, dayIndex) => {
      let startHour: number | null = null;

      slotsBool[dayIndex].forEach((hourAvailable, hourIndex) => {
        if (hourAvailable && startHour === null) {
          startHour = hourIndex;
        }

        if ((!hourAvailable || hourIndex === 23) && startHour !== null) {
          slots.push({
            day,
            start_hour: startHour,
            end_hour: hourIndex,
          });
          startHour = null;
        }
      });
    });

    return slots;
  } catch (error) {
    console.error("Error converting Boolean slots to JSON:", error);
    return [];
  }
}
const handleSubmit = async (
  values: any,
  user: any,
  router: any,
  setIsLoggedIn: any
) => {
  const jsonSlots = convertBooleanSlots(values.slots);
  values.slots = jsonSlots; // Replace the bool array with JSON array

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
  const [step, setStep] = useState(0);
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

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white p-6 rounded-md shadow-xl"
    >
      {step === 0 && (
        <>
          <div className="mb-4">
            <label
              htmlFor="year"
              className="block text-purple-700 font-bold mb-2"
            >
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
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Next
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <ConfidenceGrid
            topics={formPopulation?.topics}
            onConfidenceSelect={(updatedConfidence) =>
              formik.setFieldValue("topic_confidence", updatedConfidence)
            }
          />
          <div className="flex justify-between my-4">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="w-1/6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              style={{ marginRight: "4px" }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="mb-4">
            <label className="block text-purple-700 font-bold mb-2">
              Availability
            </label>
            <TimeSlotGrid
              onChange={(newAvailability) =>
                formik.setFieldValue("slots", newAvailability)
              }
            />

            <div className="flex justify-between my-4">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="w-1/6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                style={{ marginRight: "4px" }}
              >
                Back
              </button>
              <button
                type="submit"
                className="w-1/2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}
    </form>
  );
}

export default SetupForm;
