import { initSlotStates, hours, days } from "@/lib/constants";
import { useState, useEffect } from "react";
import TimeSlotGrid from "./TimeSlotGrid";
import Overlay from "./Overlay";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
  availabilitySlotsToStates,
  statesToAvailabilitySlots,
} from "@/lib/utils";
import { AvailabilitySlot, Topic, UserType, WeeklySlotStates } from "../types";
import Popup from "./Popup";

dayjs.extend(isoWeek);

interface SessionSelectionProps {
  setShowSessionSelection: (value: boolean) => void;
  selectedUser: UserType | null;
  selectedTopic: Partial<Topic>;
}

const SessionSelection: React.FC<SessionSelectionProps> = ({
  setShowSessionSelection,
  selectedUser,
  selectedTopic,
}) => {
  const [slotStates, setSlotStates] = useState(initSlotStates);
  const [activeDate, setActiveDate] = useState(dayjs().startOf("isoWeek"));
  const [selectedDateTime, setSelectedDateTime] = useState<string[]>([]);
  const [popupContent, setPopupContent] = useState<JSX.Element | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isConfirmDisabled, setConfirmDisabled] = useState(true);

  useEffect(() => {
    const setSessionAvailability = async (userEmail: string) => {
      try {
        const response = await fetch(`/api/availability?email=${userEmail}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user availableSlots");
        }
        const availableSlots: AvailabilitySlot[] = await response.json();
        const availableStates = availabilitySlotsToStates(availableSlots);
        const updatedAvailableStates = includeOccupiedSlots(availableStates);
        setSlotStates(updatedAvailableStates);
      } catch (error) {
        console.error("Failed to fetch user availableSlots", error);
      }
    };
    if (selectedUser) {
      setSessionAvailability(selectedUser.email);
    }
  }, []);

  // Check if any slots are selected before enabling confirm button
  useEffect(() => {
    const containsSelection = slotStates.some((row) =>
      row.some((item) => item === 1)
    );
    setConfirmDisabled(!containsSelection);
  }, [slotStates]);

  const getDateRange = (activeDate: Dayjs) => {
    return `${activeDate.format("DD/MM/YY")} - ${activeDate
      .add(6, "day")
      .format("DD/MM/YY")}`;
  };

  function getSelectedDateTimes(
    selectedSlots: AvailabilitySlot[],
    activeDate: Dayjs
  ) {
    const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "long",
    };

    let weekStartDate = activeDate.toDate();
    let dayDateArray: string[] = [];

    selectedSlots.forEach((slot) => {
      let dayIndex = weekDays.indexOf(slot.day);
      let slotDate = new Date(weekStartDate);
      slotDate.setDate(weekStartDate.getDate() + dayIndex);

      let dateString = slotDate.toLocaleDateString("en-GB", dateOptions);
      let startHour = slot.start_hour % 12 || 12;
      let endHour = slot.end_hour % 12 || 12;
      let startAmPm = slot.start_hour >= 12 ? "PM" : "AM";
      let endAmPm = slot.end_hour >= 12 ? "PM" : "AM";
      let timeRange = `(${startHour} ${startAmPm} - ${endHour} ${endAmPm})`;
      dayDateArray.push(`${dateString} ${timeRange}`);
    });

    return dayDateArray;
  }

  function includeOccupiedSlots(
    slotStates: WeeklySlotStates
  ): WeeklySlotStates {
    const updatedStates = slotStates.map((row) => [...row]); // Create a shallow copy of the 2D array
    // TODO: will need to combine with bookings

    return updatedStates;
  }

  const handlePreviousWeek = () => {
    setActiveDate(activeDate.subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setActiveDate(activeDate.add(1, "week"));
  };

  const handleConfirm = () => {
    console.log("Save Session");
    // Save session to database, notify recipient
  };

  const handleCancel = () => {
    setShowConfirmPopup(false);
  };

  const dateRange = getDateRange(activeDate);

  const onConfirmClick = () => {
    setShowConfirmPopup(true);
    const selectedSlots = statesToAvailabilitySlots(slotStates);
    const sessionTimes = getSelectedDateTimes(selectedSlots, activeDate);
    setSelectedDateTime(sessionTimes);

    if (!selectedDateTime) {
      alert("Please select a date and time.");
      setShowConfirmPopup(false);
      return;
    }
    const content = (
      <div>
        <span className="font-bold">
          Are you sure you would like to request the following session(s)?
        </span>
        <br />
        <div>
          <span className="font-bold">Topic:</span> {selectedTopic.name}
        </div>
        <ul className="list-disc p-2">
          {sessionTimes.map((session) => (
            <li key={session}>{session}</li>
          ))}
        </ul>
      </div>
    );

    setPopupContent(content);
  };

  return (
    <Overlay onClose={() => setShowSessionSelection(false)}>
      {/* Week selection arrows */}
      <h3 className="flex justify-center font-bold mb-3">
        Study Session Selection
      </h3>
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
      <div className="flex justify-center">
        <button
          type="button"
          className={`py-1 px-2 mt-4 rounded-md  ${
            isConfirmDisabled ? `bg-gray-500` : `bg-blue-500 text-white`
          } `}
          onClick={() => onConfirmClick()}
          disabled={isConfirmDisabled}
        >
          Confirm
        </button>
      </div>
      <Popup
        show={showConfirmPopup}
        title="Session Confirmation"
        content={popupContent || <></>}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Overlay>
  );
};

export default SessionSelection;
