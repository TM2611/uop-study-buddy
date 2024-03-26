import {
  Topic,
  TopicConfidence,
  Course,
  UserAvailabilityConfidence,
} from "@/app/types";
import React, { useEffect, useState } from "react";

interface ConfidenceGridProps {
  userAvailabilityConfidence?: UserAvailabilityConfidence;
  filteredTopics: Omit<Topic, "department_id">[];
  onConfidenceSelect: (topicConfidence: TopicConfidenceButton[]) => void;
}

export interface TopicConfidenceButton extends TopicConfidence {
  buttonColor: string;
}

const buttonConfig: { [key: number]: string } = {
  1: "bg-red-500",
  2: "bg-orange-400",
  3: "bg-yellow-300",
  4: "bg-green-300",
  5: "bg-green-500",
};

const ConfidenceGrid: React.FC<ConfidenceGridProps> = ({
  userAvailabilityConfidence,
  onConfidenceSelect,
  filteredTopics,
}) => {
  const initalTopicConfidence = !userAvailabilityConfidence
    ? filteredTopics.map((topic) => ({
        topic_id: topic.topic_id,
        topic_name: topic.topic_name,
        confidence_value: 0,
        buttonColor: "",
      }))
    : userAvailabilityConfidence.confidence.map((topic) => ({
        topic_id: topic.topic_id,
        topic_name: topic.topic_name,
        confidence_value: topic.confidence_value,
        buttonColor: buttonConfig[topic.confidence_value] || "",
      }));

  const [topicConfidence, setTopicConfidence] = useState<
    TopicConfidenceButton[]
  >(initalTopicConfidence);

  const handleConfidenceClick = (topicId: number, confidenceValue: number) => {
    const newTopicConfidence = [...topicConfidence];
    const topicIndex = newTopicConfidence.findIndex(
      (topic) => topic.topic_id === topicId
    );
    if (topicIndex !== -1) {
      newTopicConfidence[topicIndex].confidence_value = confidenceValue;

      newTopicConfidence[topicIndex].buttonColor =
        buttonConfig[confidenceValue] || "";
    }

    setTopicConfidence(newTopicConfidence);
    onConfidenceSelect(newTopicConfidence);
  };

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      <div className="mb-4">
        <p className="mb-4">
          Below is a list of topics related to your selected course. Rate your
          confidence in each topic on a scale from 1 to 5:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
          <div className="w-full text-center shadow py-2 px-2 font-semibold text-red-500 bg-red-200 rounded-md">
            1: Very Low Confidence
          </div>
          <div className="w-full text-center shadow py-2 px-2 font-semibold text-orange-500 bg-orange-200 rounded-md">
            2: Low Confidence
          </div>
          <div className="w-full text-center shadow py-2 px-2 font-semibold text-yellow-500 bg-yellow-200 rounded-md">
            3: Moderate Confidence
          </div>
          <div className="w-full text-center shadow py-2 px-2 font-semibold text-green-500 bg-green-200 rounded-md">
            4: High Confidence
          </div>
          <div className="w-full text-center shadow py-2 px-2 font-semibold text-green-700 bg-green-300 rounded-md">
            5: Very High Confidence
          </div>
        </div>
      </div>

      {topicConfidence.map((topic, topicIndex) => (
        <div key={topic.topic_id} className="flex flex-col items-start gap-2">
          <span className="text-lg font-semibold">{topic.topic_name}</span>
          <div className="grid grid-cols-5 gap-2 text-sm">
            {[1, 2, 3, 4, 5].map((confidenceValue) => (
              <button
                key={confidenceValue}
                type="button"
                onClick={() =>
                  handleConfidenceClick(topic.topic_id, confidenceValue)
                }
                className={`w-full p-2 font-semibold border border-gray-300 rounded-md focus:outline-none ${
                  topic.confidence_value === confidenceValue
                    ? topic.buttonColor
                    : ""
                }`}
              >
                {confidenceValue}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConfidenceGrid;
