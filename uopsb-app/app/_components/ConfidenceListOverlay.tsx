import React from "react";
import { TopicConfidence } from "../types";

interface ConfidenceListOverlayProps {
  confidence: TopicConfidence[];
}

const ConfidenceListOverlay: React.FC<ConfidenceListOverlayProps> = ({
  confidence,
}) => {
  return (
    <ul className="space-y-1">
      {confidence.map((topic, index) => (
        <li key={index} className="text-gray-700 text-xs">
          {topic.topic_name}: {topic.confidence_value}
        </li>
      ))}
    </ul>
  );
};

export default ConfidenceListOverlay;
