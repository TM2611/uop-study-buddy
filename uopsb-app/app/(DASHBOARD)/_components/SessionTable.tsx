import React from "react";
import {
  UserSessionData,
  SessionStatus,
  SessionTableType,
  UserType,
} from "@/app/types";
import { extractUpNum } from "@/lib/utils";
import CircularNumberIcon from "@/app/_components/CircularNumberIcon";
import SessionUser from "./SessionUser";
import SessionDate from "./SessionDate";

type SessionTableActionType = (
  session: UserSessionData,
  handleAction: (session: UserSessionData, status: SessionStatus) => void
) => React.ReactNode;

interface SessionTableProps {
  receivedRequests: UserSessionData[];
  sessionBookings: UserSessionData[];
  setReceivedRequests: (receivedRequests: UserSessionData[]) => void;
  setShowRequestsTable: (showRequestsTable: boolean) => void;
  setSessionBookings: (sessionBookings: UserSessionData[]) => void;
  setShowBookingsTable: (showBookingsTable: boolean) => void;
  currentUser: UserType;
  type: SessionTableType;
  action: SessionTableActionType;
}

const SessionTable: React.FC<SessionTableProps> = ({
  receivedRequests,
  setReceivedRequests,
  setShowRequestsTable,
  sessionBookings,
  setSessionBookings,
  setShowBookingsTable,
  currentUser,
  type,
  action,
}) => {
  const sessions = type === "Requests" ? receivedRequests : sessionBookings;

  const handleAction = async (
    session: UserSessionData,
    status: SessionStatus
  ) => {
    const userID = extractUpNum(currentUser.email);
    const sessionID = session.session_id;

    const res = await fetch(`/api/session?session=${sessionID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userID,
        status: status,
      }),
    });
    if (res.ok) {
      const data = await res.text();
      console.log(data);

      if (status === "CANCELLED") {
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

        if (status === "ACCEPTED") {
          // SessionRequestTable Action - add accepted session to bookings
          const newSessionBookings = [...sessionBookings, session];
          setSessionBookings(newSessionBookings);
        }
      }
    }
  };

  const handleViewTable = (type: SessionTableType) => {
    if (type === "Requests") {
      setShowRequestsTable(true);
      setShowBookingsTable(false);
    } else {
      setShowBookingsTable(true);
      setShowRequestsTable(false);
    }
  };

  return (
    <section>
      <div className="flex  justify-between">
        <h2 className="text-xl font-semibold my-4">
          <span className=" mx-1 my-2">{`Session ${type}`}</span>
          <CircularNumberIcon number={sessions.length} />
        </h2>
        <button
          className="h-10 bg-blue-600 text-white px-4 py-2 m-3 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          onClick={() =>
            handleViewTable(type === "Requests" ? "Bookings" : "Requests")
          }
        >
          {`View ${type === "Requests" ? "Bookings" : "Requests"}`}
        </button>
      </div>
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
                {action(session, handleAction)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default SessionTable;
