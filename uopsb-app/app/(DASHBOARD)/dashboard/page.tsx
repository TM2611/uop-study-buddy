"use client";

import React, { useState, useEffect } from "react";
import StudyStatsOverview from "../_components/StudyStatsOverview";
import { useAuth } from "@/app/AuthContext";
import { UserSessionData } from "@/app/types";
import SessionTable from "../_components/SessionTable";

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();

  const [receivedRequests, setReceivedRequests] = useState<UserSessionData[]>(
    []
  );
  const [completedSessions, setCompletedSessions] = useState<UserSessionData[]>(
    []
  );
  const [sessionBookings, setSessionBookings] = useState<UserSessionData[]>([]);
  const [showBookingsTable, setShowBookingsTable] = useState(true);
  const [showCompletedTable, setShowCompletedTable] = useState(false);

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
      const completed = sessions.filter(
        (x: UserSessionData) => x.status === "COMPLETED"
      );
      setReceivedRequests(requests);
      setSessionBookings(bookings);
      setCompletedSessions(completed);
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
        <SessionTable
          sessionBookings={sessionBookings}
          setShowBookingsTable={setShowBookingsTable}
          receivedRequests={receivedRequests}
          setSessionBookings={setSessionBookings}
          setReceivedRequests={setReceivedRequests}
          completedSessions={completedSessions}
          setShowCompletedTable={setShowCompletedTable}
          currentUser={user}
          type="Requests"
        />
        {showBookingsTable && (
          <SessionTable
            sessionBookings={sessionBookings}
            setShowBookingsTable={setShowBookingsTable}
            receivedRequests={receivedRequests}
            setSessionBookings={setSessionBookings}
            setReceivedRequests={setReceivedRequests}
            completedSessions={completedSessions}
            setShowCompletedTable={setShowCompletedTable}
            currentUser={user}
            type="Bookings"
          />
        )}
        {showCompletedTable && (
          <SessionTable
            sessionBookings={sessionBookings}
            setShowBookingsTable={setShowBookingsTable}
            receivedRequests={receivedRequests}
            setSessionBookings={setSessionBookings}
            setReceivedRequests={setReceivedRequests}
            completedSessions={completedSessions}
            setShowCompletedTable={setShowCompletedTable}
            currentUser={user}
            type="Completed"         
          />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
