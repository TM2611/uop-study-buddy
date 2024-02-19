import React, { useState } from 'react';
import FormButton from './FormButton';

interface FormProps {
  steps: React.ReactNode[];
  onSubmit: () => void;
}

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