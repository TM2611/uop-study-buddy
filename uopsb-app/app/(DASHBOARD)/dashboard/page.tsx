"use client";

import React, { useState, useEffect } from "react";
import StudyStatsOverview from "../_components/StudyStatsOverview";
import { useAuth } from "@/app/AuthContext";
import { SessionData } from "@/app/types";
import SessionTable from "../_components/SessionTable";
import SessionRequestAction from "../_components/SessionRequestAction";

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

        <SessionTable
          sessionBookings={sessionBookings}
          sessionRequests={sessionRequests}
          setSessionBookings={setSessionBookings}
          setSessionRequests={setSessionRequests}
          currentUser={user}
          type="Requests"
          action={(session, handleAction) => (
            <SessionRequestAction
              session={session}
              handleAction={handleAction}
            />
          )}
        />
      </section>
      {/* Other sections of the dashboard */}
    </section>
  );
};

export default Dashboard;
