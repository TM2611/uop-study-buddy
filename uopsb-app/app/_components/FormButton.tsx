import React from "react";

interface FormButtonProps {
  step?: number;
  onStepChange?: (step: number) => void;
  type: "back" | "next" | "submit";
  formik: any;
}

const FormButton: React.FC<FormButtonProps> = ({
  step,
  onStepChange,
  type,
  formik,
}) => {
  const isUntouched = Object.keys(formik.touched).length === 0;

  const stepInvalid =
    (type === "next" || type === "submit") &&
    (isUntouched || !formik.dirty || !formik.isValid);

  const handleClick = (e: React.MouseEvent) => {
    if (type === "next" || type === "back") {
      e.preventDefault(); // Prevent form submission on next/back click
      formik.setTouched({}); // Reset touched fields for new step
      onStepChange && onStepChange(step! + (type === "next" ? 1 : -1));
      if (type === "back") {
        //can make this dynamic based on step if initialValues are labeled by step
        if (step === 2) {
          formik.setFieldValue("year", "");
          formik.setFieldValue("course_code", "");
          formik.setFieldValue("confidence", []);
        } else if (step === 3) {
          formik.setFieldValue("weekyAvailabilityStates", []);
          // formik.setFieldValue("slots", []);
        }
      }
    }
  };

  const buttonConfig = {
    back: {
      label: "Back",
      classes:
        "w-1/6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mr-4",
    },
    next: {
      label: "Next",
      classes: `${
        step ?? 1 === 1 ? "w-full" : "w-1/2" // Full width next buttonn for first step, half width for the rest
      } ${
        stepInvalid ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700"
      } text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`,
    },
    submit: {
      label: "Submit",
      classes: `${
        stepInvalid ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700"
      } w-1/2 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`,
    },
  };

  return (
    <button
      type={type === "submit" ? "submit" : "button"}
      onClick={(e) => handleClick(e)}
      className={buttonConfig[type].classes}
      disabled={stepInvalid}
    >
      {buttonConfig[type].label}
    </button>
  );
};

export default FormButton;
