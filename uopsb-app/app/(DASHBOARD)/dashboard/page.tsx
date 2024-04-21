"use client";

import React, { useState, useEffect } from "react";
import StudyStatsOverview from "../_components/StudyStatsOverview";
import { useAuth } from "@/app/AuthContext";
import { UserSessionData } from "@/app/types";
import SessionTable from "../_components/SessionTable";
import SessionAction from "../_components/SessionAction";

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();

  const [receivedRequests, setReceivedRequests] = useState<UserSessionData[]>(
    []
  );
  const [sessionBookings, setSessionBookings] = useState<UserSessionData[]>([]);
  const [showRequestsTable, setShowRequestsTable] = useState(false);
  const [showBookingsTable, setShowBookingsTable] = useState(true);

  useEffect(() => {
    // Fetch the list of session requests here and set the state
    const fetchSessionRequests = async () => {
      if (!user) return;
      const response = await fetch(`/api/session?id=${user.id}&type=all`);
      const sessions = await response.json();
      const requests = sessions.filter(
        (x: UserSessionData) =>
          x.status === "PENDING" && x.is_user_request === false
      );
      const bookings = sessions.filter(
        (x: UserSessionData) => x.status === "ACCEPTED"
      );
      setReceivedRequests(requests);
      setSessionBookings(bookings);
    };
    fetchSessionRequests();
  }, [user]);

  return (
    <div>
      <StudyStatsOverview
        studySessionsCompleted={0}
        totalStudyTime={0}
        upcomingStudySessions={sessionBookings.length}
      />
      <section>
        {showRequestsTable && (
          <SessionTable
            sessionBookings={sessionBookings}
            setShowBookingsTable={setShowBookingsTable}
            receivedRequests={receivedRequests}
            setShowRequestsTable={setShowRequestsTable}
            setSessionBookings={setSessionBookings}
            setReceivedRequests={setReceivedRequests}
            currentUser={user}
            type="Requests"
            action={(session, handleAction) => (
              <SessionAction
                session={session}
                handleAction={handleAction}
                type="Requests"
              />
            )}
          />
        )}
        {showBookingsTable && (
          <SessionTable
            sessionBookings={sessionBookings}
            setShowBookingsTable={setShowBookingsTable}
            receivedRequests={receivedRequests}
            setShowRequestsTable={setShowRequestsTable}
            setSessionBookings={setSessionBookings}
            setReceivedRequests={setReceivedRequests}
            currentUser={user}
            type="Bookings"
            action={(session, handleAction) => (
              <SessionAction
                session={session}
                handleAction={handleAction}
                type="Bookings"
              />
            )}
          />
        )}
      </section>
      {/* Other sections of the dashboard */}
    </div>
  );
};

export default Dashboard;
