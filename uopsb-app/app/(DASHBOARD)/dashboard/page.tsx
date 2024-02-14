"use client";

import React from "react";
import StudyStatsOverview from "../_components/StudyStatsOverview";

const Dashboard = () => {
  return (
    <section>
      <section>
        <StudyStatsOverview
          studySessionsCompleted={0}
          totalStudyTime={0}
          upcomingStudySessions={0}
        />
      </section>
      {/* Other sections of the dashboard */}
    </section>
  );
};

export default Dashboard;
