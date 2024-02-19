import React, { useState } from 'react';
import FormButton from './FormButton';

interface FormProps {
  steps: React.ReactNode[];
  onSubmit: () => void;
}

/**
 * The `Form` component is a higher-order component that wraps the individual form steps and handles the navigation between steps and form submission. It expects the `steps` and `onSubmit` callback as props to manage the form steps.
 *
 * @component
 * @example
 * import Form from 'path/to/Form';
 *
 * const steps = [
 *   <div>This is step 1</div>,
 *   <div>This is step 2</div>,
 *   <div>This is step 3</div>,
 * ];
 *
 * const handleSubmit = () => {
 *   console.log("Do something on form submit");
 * };
 *
 * return (
 *   <Form steps={steps} onSubmit={handleSubmit} />
 * );
 */
const Form: React.FC<FormProps> = ({ steps, onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = (newStep: number) => {
    setActiveStep(newStep);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-xl">
        {steps[activeStep]}
        <div className="flex justify-between my-4">
          {activeStep > 0 && (
            <FormButton
              step={activeStep}
              onStepChange={handleStepChange}
              type="back"
            />
          )}
          {activeStep < steps.length - 1 ? (
            <FormButton
              step={activeStep}
              onStepChange={handleStepChange}
              type="next"
            />
          ) : (
            <FormButton type="submit" />
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;