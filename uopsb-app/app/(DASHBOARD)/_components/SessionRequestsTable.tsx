import { SessionData } from "@/app/types";
import SessionRequestUser from "./SessionRequestUser";
import SessionDate from "./SessionDate";

interface SessionRequestsTableProps {
  sessionRequests: SessionData[];
}
const SessionRequestsTable: React.FC<SessionRequestsTableProps> = ({
  sessionRequests,
}) => {
  const handleAccept = (sessionID) => {
    // Handle accept action here
  };

  const handleReject = (sessionID) => {
    // Handle reject action here
  };
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Session Requests</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
              Session date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
              Topic
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-xs">
          {sessionRequests.map((session, i: number) => (
            <tr key={i}>
              <td className="px-6 py-4 whitespace-nowrap">
                <SessionRequestUser session={session} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <SessionDate
                  startHour={session.start_hour}
                  endHour={session.end_hour}
                  date={session.date}
                ></SessionDate>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span>
                  {session.topic_name} - {session.requester_confidence}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleAccept(session.session_id)}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(session.session_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default SessionRequestsTable;