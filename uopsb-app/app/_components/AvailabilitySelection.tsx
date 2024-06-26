import TimeSlotGrid from "@/app/_components/TimeSlotGrid";
import { useEffect, useState } from "react";
import { hours, days, initSlotStates } from "@/lib/constants";
import { AvailabilitySlot, WeeklySlotStates } from "@/app/types";
import { slotsToSelectedStates } from "@/lib/utils";

export default function AvailabilitySelection({
  userAvailabilitySlots,
  onChange,
}: {
  onChange: (slotStates: WeeklySlotStates) => void;
  userAvailabilitySlots?: AvailabilitySlot[];
}) {
  const [slotStates, setSlotStates] = useState<WeeklySlotStates>(
    userAvailabilitySlots
      ? slotsToSelectedStates(userAvailabilitySlots)
      : initSlotStates
  );

  useEffect(() => {
    onChange(slotStates);
  }, [slotStates]);

  // Helper functions for button handlers
  const selectAll = () => {
    const newSlotStates = Array(7)
      .fill(null)
      .map(() => Array(24).fill(0));
    setSlotStates(newSlotStates);
    onChange(newSlotStates);
  };

  const deselectAll = () => {
    const newSlotStates = Array(7)
      .fill(null)
      .map(() => Array(24).fill(0));
    setSlotStates(newSlotStates);
    onChange(newSlotStates);
  };

  const selectWeekdays = () => {
    const newSlotStates = [...slotStates];
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
      // Only Monday to Friday
      for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
        newSlotStates[dayIndex][hourIndex] = 1;
      }
    }
    setSlotStates(newSlotStates);
    onChange(newSlotStates);
  };

  const selectWeekends = () => {
    const newSlotStates = [...slotStates];
    for (let dayIndex = 5; dayIndex < 7; dayIndex++) {
      // Only Saturday and Sunday
      for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
        newSlotStates[dayIndex][hourIndex] = 1;
      }
    }
    setSlotStates(newSlotStates);
    onChange(newSlotStates);
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
        slotStates={slotStates}
        setSlotStates={setSlotStates}
      />
    </div>
  );
}

export function isAvailabilityChosen(slotStates: WeeklySlotStates): boolean {
  for (let i = 0; i < slotStates.length; i++) {
    for (let j = 0; j < slotStates[i].length; j++) {
      if (slotStates[i][j] === 1) {
        return true;
      }
    }
  }
  return false;
}
