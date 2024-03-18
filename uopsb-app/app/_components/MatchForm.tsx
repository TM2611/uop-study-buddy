import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TopicConfidence } from "../types";
import { matchTypes } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const MatchFormSchema = Yup.object().shape({
  topic: Yup.string().required("Topic is required"),
  match_type: Yup.string()
    .required("Match Type is required")
    .test("is-please-select", "Please select a match type", function (value) {
      return value !== "Please select";
    })
    .test(
      "is-confidence-allowed",
      "Confidence match type is not allowed for 'No Topic'",
      function (value) {
        const topic = this.parent.topic;
        return !(topic === "No Topic" && value === "Confidence");
      }
    ),
});

const initialValues = {
  topic: "Please select",
  match_type: "Please select",
  topic_id: "",
};

interface MatchFormProps {
  activeUserConfidence: TopicConfidence[];
}
type MatchFormValuesType = Yup.InferType<typeof MatchFormSchema> & {
  topic_id: string;
};

const handleMatchClick = async (
  values: MatchFormValuesType,
  router: AppRouterInstance
) => {
  const topic = values.topic;
  const topic_id = values.topic_id;
  const match_type = values.match_type;

  if (!match_type) {
    console.log("Invalid request");
    return;
  }
  router.push(
    `/study/users?topic=${topic}&topic_id=${topic_id}&match_type=${match_type}`
  );
};

const MatchForm: React.FC<MatchFormProps> = ({ activeUserConfidence }) => {
  const router = useRouter();
  const [isTopicSelected, setIsTopicSelected] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={MatchFormSchema}
      onSubmit={(values) => {
        console.log(values);
        handleMatchClick(values, router);
      }}
    >
      {(formik) => {
        const { errors, touched, isValid, dirty } = formik;
        return (
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Find a Study Buddy</h1>
            <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-xl font-semibold mb-2">
                Select a Topic to Study:
              </h2>
              <div className="mb-4">
                <Field
                  as="select"
                  name="topic"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    formik.handleChange(e);
                    const selectedOption =
                      e.target.options[e.target.selectedIndex];
                    const topicId = selectedOption.getAttribute("data-id");
                    if (topicId) {
                      formik.setFieldValue("topic_id", topicId);
                    }
                    setIsTopicSelected(e.target.value !== "Please select");
                  }}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                >
                  <option value={initialValues.topic} disabled>
                    Please select
                  </option>
                  {activeUserConfidence.map((x) => (
                    <option
                      key={x.topic_name}
                      value={x.topic_name}
                      data-id={x.topic_id.toString()}
                    >
                      {x.topic_name}
                    </option>
                  ))}
                  <option key="No Topic" value="No Topic">
                    No Topic
                  </option>
                </Field>
              </div>

              <h2 className="text-xl font-semibold mb-2">Select Match Type:</h2>
              <div className="mb-4">
                <Field
                  as="select"
                  name="match_type"
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                  disabled={!isTopicSelected}
                >
                  <option value={initialValues.match_type} disabled>
                    Please select
                  </option>
                  {matchTypes.map((matchType) => (
                    <option
                      key={matchType}
                      value={matchType}
                      disabled={
                        formik.values.topic === "No Topic" &&
                        matchType === "Confidence"
                      }
                    >
                      {matchType}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="match_type"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  !(dirty && isValid) ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!(dirty && isValid)}
              >
                Match
              </button>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default MatchForm;
