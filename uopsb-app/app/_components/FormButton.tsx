import React from "react";

interface FormButtonProps {
  step?: number;
  onStepChange?: (step: number) => void;
  type: "back" | "next" | "submit";
}

/**
 * The `FormButton` component is a customizable button that can be of three types: "back", "next", and "submit". It enables navigation between form steps or form submission based on the provided type.
 *
 * @component
 * @param {number} [props.step] - The current step of the form.
 * @param {(step: number) => void} [props.onStepChange] - A function to change the current step of the form.
 * @param {"back"|"next"|"submit"} props.type - The button type ("back", "next" or "submit").
 * @example
 * import FormButton from 'path/to/FormButton';
 *
 * return (
 *   <>
 *     <FormButton step={0} onStepChange={setStep} type="next" />
 *     <FormButton type="submit" />
 *   </>
 * );
 */
const FormButton: React.FC<FormButtonProps> = ({
  step,
  onStepChange,
  type,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (type === "next" || type === "back") {
      e.preventDefault(); // Prevent form submission on next/back click
      onStepChange && onStepChange(step! + (type === "next" ? 1 : -1));
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
        step ?? 0 > 0 ? "w-1/2" : "w-full" // Full width next buttonn for first step, half width for the rest
      } bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`,
    },
    submit: {
      label: "Submit",
      classes: `bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`,
    },
  };

  return (
    <button
      type={type === "submit" ? "submit" : "button"}
      onClick={(e) => handleClick(e)}
      className={buttonConfig[type].classes}
    >
      {buttonConfig[type].label}
    </button>
  );
};

export default FormButton;