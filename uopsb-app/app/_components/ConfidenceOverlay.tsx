import React from "react";
import { TopicConfidence } from "../types";
import Overlay from "./Overlay";

interface ConfidenceListOverlayProps {
  confidence: TopicConfidence[];
  setShowConfidence: (show: boolean) => void;
}

const ConfidenceOverlay: React.FC<ConfidenceListOverlayProps> = ({
  confidence,
  setShowConfidence,
}) => {
  return (
    <Overlay onClose={() => setShowConfidence(false)}>
      <div>
        <h3 className="text-lg font-bold mb-4">Confidence</h3>
      </div>
      <ul className="space-y-1">
        {confidence.map((topic, index) => (
          <li key={index} className="text-gray-700 text-xs">
            {topic.topic_name}: {topic.confidence_value}
          </li>
        ))}
      </ul>
    </Overlay>
  );
};

export default ConfidenceOverlay;
