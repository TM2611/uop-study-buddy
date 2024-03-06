import { initSlotStates, hours, days } from "@/lib/constants";
import { useState, useEffect } from "react";
import TimeSlotGrid from "./TimeSlotGrid";
import Overlay from "./Overlay";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

interface SessionSelectionProps {
  setShowSessionSelection: (value: boolean) => void;
}

const SessionSelection: React.FC<SessionSelectionProps> = ({
  setShowSessionSelection,
}) => {
  const [slotStates, setSlotStates] = useState(initSlotStates);
  const [activeDate, setActiveDate] = useState(dayjs().startOf("isoWeek"));

  const handlePreviousWeek = () => {
    setActiveDate(activeDate.subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setActiveDate(activeDate.add(1, "week"));
  };

  const dateRange = `${activeDate.format("DD/MM/YY")} - ${activeDate
    .add(6, "day")
    .format("DD/MM/YY")}`;

  return (
    <Overlay onClose={() => setShowSessionSelection(false)}>
      {/* Week selection arrows */}
      <div className="flex justify-between mb-2">
        <button
          type="button"
          className="py-1 px-2 rounded-md bg-blue-500 text-white text-sm"
          onClick={handlePreviousWeek}
        >
          &lt; Previous
        </button>
        <span>{dateRange}</span>
        <button
          type="button"
          className="py-1 px-2 rounded-md bg-blue-500 text-white"
          onClick={handleNextWeek}
        >
          Next &gt;
        </button>
      </div>

      <TimeSlotGrid
        hours={hours}
        days={days}
        slotStates={slotStates}
        setSlotStates={setSlotStates}
      />
    </Overlay>
  );
};

export default SessionSelection;
