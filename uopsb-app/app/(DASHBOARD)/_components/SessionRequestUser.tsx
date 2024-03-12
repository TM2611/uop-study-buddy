import { SessionData } from "@/app/types";
import React from "react";

interface SessionRequestUserProps {
  session: SessionData;
}

const SessionRequerUser: React.FC<SessionRequestUserProps> = ({ session }) => {
  const fname = session.given_name;
  const lname = session.family_name;
  const course_name = session.course_name;
  const picture = session.picture;
  return (
    <div className="flex items-center space-x-3">
      <img
        src={picture}
        alt={`${fname} ${lname}`}
        className="w-12 h-12 object-cover rounded-full"
      />
      <div className="flex flex-col">
        <div className="text-sm font-semibold">
          {fname} {lname}
        </div>
        <div className="text-xs text-gray-500">{course_name}</div>
      </div>
    </div>
  );
};

export default SessionRequerUser;
