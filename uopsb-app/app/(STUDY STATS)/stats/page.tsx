"use client";

import React from "react";
import StudyMetrics from "../_components/StudyMetrics";

const Dashboard = () => {
  return (
    <section>
      <h1>Student Dashboard</h1>

      {/* Other sections of the dashboard */}

      <section>
        <h2>Study Metrics</h2>
        <StudyMetrics />
      </section>
    </section>
  );
};

export default Dashboard;
