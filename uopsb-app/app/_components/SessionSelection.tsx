import { initSlotStates, hours, days } from "@/lib/constants";
import { useState, useEffect } from "react";
import TimeSlotGrid from "./TimeSlotGrid";
import Overlay from "./Overlay";

interface SessionSelectionProps {
  setShowSessionSelection: (value: boolean) => void;
}

const SessionSelection: React.FC<SessionSelectionProps> = ({
  setShowSessionSelection,
}) => {
  const [slotStates, setSlotStates] = useState(initSlotStates);

  // Add helper functions and event handlers for week selection arrows

  return (
    <Overlay onClose={() => setShowSessionSelection(false)}>
      {/* Week selection arrows */}
      <div className="flex justify-between mb-2">
        <button
          type="button"
          className="py-1 px-2 rounded-md bg-blue-500 text-white"
          // Add event handler for the previous week arrow
        >
          &lt; Previous Week
        </button>
        <button
          type="button"
          className="py-1 px-2 rounded-md bg-blue-500 text-white"
          // Add event handler for the next week arrow
        >
          Next Week &gt;
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