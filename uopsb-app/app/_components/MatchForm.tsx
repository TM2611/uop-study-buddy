import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TopicConfidence, UserType } from "../types";
import { matchTypes } from "@/lib/constants";
import { extractUpNum } from "@/lib/utils";
import { useAuth } from "@/app/AuthContext";

const MatchFormSchema = Yup.object().shape({
  topic: Yup.string().required("Topic is required"),
  match_type: Yup.string().required("Match Type is required"),
});

const initialValues = {
  topic: "Please select",
  match_type: "Please select",
};

interface MatchFormProps {
  activeUserConfidence: TopicConfidence[];
}
type MatchFormValuesType = Yup.InferType<typeof MatchFormSchema>;

const handleMatchClick = async (
  values: MatchFormValuesType,
  user: UserType,
  setMatchedUsers: React.Dispatch<React.SetStateAction<UserType[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const topic = values.topic;
  const match_type = values.match_type;
  const user_id = extractUpNum(user.email);

  if (!user_id || !topic || !match_type) {
    console.log("Invalid request");
    return;
  }
  setIsLoading(true);
  const res = await fetch(
    `/api/match?id=${user_id}&topic=${topic}&match_type=${match_type}`
  );
  const users = await res.json();
  setMatchedUsers(users);
  setIsLoading(false);
  console.log(users);
};

const MatchForm: React.FC<MatchFormProps> = ({ activeUserConfidence }) => {
  const [matchedUsers, setMatchedUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-3xl">Loading...</div>
        </div>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={MatchFormSchema}
        onSubmit={(values) => {
          console.log(values);
          handleMatchClick(values, user, setMatchedUsers, setIsLoading);
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
                      topicId
                        ? formik.setFieldValue("topic_id", topicId)
                        : formik.setFieldValue("topic_id", null);
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

                <h2 className="text-xl font-semibold mb-2">
                  Select Match Type:
                </h2>
                <div className="mb-4">
                  <Field
                    as="select"
                    name="match_type"
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                  >
                    <option value={initialValues.match_type} disabled>
                      Please select
                    </option>
                    {matchTypes.map((matchType) => (
                      <option key={matchType} value={matchType}>
                        {matchType}
                      </option>
                    ))}
                  </Field>
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
    </>
  );
};

export default MatchForm;
