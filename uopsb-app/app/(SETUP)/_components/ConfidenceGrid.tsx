import { Topic, TopicConfidence } from "@/app/types";
import React, { useState } from "react";

interface ConfidenceGridProps {
  topics: Topic[];
  onConfidenceSelect: (topicConfidence: TopicConfidence[]) => void;
}

interface TopicConfidenceButton extends TopicConfidence {
  buttonColor: string;
}

const ConfidenceGrid: React.FC<ConfidenceGridProps> = ({
  topics,
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
      {topics.map((topic, topicIndex) => (
        <div key={topic.id} className="flex flex-col items-start gap-2">
          <span className="text-lg font-semibold">{topic.name}</span>
          <div className="grid grid-cols-5 gap-2 text-sm">
            {[1, 2, 3, 4, 5].map((confidenceValue) => (
              <button
                key={confidenceValue}
                type="button"
                onClick={() => handleConfidenceClick(topic.id, confidenceValue)}
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
