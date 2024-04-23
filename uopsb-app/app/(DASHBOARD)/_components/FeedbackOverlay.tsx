import React, { useState } from "react";
import Overlay from "@/app/_components/Overlay";
import { UserSessionData } from "@/app/types";

interface FeedbackOverlayProps {
  session: UserSessionData;
  setShowFeedbackOverlay: (arg0: boolean) => void;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  session,
  setShowFeedbackOverlay,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = () => {
    // Submit feedback to the server
    console.log("Session ID: ", session.session_id);
    console.log({ rating, feedback });
  };

  return (
    <Overlay onClose={() => setShowFeedbackOverlay(false)}>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">Leave Feedback</h2>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleStarClick(star)}
              className={`mx-1 text-2xl ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          className="w-full h-32 mb-4 p-2 border rounded"
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        >
          Submit
        </button>
      </div>
    </Overlay>
  );
};

export default FeedbackOverlay;
