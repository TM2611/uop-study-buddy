import React from "react";

interface StudyStatsOverviewProps {
  studySessionsCompleted: number;
  totalStudyTime: number;
  upcomingStudySessions: number;
}

const StudyStatsOverview: React.FC<StudyStatsOverviewProps> = ({
  studySessionsCompleted,
  totalStudyTime,
  upcomingStudySessions,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Study Stats Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-semibold">{studySessionsCompleted}</span>
          <span className="text-gray-600">Study Sessions</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-semibold">{totalStudyTime} hours</span>
          <span className="text-gray-600">Total Study Time</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-semibold">
            {upcomingStudySessions}
          </span>
          <span className="text-gray-600">Upcoming Study Sessions</span>
        </div>
      </div>
    </div>
  );
};

export default StudyStatsOverview;
