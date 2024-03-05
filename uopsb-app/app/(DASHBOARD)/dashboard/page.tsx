"use client";

import React from "react";
import StudyStatsOverview from "../_components/StudyStatsOverview";

import { useAuth } from "@/app/AuthContext";

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();
  return (
    <section>
      <section>
        <StudyStatsOverview
          studySessionsCompleted={0}
          totalStudyTime={0}
          upcomingStudySessions={0}
        />
        <section></section>
      </section>
      {/* Other sections of the dashboard */}
    </section>
  );
};

export default Dashboard;
