import TimeSlotGrid from "@/app/_components/TimeSlotGrid";
import { useEffect, useState } from "react";
import { hours, days, initSlotStates } from "@/lib/constants";
import { WeeklyAvailabilityStates } from "@/app/types";

export default function AvailabilitySelection({
  onChange,
}: {
  onChange: (availabilityStates: WeeklyAvailabilityStates) => void;
}) {
  const [availabilityStates, setAvailabilityStates] = useState(initSlotStates);

  useEffect(() => {
    onChange(availabilityStates);
  }, [availabilityStates]);

  // Helper functions for button handlers
  const selectAll = () => {
    const newAvailabilityStates = Array(7)
      .fill(null)
      .map(() => Array(24).fill(0));
    setAvailabilityStates(newAvailabilityStates);
    onChange(newAvailabilityStates);
  };

  const deselectAll = () => {
    const newAvailabilityStates = Array(7)
      .fill(null)
      .map(() => Array(24).fill(0));
    setAvailabilityStates(newAvailabilityStates);
    onChange(newAvailabilityStates);
  };

  const selectWeekdays = () => {
    const newAvailabilityStates = [...availabilityStates];
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
      // Only Monday to Friday
      for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
        newAvailabilityStates[dayIndex][hourIndex] = 1;
      }
    }
    setAvailabilityStates(newAvailabilityStates);
    onChange(newAvailabilityStates);
  };

  const selectWeekends = () => {
    const newAvailabilityStates = [...availabilityStates];
    for (let dayIndex = 5; dayIndex < 7; dayIndex++) {
      // Only Saturday and Sunday
      for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
        newAvailabilityStates[dayIndex][hourIndex] = 1;
      }
    }
    setAvailabilityStates(newAvailabilityStates);
    onChange(newAvailabilityStates);
  };

  return (
    <div>
      {/* Availability buttons */}
      <div className="flex space-x-4 mb-2">
        <button
          type="button"
          className="py-1 px-2 rounded-md bg-purple-500 text-white"
          onClick={selectAll}
        >
          Select All
        </button>
        <button
          type="button"
          className="py-1 px-2 rounded-md bg-purple-500 text-white"
          onClick={deselectAll}
        >
          Deselect All
        </button>
        <button
          type="button"
          className="py-1 px-2 rounded-md bg-purple-500 text-white"
          onClick={selectWeekdays}
        >
          Select Weekdays
        </button>
        <button
          type="button"
          className="py-1 px-2 rounded-md bg-purple-500 text-white"
          onClick={selectWeekends}
        >
          Select Weekends
        </button>
      </div>

      <TimeSlotGrid
        hours={hours}
        days={days}
        availabilityStates={availabilityStates}
        setAvailabilityStates={setAvailabilityStates}
      />
    </div>
  );
}
