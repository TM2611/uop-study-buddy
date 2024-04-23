import React from "react";
import {
  UserSessionData,
  SessionTableType,
  ActionSessionStatus,
} from "@/app/types";

interface SessionActionProps {
  session: UserSessionData;
  type: SessionTableType;
  handleStatusChange?: (
    session: UserSessionData,
    status: ActionSessionStatus
  ) => void;
  handleCompletedAction?: (session: UserSessionData) => void;
}

const SessionAction: React.FC<SessionActionProps> = ({
  session,
  handleStatusChange,
  handleCompletedAction,
  type,
}) => {
  const requestAction = (
    <>
      <button
        onClick={() =>
          handleStatusChange && handleStatusChange(session, "ACCEPTED")
        }
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        Accept
      </button>
      <button
        onClick={() =>
          handleStatusChange && handleStatusChange(session, "REJECTED")
        }
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Reject
      </button>
    </>
  );

  const bookingAction = (
    <>
      <button
        onClick={() =>
          handleStatusChange && handleStatusChange(session, "CANCELLED")
        }
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    </>
  );

  const completedAction = (
    <>
      <button
        onClick={() => handleCompletedAction && handleCompletedAction(session)}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Feedback
      </button>
    </>
  );

  return type === "Requests"
    ? requestAction
    : type === "Bookings"
    ? bookingAction
    : completedAction;
};

export default SessionAction;
