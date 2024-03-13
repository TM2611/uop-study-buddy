"use client";

import React, { useState, useEffect } from "react";
import StudyStatsOverview from "../_components/StudyStatsOverview";
import { useAuth } from "@/app/AuthContext";
import SessionRequestsTable from "../_components/SessionRequestsTable";
import { SessionData } from "@/app/types";

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();

  const [sessionRequests, setSessionRequests] = useState<SessionData[]>([]);
  const [sessionBookings, setSessionBookings] = useState<SessionData[]>([]);

  useEffect(() => {
    // Fetch the list of session requests here and set the state
    const fetchSessionRequests = async () => {
      if (!user) return;
      const response = await fetch(`/api/session?id=${user.id}&type=all`);
      const sessions = await response.json();
      const requests = sessions.filter(
        (x: SessionData) => x.status === "PENDING"
      );
      const bookings = sessions.filter(
        (x: SessionData) => x.status === "ACCEPTED"
      );
      console.log(sessions);
      setSessionRequests(requests);
      setSessionBookings(bookings);
    };
    fetchSessionRequests();
  }, [user]);

  return (
    <section>
      <section>
        <StudyStatsOverview
          studySessionsCompleted={0}
          totalStudyTime={0}
          upcomingStudySessions={sessionBookings.length}
        />
        <SessionRequestsTable
          sessionBookings={sessionBookings}
          sessionRequests={sessionRequests}
          setSessionRequests={setSessionRequests}
          setSessionBookings={setSessionBookings}
          currentUser={user}
        />
      </section>
      {/* Other sections of the dashboard */}
    </section>
  );
};

export default Dashboard;
