import { useRouter } from "next/navigation";
import { initSlotStates, hours, days } from "@/lib/constants";
import { useState, useEffect } from "react";
import TimeSlotGrid from "./TimeSlotGrid";
import Overlay from "./Overlay";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
  slotsToAvailableStates,
  createDateFromDMY,
  extractUpNum,
  getBookedSlotIndexes,
  isDateInRange,
  weeklyStatesToSelectedSlots,
} from "@/lib/utils";
import {
  AvailabilitySlot,
  SelectedTopic,
  UserSessionData,
  SessionSlot,
  UserAvailabilityConfidence,
  WeeklySlotStates,
  SessionCreation,
} from "../types";
import Popup from "./Popup";
import { useAuth } from "../AuthContext";

dayjs.extend(isoWeek);

interface SessionSelectionProps {
  setShowSessionSelection: (value: boolean) => void;
  selectedUser: UserAvailabilityConfidence;
  selectedTopic: SelectedTopic;
}

const SessionSelection: React.FC<SessionSelectionProps> = ({
  setShowSessionSelection,
  selectedUser,
  selectedTopic,
}) => {
  const [slotStates, setSlotStates] = useState(initSlotStates);
  const [activeDate, setActiveDate] = useState(dayjs().startOf("isoWeek"));
  const [isCurrentWeek, setIsCurrentWeek] = useState(true);
  const [selectedDateTime, setSelectedDateTime] = useState<string[]>([]);
  const [popupContent, setPopupContent] = useState<JSX.Element | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isConfirmDisabled, setConfirmDisabled] = useState(true);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const setSessionAvailability = () => {
      try {
        const availableSlots = selectedUser.availability_slots;
        const availableStates = slotsToAvailableStates(availableSlots);
        const updatedAvailableStates = includeOccupiedSlots(availableStates);
        setSlotStates(updatedAvailableStates);
      } catch (error) {
        console.error("Failed to fetch user availableSlots", error);
      }
    };
    if (selectedUser) {
      setSessionAvailability();
    }
  }, [activeDate]);

  // Check if any slots are selected before enabling confirm button
  useEffect(() => {
    const containsSelection = slotStates.some((row) =>
      row.some((item) => item === 1)
    );
    setConfirmDisabled(!containsSelection);
  }, [slotStates]);

  useEffect(() => {
    setIsCurrentWeek(
      activeDate.startOf("isoWeek").isSame(dayjs().startOf("isoWeek"), "week")
    );
  }, [activeDate]);

  const getDateRange = (activeDate: Dayjs) => {
    return `${activeDate.format("DD/MM/YY")} - ${activeDate
      .add(6, "day")
      .format("DD/MM/YY")}`;
  };

  function getSessionSlotData(
    slots: AvailabilitySlot[],
    activeDate: Dayjs
  ): SessionSlot[] {
    return slots.map((slot) => {
      let dayIndex = days.indexOf(slot.day);
      let slotDate = activeDate.toDate();
      slotDate.setDate(slotDate.getDate() + dayIndex);
      let ukSlotDate = slotDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return {
        ...slot,
        date: ukSlotDate,
      };
    });
  }

  function getSelectedDateTimes(
    selectedSlots: AvailabilitySlot[],
    activeDate: Dayjs
  ) {
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "long",
    };

    const dayDateArray: string[] = [];
    const sessionSlots = getSessionSlotData(selectedSlots, activeDate);

    sessionSlots.forEach((sessionSlot) => {
      const slotDate = createDateFromDMY(sessionSlot.date);
      const dateString = slotDate.toLocaleString("en-GB", dateOptions);
      const startHour = sessionSlot.start_hour % 12 || 12;
      const endHour = sessionSlot.end_hour % 12 || 12;
      const startAmPm = sessionSlot.start_hour >= 12 ? "PM" : "AM";
      const endAmPm = sessionSlot.end_hour >= 12 ? "PM" : "AM";
      const timeRange = `(${startHour} ${startAmPm} - ${endHour} ${endAmPm})`;
      dayDateArray.push(`${dateString} ${timeRange}`);
    });

    return dayDateArray;
  }

  function includeOccupiedSlots(
    slotStates: WeeklySlotStates
  ): WeeklySlotStates {
    if (!selectedUser.bookings?.length) {
      // No bookings to include
      return slotStates;
    }
    const updatedStates = slotStates.map((row) => [...row]); // Create a shallow copy of the 2D array

    const bookedSessions = selectedUser.bookings;
    const weekBookedSessions = bookedSessions?.filter((x) =>
      isDateInRange(x.date ?? "", activeDate.toISOString())
    );
    const bookedSlotIndexes = getBookedSlotIndexes(weekBookedSessions);

    bookedSlotIndexes.forEach((slotIndex) => {
      const [dayIndex, hourIndex] = slotIndex;
      updatedStates[dayIndex][hourIndex] = 2;
    });
    return updatedStates;
  }

  function hasPastSession(slots: AvailabilitySlot[]) {
    const now = dayjs();
    const currentDayIndex = days.indexOf(now.format("ddd").toUpperCase());
    const currentHour = now.hour();

    return slots.some((slot) => {
      const slotDayIndex = days.indexOf(slot.day);

      if (!isCurrentWeek) {
        // The session slots are from a future week
        return false;
      } else {
        // The session slots are in the current week
        if (slotDayIndex < currentDayIndex) {
          // The session slot day is earlier than the current day
          return true;
        } else if (slotDayIndex === currentDayIndex) {
          // The session slot day is the same as the current day
          if (slot.end_hour < currentHour) {
            // The session slot time is earlier than or equal to the current time
            return true;
          }
        }
      }
      return false;
    });
  }
  ``;

  const handlePreviousWeek = () => {
    setActiveDate(activeDate.subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setActiveDate(activeDate.add(1, "week"));
  };

  const handleSessionConfirm = async () => {
    try {
      const requestedSessions = weeklyStatesToSelectedSlots(slotStates);
      const sessionData = getSessionSlotData(requestedSessions, activeDate);
      const jsonString = JSON.stringify(sessionData);
      const encodedSessions = encodeURIComponent(jsonString);
      const userID = extractUpNum(user.email);
      const sessionCreation = {
        partner_id: extractUpNum(selectedUser.email),
        requester_id: userID,
        topic: Number(selectedTopic.id) || null,
        sessions: encodedSessions,
      };
      const res = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionCreation),
      });
      if (!res.ok) {
        throw new Error("Failed to request session");
      }

      const content = (
        <div>
          <span className="mt-3">
            The user has been notified of your request
          </span>
          <br />
          <span className="font-bold text-lg mt-3">Summary</span>
          <div>
            <span className="font-bold">Topic:</span>{" "}
            {selectedTopic.name || "No Topic"}
          </div>
          <ul className="list-disc p-2">
            {selectedDateTime.map((session, i) => (
              <li key={i}>{session}</li>
            ))}
          </ul>
        </div>
      );
      setShowConfirmPopup(false);
      setPopupContent(content);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Failed to request session", error);
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    setShowSessionSelection(false);
    router.push("/dashboard");
  };

  const dateRange = getDateRange(activeDate);

  const onConfirmClick = () => {
    const selectedSlots = weeklyStatesToSelectedSlots(slotStates);
    if (!selectedSlots.length) {
      alert("Please select a date and time.");
      return;
    }

    if (hasPastSession(selectedSlots)) {
      alert("You cannot book a session in the past.");
      return;
    }
    const sessionTimes = getSelectedDateTimes(selectedSlots, activeDate);
    setSelectedDateTime(sessionTimes);

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
    setShowConfirmPopup(true);
  };

  return (
    <Overlay onClose={() => setShowSessionSelection(false)}>
      {/* Week selection arrows */}
      <h3 className="flex justify-center mb-3">
        <span className="font-bold">Study Session:</span>{" "}
        {selectedUser.given_name}
      </h3>
      <div className="flex justify-between mb-2">
        <button
          type="button"
          className={`py-1 px-2 rounded-md text-white text-sm ${
            isCurrentWeek ? `bg-gray-500` : `bg-blue-500`
          }`}
          onClick={handlePreviousWeek}
          disabled={isCurrentWeek}
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
        onConfirm={handleSessionConfirm}
        onClose={() => setShowConfirmPopup(false)}
      />
      <Popup
        show={showSuccessPopup}
        title="Session(s) Requested!"
        content={popupContent || <></>}
        onConfirm={null}
        onClose={() => handleSuccessPopupClose()}
      />
    </Overlay>
  );
};

export default SessionSelection;
