import React from "react";
import { UserSessionData, SessionStatus, SessionTableType } from "@/app/types";

interface SessionActionProps {
  session: UserSessionData;
  handleAction: (session: UserSessionData, status: SessionStatus) => void;
  type: SessionTableType;
}

const SessionAction: React.FC<SessionActionProps> = ({
  session,
  handleAction,
  type,
}) => {
  const requestAction = (
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

  const bookingAction = (
    <>
      <button
        onClick={() => handleAction(session, "CANCELLED")}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    </>
  );

  return type === "Requests" ? requestAction : bookingAction;
};

export default SessionAction;
