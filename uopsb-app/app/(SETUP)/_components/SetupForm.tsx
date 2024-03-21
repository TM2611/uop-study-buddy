"use client";
import {
  Course,
  FormPopulation,
  TopicConfidence,
  WeeklySlotStates,
} from "@/app/types";
import { Formik, Form, Field, ErrorMessage, FormikTouched } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import FormNavigation from "./FormNavigation";
import ConfidenceGrid from "./ConfidenceGrid";
import { getFilteredTopics, weeklyStatesToSelectedSlots } from "@/lib/utils";
import AvailabilitySelection, {
  isAvailabilityChosen,
} from "./AvailabilitySelection";
import { useAuth } from "@/app/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const initialValues = {
  year: "Select a year",
  course_code: "Select a course",
  confidence: [] as TopicConfidence[],
  weekyAvailabilityStates: Array(7)
    .fill(null)
    .map(() => Array(24).fill(0)),
};

export default function SetupForm(formPopulation: FormPopulation) {
  const [activeStep, setActiveStep] = useState(1);
  const [courseCode, setCourseCode] = useState("");
  const stepCount = 3;

  const { token, setIsLoggedIn } = useAuth();
  const router = useRouter();
  const user = token ? jwtDecode(token as string) : null;

  const filteredTopics = getFilteredTopics(
    formPopulation.courses,
    courseCode,
    formPopulation.topics
  );

  const Step1Schema = Yup.object().shape({
    year: Yup.string()
      .required("Year is required")
      .notOneOf(["Select a year"], "Year is required"),
    course_code: Yup.string()
      .required("Required")
      .notOneOf(["Select a course"], "Course is required"),
  });

  const Step2Schema = Yup.object().shape({
    confidence: Yup.array()
      .of(
        Yup.object().shape({
          topic: Yup.string(),
          confidence: Yup.number(),
        })
      )
      .required("Required")
      .test(
        "confidenceLength",
        "Please select confidence for all topics",
        function (value) {
          return value && value.length === filteredTopics.length;
        }
      ),
  });

  const Step3Schema = Yup.object().shape({
    weekyAvailabilityStates: Yup.array()
      .of(Yup.array().of(Yup.number().required("Required")))
      .test(
        "at-least-one-slot",
        "Please select at least one availability slot",
        (weekyAvailabilityStates) => {
          // Check if at least one slot is selected
          if (!weekyAvailabilityStates) return false;
          const isAvail = isAvailabilityChosen(
            weekyAvailabilityStates as WeeklySlotStates
          );
          return isAvail;
        }
      ),
  });
  const validationSchemas = [Step1Schema, Step2Schema, Step3Schema];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas[activeStep - 1]}
      onSubmit={async (values) => {
        const availableSlots = weeklyStatesToSelectedSlots(
          values.weekyAvailabilityStates
        );
        const { weekyAvailabilityStates, ...tempValues } = values;
        const newValues: any = tempValues;
        newValues.slots = availableSlots; // Replace the states with slots
        const userProfile = {
          ...user,
          ...newValues,
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
        }
      }}
    >
      {(formik) => {
        const { errors, touched, isValid, dirty } = formik;

        const handleStepChange = (newStep: number) => {
          setActiveStep(newStep);
        };

        const step1 = (
          <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-full">
              <div className="mb-4">
                <label
                  htmlFor="year"
                  className="block text-purple-700 font-bold mb-2"
                >
                  University Year
                </label>
                <Field
                  as="select"
                  name="year"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    formik.handleChange(e);
                    const selectedOption =
                      e.target.options[e.target.selectedIndex];
                    formik.setFieldValue("year", selectedOption.value);
                  }}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select a year</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">Postgraduate</option>
                </Field>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="course_code"
                  className="block text-purple-700 font-bold mb-2"
                >
                  Course
                </label>
                <Field
                  as="select"
                  name="course_code"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    formik.handleChange(e);
                    const selectedOption =
                      e.target.options[e.target.selectedIndex];
                    formik.setFieldValue("course_code", selectedOption.value);
                    setCourseCode(selectedOption.value);
                  }}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select a course</option>
                  {formPopulation?.courses
                    ?.filter((course: Course) =>
                      formik.values.year === "4"
                        ? course.level === "PG"
                        : course.level === "UG"
                    )
                    .map((course: Course) => (
                      <option
                        key={course.course_code}
                        value={course.course_code}
                      >
                        {course.name}
                      </option>
                    ))}
                </Field>
              </div>
            </div>
            <FormNavigation
              activeStep={activeStep}
              handleStepChange={handleStepChange}
              stepCount={stepCount}
              formik={formik}
            />
          </div>
        );

        const step2 = (
          <div className="w-full">
            <ConfidenceGrid
              filteredTopics={filteredTopics}
              onConfidenceSelect={async (updatedConfidence) => {
                // Set touched for all confidence fields
                formik.setTouched({
                  ...formik.touched,
                  confidence: initialValues.confidence.map(() => ({
                    topic: true,
                    confidenceLevel: true,
                  })) as FormikTouched<TopicConfidence>[],
                });
                const selectionCount = updatedConfidence.filter(
                  (x) => x.confidence_value
                );

                if (selectionCount.length === filteredTopics.length) {
                  // All topics have been selected
                  formik.setErrors({});
                  formik.setFieldValue("confidence", updatedConfidence);
                }
              }}
            />
            <FormNavigation
              activeStep={activeStep}
              handleStepChange={handleStepChange}
              stepCount={stepCount}
              formik={formik}
            />
          </div>
        );

        const step3 = (
          <>
            <div className="mb-4">
              <label className="block text-purple-700 font-bold mb-2">
                Availability
              </label>
              <AvailabilitySelection
                onChange={(newSlotStates) => {
                  // Set touched for all availability fields
                  formik.setTouched({
                    ...formik.touched,
                    weekyAvailabilityStates: newSlotStates.map(
                      (dailySlotStates) => dailySlotStates.map(() => true)
                    ),
                  });
                  if (!isAvailabilityChosen(newSlotStates)) {
                    formik.setErrors({
                      weekyAvailabilityStates:
                        "Please select at least one availability slot",
                    });
                  }
                  // At least one slot is selected
                  formik.setFieldValue(
                    "weekyAvailabilityStates",
                    newSlotStates
                  );
                }}
              />
              <FormNavigation
                activeStep={activeStep}
                handleStepChange={handleStepChange}
                stepCount={stepCount}
                formik={formik}
              />
            </div>
          </>
        );

        const steps = [step1, step2, step3];
        return (
          <>
            <div className="min-h-screen flex items-center justify-center">
              <Form
                onSubmit={formik.handleSubmit}
                className="bg-white p-6 rounded-md max-w-1/2"
              >
                {steps[activeStep - 1]}
              </Form>
            </div>
          </>
        );
      }}
    </Formik>
  );
}
