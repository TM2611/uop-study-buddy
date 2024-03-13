import React from 'react';
import { SessionData } from "@/app/types";

interface SessionRequestActionProps {
  session: SessionData;
  handleAction: (session: SessionData, action: string) => void;
}

const SessionRequestAction: React.FC<SessionRequestActionProps> = ({ session, handleAction }) => {
  return (
    <>
      <button
        onClick={() => handleAction(session, "ACCEPTED")}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        Accept
      </button>
      <button
        onClick={() => handleAction(session, "REJECTED")}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Reject
      </button>
    </>
  );
};

export default SessionRequestAction;