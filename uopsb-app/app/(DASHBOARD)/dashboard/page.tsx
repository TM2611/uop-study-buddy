"use client";

import React, { useState, useEffect } from "react";
import StudyStatsOverview from "../_components/StudyStatsOverview";
import { useAuth } from "@/app/AuthContext";
import SessionRequestsTable from "../_components/SessionRequestsTable";

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();

  const [sessionRequests, setSessionRequests] = useState([]);

  useEffect(() => {
    // Fetch the list of session requests here and set the state
    const fetchSessionRequests = async () => {
      if (!user) return;
      const response = await fetch(`/api/session?id=${user.id}&type=requests`);
      const data = await response.json();
      console.log(data);
      setSessionRequests(data);
    };
    fetchSessionRequests();
  }, [user]);

  return (
    <section>
      <section>
        <StudyStatsOverview
          studySessionsCompleted={0}
          totalStudyTime={0}
          upcomingStudySessions={0}
        />
        <SessionRequestsTable sessionRequests={sessionRequests} />
      </section>
      {/* Other sections of the dashboard */}
    </section>
  );
};

export default Dashboard;
