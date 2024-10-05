"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";

// Dynamically import the Toast UI Calendar with "ssr: false" to prevent SSR issues
const TuiCalendar = dynamic(() => import("@toast-ui/react-calendar"), {
  ssr: false,
});

export default function CalendarPage() {
  const calendarRef = useRef();

  const schedules = [
    {
      id: "1",
      calendarId: "1",
      title: "Meeting",
      category: "time",
      start: "2024-10-10T10:00:00",
      end: "2024-10-10T12:00:00",
    },
    {
      id: "2",
      calendarId: "1",
      title: "Lunch",
      category: "time",
      start: "2024-10-11T12:00:00",
      end: "2024-10-11T13:00:00",
    },
  ];

  return (
    <div className="p-8">
      {" "}
      {/* Adds padding around the calendar for whitespace */}
      <h1 className="text-3xl font-bold mb-6 text-center">My Calendar</h1>
      {/* Preferences Button */}
      <div className="flex justify-center mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-green-300 text-white rounded-lg hover:bg-green-400 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 3.75v-1.5m1.5 1.5v-1.5M9.742 7.665l-1.06-1.06m7.466 1.06l-1.06-1.06m-9.49 6.614h-1.5m1.5 1.5h-1.5m12.116-1.5h-1.5m1.5 1.5h-1.5m-6.866 4.116l-1.06-1.06m7.466 1.06l-1.06-1.06m-2.616-5.256a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Preferences
        </button>
      </div>
      <div className="bg-white p-4 shadow-md rounded-lg">
        {" "}
        {/* Add styles to the calendar wrapper */}
        <TuiCalendar
          ref={calendarRef}
          height="800px"
          view="week" // You can change this to "month", "day", etc.
          schedules={schedules} // Assign the schedule events
          taskView={false} // Disable Milestone and Task view
          scheduleView={["time"]} // Only show time, disable "all day" view
          useDetailPopup={true}
        />
      </div>
    </div>
  );
}
