const SessionRequestsTable = ({ sessionRequests }) => {
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
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap">
                <SessionDate
                  startHour={session.start_hour}
                  endHour={session.end_hour}
                  date={session.date}></SessionDate>
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

const SessionDate = ({ startHour, endHour, date }) => {
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
    const month = dateObj.toLocaleDateString("en-US", { month: "long" });
    const dayOfMonth = dateObj.getDate();
    const ordinalSuffix =
      dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31
        ? "st"
        : dayOfMonth === 2 || dayOfMonth === 22
        ? "nd"
        : dayOfMonth === 3 || dayOfMonth === 23
        ? "rd"
        : "th";
    return `${day} ${dayOfMonth}${ordinalSuffix} ${month}`;
  };

  const formatHour = (hour) => {
    return hour >= 0 && hour <= 23
      ? (hour % 12 || 12) + (hour < 12 ? "AM" : "PM")
      : "";
  };

  return (
    <div style={{ fontWeight: "bold" }}>
      {formatDate(date)} ({formatHour(startHour)} - {formatHour(endHour)})
    </div>
  );
};
