import FormButton from "@/app/_components/FormButton";

interface FormNavigationProps {
  activeStep: number;
  stepCount: number;
  formik: any;
  handleStepChange: (step: number) => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  activeStep,
  stepCount,
  formik,
  handleStepChange,
}) => {
  return (
    <div className="flex justify-between my-4 w-full">
      {activeStep > 1 && (
        <FormButton
          step={activeStep}
          onStepChange={handleStepChange}
          type="back"
          formik={formik}
        />
      )}
      {activeStep < stepCount ? (
        <FormButton
          step={activeStep}
          onStepChange={handleStepChange}
          type="next"
          formik={formik}
        />
      ) : (
        <FormButton type="submit" formik={formik} />
      )}
    </div>
  );
};

export default FormNavigation;
