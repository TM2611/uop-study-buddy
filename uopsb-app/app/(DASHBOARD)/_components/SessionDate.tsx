interface SessionDateProps {
  startHour: number;
  endHour: number;
  date: string;
}

const SessionDate: React.FC<SessionDateProps> = ({
  startHour,
  endHour,
  date,
}) => {
  const formatDate = (dateString: string) => {
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

  const formatHour = (hour: number) => {
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

export default SessionDate;
