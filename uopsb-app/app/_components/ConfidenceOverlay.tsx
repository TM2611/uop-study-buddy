import React from "react";
import { TopicConfidence } from "../types";
import Overlay from "./Overlay";
import ConfidenceList from "./ConfidenceList";

interface ConfidenceListOverlayProps {
  confidence: TopicConfidence[];
  setShowConfidenceOverlay: (show: boolean) => void;
}

const ConfidenceOverlay: React.FC<ConfidenceListOverlayProps> = ({
  confidence,
  setShowConfidenceOverlay,
}) => {
  return (
    <Overlay onClose={() => setShowConfidenceOverlay(false)}>
      <div>
        <h3 className="text-lg font-bold mb-4">Confidence</h3>
      </div>
      <ConfidenceList confidence={confidence} />
    </Overlay>
  );
};

export default ConfidenceOverlay;
