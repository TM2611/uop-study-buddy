"use client";

import React, { useState, useEffect } from "react";
import StudyStatsOverview from "../_components/StudyStatsOverview";
import { useAuth } from "@/app/AuthContext";
import { SessionData } from "@/app/types";
import SessionTable from "../_components/SessionTable";
import SessionAction from "../_components/SessionAction";

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();

  const [sessionRequests, setSessionRequests] = useState<SessionData[]>([]);
  const [sessionBookings, setSessionBookings] = useState<SessionData[]>([]);
  const [showRequestsTable, setShowRequestsTable] = useState(false);
  const [showBookingsTable, setShowBookingsTable] = useState(true);

  useEffect(() => {
    // Fetch the list of session requests here and set the state
    const fetchSessionRequests = async () => {
      if (!user) return;
      const response = await fetch(`/api/session?id=${user.id}&type=all`);
      const sessions = await response.json();
      const requests = sessions.filter(
        (x: SessionData) => x.status === "PENDING" && x.requester_id === user.id
      );
      const bookings = sessions.filter(
        (x: SessionData) => x.status === "ACCEPTED"
      );
      setSessionRequests(requests);
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
            sessionRequests={sessionRequests}
            setShowRequestsTable={setShowRequestsTable}
            setSessionBookings={setSessionBookings}
            setSessionRequests={setSessionRequests}
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
            sessionRequests={sessionRequests}
            setShowRequestsTable={setShowRequestsTable}
            setSessionBookings={setSessionBookings}
            setSessionRequests={setSessionRequests}
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
