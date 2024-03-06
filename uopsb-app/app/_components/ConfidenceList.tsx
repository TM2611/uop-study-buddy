import { TopicConfidence } from "../types";

interface ConfidenceListProps {
  confidence: TopicConfidence[];
}

const ConfidenceList: React.FC<ConfidenceListProps> = ({ confidence }) => {
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

export default ConfidenceList;
