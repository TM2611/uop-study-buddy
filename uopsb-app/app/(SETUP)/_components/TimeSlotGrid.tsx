import { useState } from "react";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const hours = Array.from({ length: 24 }, (_, i) => i);

export function TimeSlotGrid({
  onChange,
}: {
  onChange: (availability: boolean[][]) => void;
}) {
  const [availability, setAvailability] = useState(
    Array(7)
      .fill(null)
      .map(() => Array(24).fill(false))
  );

  const toggleAvailability = (dayIndex: number, hourIndex: number) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex][hourIndex] =
      !newAvailability[dayIndex][hourIndex];
    setAvailability(newAvailability);
    onChange(newAvailability);
  };

  // Helper functions for button handlers
  const selectAll = () => {
    const newAvailability = Array(7)
      .fill(null)
      .map(() => Array(24).fill(true));
    setAvailability(newAvailability);
    onChange(newAvailability);
  };

  const deselectAll = () => {
    const newAvailability = Array(7)
      .fill(null)
      .map(() => Array(24).fill(false));
    setAvailability(newAvailability);
    onChange(newAvailability);
  };

  const selectWeekdays = () => {
    const newAvailability = [...availability];
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
      // Only Monday to Friday
      for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
        newAvailability[dayIndex][hourIndex] = true;
      }
    }
    setAvailability(newAvailability);
    onChange(newAvailability);
  };

  const selectWeekends = () => {
    const newAvailability = [...availability];
    for (let dayIndex = 5; dayIndex < 7; dayIndex++) {
      // Only Saturday and Sunday
      for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
        newAvailability[dayIndex][hourIndex] = true;
      }
    }
    setAvailability(newAvailability);
    onChange(newAvailability);
  };

  function hourToInterval(hour: number): string {
    const start = hour.toString().padStart(2, "0") + ":00";
    const end = ((hour + 1) % 24).toString().padStart(2, "0") + ":00";
    return `${start}-${end}`;
  }
  ``;

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

      {/* TimeSlotGrid table */}

      <table className="w-full text-center">
        <thead>
          <tr>
            <th className="font-bold mb-2">Time</th>
            {days.map((day) => (
              <th key={day} className="font-bold mb-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="p-1">{hourToInterval(hour)}</td>
              {days.map((_, dayIndex) => (
                <td key={dayIndex} className="p-1">
                  <button
                    type="button"
                    className={`w-8 h-8 border border-black rounded-md ${
                      availability[dayIndex][hour]
                        ? "bg-purple-500"
                        : "bg-white"
                    }`}
                    onClick={() => toggleAvailability(dayIndex, hour)}
                    aria-label="Toggle availability"
                  ></button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
