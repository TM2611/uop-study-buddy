import { WeeklySlotStates } from "../types";

function hourToInterval(hour: number): string {
  const start = hour.toString().padStart(2, "0") + ":00";
  const end = ((hour + 1) % 24).toString().padStart(2, "0") + ":00";
  return `${start}-${end}`;
}

export default function TimeSlotGrid({
  hours,
  days,
  slotStates,
  setSlotStates,
}: {
  hours: number[];
  days: string[];
  slotStates: WeeklySlotStates;
  setSlotStates: (slotStates: WeeklySlotStates) => void;
}) {
  const toggleSlot = (dayIndex: number, hourIndex: number) => {
    const newSlotStates = [...slotStates];
    const slotIndex = newSlotStates[dayIndex][hourIndex];
    if (slotIndex === 0) {
      newSlotStates[dayIndex][hourIndex] = 1;
    } else if (slotIndex === 1) {
      newSlotStates[dayIndex][hourIndex] = 0;
    }
    setSlotStates(newSlotStates);
  };

  return (
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
                    slotStates[dayIndex][hours.indexOf(hour)] === 1
                      ? "bg-purple-500"
                      : slotStates[dayIndex][hours.indexOf(hour)] === -1
                      ? "bg-slate-600"
                      : "bg-white"
                  }`}
                  onClick={() => toggleSlot(dayIndex, hours.indexOf(hour))}
                  aria-label="Toggle Slot State"
                ></button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
