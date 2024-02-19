import { Topic, TopicConfidence, Course } from "@/app/types";
import React, { useState } from "react";

interface ConfidenceGridProps {
  topics: Topic[];
  courses: Course[];
  course_code: string;
  onConfidenceSelect: (topicConfidence: TopicConfidence[]) => void;
}

interface TopicConfidenceButton extends TopicConfidence {
  buttonColor: string;
}

const ConfidenceGrid: React.FC<ConfidenceGridProps> = ({
  topics,
  courses,
  course_code,
  onConfidenceSelect,
}) => {
  const [topicConfidence, setTopicConfidence] = useState<
    TopicConfidenceButton[]
  >(
    topics.map((topic) => ({
      topic_id: topic.id,
      confidence_value: 0,
      buttonColor: "",
    }))
  );

  const CourseDeptId = courses?.find(
    (x) => x.course_code === course_code
  )?.department_id;

  const handleConfidenceClick = (topicId: number, confidenceValue: number) => {
    const newTopicConfidence = [...topicConfidence];
    const topicIndex = newTopicConfidence.findIndex(
      (topic) => topic.topic_id === topicId
    );
    if (topicIndex !== -1) {
      newTopicConfidence[topicIndex].confidence_value = confidenceValue;

      switch (confidenceValue) {
        case 1:
          newTopicConfidence[topicIndex].buttonColor = "bg-red-500";
          break;
        case 2:
          newTopicConfidence[topicIndex].buttonColor = "bg-orange-400";
          break;
        case 3:
          newTopicConfidence[topicIndex].buttonColor = "bg-yellow-300";
          break;
        case 4:
          newTopicConfidence[topicIndex].buttonColor = "bg-green-300";
          break;
        case 5:
          newTopicConfidence[topicIndex].buttonColor = "bg-green-500";
          break;
        default:
          newTopicConfidence[topicIndex].buttonColor = "";
      }
    }

    setTopicConfidence(newTopicConfidence);
    onConfidenceSelect(newTopicConfidence);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
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
      {topics
        .filter((topic) => topic.department_id === CourseDeptId)
        .map((topic, topicIndex) => (
          <div key={topic.id} className="flex flex-col items-start gap-2">
            <span className="text-lg font-semibold">{topic.name}</span>
            <div className="grid grid-cols-5 gap-2 text-sm">
              {[1, 2, 3, 4, 5].map((confidenceValue) => (
                <button
                  key={confidenceValue}
                  type="button"
                  onClick={() =>
                    handleConfidenceClick(topic.id, confidenceValue)
                  }
                  className={`w-full p-2 font-semibold border border-gray-300 rounded-md focus:outline-none ${
                    topicConfidence[topicIndex].confidence_value ===
                    confidenceValue
                      ? topicConfidence[topicIndex].buttonColor
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
