import { Topic, TopicConfidence } from "@/app/types";
import React, { useState } from "react";

interface ConfidenceGridProps {
  topics: Topic[];
  onConfidenceSelect: (topicConfidence: TopicConfidence[]) => void;
}

const ConfidenceGrid: React.FC<ConfidenceGridProps> = ({
  topics,
  onConfidenceSelect,
}) => {
  const [topicConfidence, setTopicConfidence] = useState<TopicConfidence[]>(
    topics.map((topic) => ({ topic_id: topic.id, confidence_value: 0 }))
  );

  const handleConfidenceClick = (topicId: number, confidenceValue: number) => {
    const newTopicConfidence = [...topicConfidence];
    const topicIndex = newTopicConfidence.findIndex(
      (topic) => topic.topic_id === topicId
    );
    if (topicIndex !== -1) {
      newTopicConfidence[topicIndex].confidence_value = confidenceValue;
    }
    setTopicConfidence(newTopicConfidence);
    onConfidenceSelect(newTopicConfidence);
    console.log(newTopicConfidence)
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
                className={`w-full p-2 font-semibold border border-gray-300 rounded-md focus:outline-none`}
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
