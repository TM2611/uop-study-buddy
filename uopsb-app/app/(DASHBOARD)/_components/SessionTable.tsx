import React, { useState } from "react";
import {
  UserSessionData,
  SessionTableType,
  UserType,
  ActionSessionStatus,
} from "@/app/types";
import CircularNumberIcon from "@/app/_components/CircularNumberIcon";
import SessionUser from "./SessionUser";
import SessionDate from "./SessionDate";
import SessionAction from "./SessionAction";
import FeedbackOverlay from "./FeedbackOverlay";

interface SessionTableProps {
  receivedRequests: UserSessionData[];
  sessionBookings: UserSessionData[];
  completedSessions: UserSessionData[];
  setCompletedSessions: (completedSessions: UserSessionData[]) => void;
  setReceivedRequests: (receivedRequests: UserSessionData[]) => void;
  setSessionBookings: (sessionBookings: UserSessionData[]) => void;
  setShowBookingsTable: (showBookingsTable: boolean) => void;
  setShowCompletedTable: (showCompletedTable: boolean) => void;
  currentUser: UserType;
  type: SessionTableType;
}

const SessionTable: React.FC<SessionTableProps> = ({
  receivedRequests,
  setReceivedRequests,
  sessionBookings,
  setSessionBookings,
  setShowBookingsTable,
  completedSessions,
  setCompletedSessions,
  setShowCompletedTable,
  currentUser,
  type,
}) => {
  const [showFeedbackOverlay, setShowFeedbackOverlay] = useState(false);
  const sessions =
    type === "Requests"
      ? receivedRequests
      : type === "Bookings"
      ? sessionBookings
      : completedSessions;

  const [activeCompletedSesssion, setActiveCompletedSession] =
    useState<UserSessionData | null>(null);

  const handleStatusChange = async (
    session: UserSessionData,
    newStatus: ActionSessionStatus
  ) => {
    const sessionID = session.session_id;

    const res = await fetch(`/api/session`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partner: currentUser,
        session,
        newStatus: newStatus,
      }),
    });
    if (res.ok) {
      const data = await res.text();
      console.log(data);

      if (newStatus === "CANCELLED") {
        // SessionBookingTable Action - remove cancelled session from bookings
        const newSessionBookings = sessionBookings.filter(
          (s) => s.session_id !== sessionID
        );
        setSessionBookings(newSessionBookings);
      } else {
        // SessionRequestTable Action - remove accepted/rejected session from requests
        const newSessionRequests = receivedRequests.filter(
          (s) => s.session_id !== sessionID
        );
        setReceivedRequests(newSessionRequests);

        if (newStatus === "ACCEPTED") {
          // SessionRequestTable Action - add accepted session to bookings
          const newSessionBookings = [...sessionBookings, session];
          setSessionBookings(newSessionBookings);
        }
      }
    }
  };

  const handleCompletedAction = (session: UserSessionData) => {
    setShowFeedbackOverlay(true);
    setActiveCompletedSession(session);
  };

  const completedAction = (session: UserSessionData) => {
    return (
      <SessionAction
        session={session}
        handleCompletedAction={handleCompletedAction}
        type={type}
      />
    );
  };

  const statusAction = (
    session: UserSessionData,
    handleStatusChange: (
      session: UserSessionData,
      newStatus: ActionSessionStatus
    ) => void
  ) => {
    return (
      <SessionAction
        session={session}
        handleStatusChange={handleStatusChange}
        type={type}
      />
    );
  };

  const handleViewTable = (type: SessionTableType) => {
    if (type === "Completed") {
      setShowCompletedTable(true);
      setShowBookingsTable(false);
    } else if (type === "Bookings") {
      setShowBookingsTable(true);
      setShowCompletedTable(false);
    }
  };

  return (
    <div>
      <section className={`${type === "Requests" ? "mb-20" : ""}`}>
        <div className="flex  justify-between">
          <h2 className="text-xl font-semibold my-4">
            <span className=" mx-1 my-2">{`Session ${type}`}</span>
            <CircularNumberIcon number={sessions.length} />
          </h2>
          {type !== "Requests" && (
            <button
              className="h-10 bg-blue-600 text-white px-4 py-2 m-3 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              onClick={() =>
                handleViewTable(type === "Completed" ? "Bookings" : "Completed")
              }
            >
              {`View ${type === "Completed" ? "Bookings" : "Completed"}`}
            </button>
          )}
        </div>
        <div
          className="table-container"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Session date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              {sessions.map((session, i: number) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SessionUser session={session} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SessionDate
                      startHour={session.start_hour}
                      endHour={session.end_hour}
                      date={session.date}
                    ></SessionDate>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span>
                      {session.topic_name
                        ? `${session.topic_name} - ${session.partner_confidence}`
                        : "None"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {type === "Completed"
                      ? completedAction(session)
                      : statusAction(session, handleStatusChange)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {showFeedbackOverlay && (
        <FeedbackOverlay
          session={activeCompletedSesssion!}
          completedSessions={completedSessions}
          setCompletedSessions={setCompletedSessions}
          setShowFeedbackOverlay={setShowFeedbackOverlay}
        />
      )}
    </div>
  );
};

export default SessionTable;
