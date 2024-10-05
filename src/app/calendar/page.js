"use client";

import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Plus, X, CalendarIcon, Clock, Edit, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();

        // Convert the event start and end dates to JS Date objects
        const formattedEvents = data.map((event) => ({
          ...event,
          start: new Date(event.start), // Ensure start is a JS Date object
          end: new Date(event.end), // Ensure end is a JS Date object
        }));

        // Check if there are no events
        if (formattedEvents.length === 0) {
          alert("No existing events found.");
        } else {
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // const [events, setEvents] = useState([
  //   {
  //     id: 0,
  //     title: "Board Meeting",
  //     start: new Date(2024, 5, 10, 10, 0),
  //     end: new Date(2024, 5, 10, 12, 0),
  //     category: "work",
  //     description: "",
  //     location: "",
  //   },
  //   {
  //     id: 1,
  //     title: "Team Lunch",
  //     start: new Date(2024, 5, 11, 12, 0),
  //     end: new Date(2024, 5, 11, 13, 0),
  //     category: "personal",
  //     description: "",
  //     location: "",
  //   },
  // ]);

  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    description: "",
    location: "",
    category: "",
  });

  const handleSelectSlot = ({ start, end }) => {
    setEditingEvent(null);
    setNewEvent({
      ...newEvent,
      start,
      end,
    });
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setEditingEvent(event);
    setNewEvent(event);
    setModalOpen(true);
  };

  const categoryTypeMapping = {
    work: "work",
    personal: "personal",
    family: "family",
    social: "social",
    health: "health",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => {
      const updatedEvent = { ...prevEvent, [name]: value };

      if (name === "category") {
        updatedEvent.type = categoryTypeMapping[value] || "other";
      }

      return updatedEvent;
    });
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    const [datePart, timePart] = value.split("T");
    const newDate = new Date(datePart);
    const [hours, minutes] = timePart.split(":");
    newDate.setHours(parseInt(hours), parseInt(minutes));
    setNewEvent({ ...newEvent, [name]: newDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventToSubmit = {
      ...newEvent,
      repeat: "never", // Example: Adjust based on user input
      reschedulable: true, // or based on your app logic
      name: newEvent.title, // Assuming name is the title of the event
      username: "dev", // Set this based on the logged-in user
    };

    try {
      if (editingEvent) {
        const response = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventToSubmit), // Send the complete object
        });

        if (!response.ok) {
          throw new Error("Failed to update event");
        }

        const updatedEvent = await response.json();
        setEvents((prev) =>
          prev.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
        );
      } else {
        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventToSubmit }),
        });

        if (!response.ok) {
          throw new Error("Failed to create event");
        }

        const createdEvent = await response.json();
        setEvents((prev) => [...prev, createdEvent]);
      }
    } catch (error) {
      console.error("Error submitting event:", error);
    } finally {
      setModalOpen(false);
      setEditingEvent(null);
      setNewEvent({
        title: "",
        start: new Date(),
        end: new Date(),
        description: "",
        location: "",
        category: "",
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (editingEvent) {
      try {
        const response = await fetch(`/api/events/${editingEvent.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete event");
        }

        setEvents((prev) =>
          prev.filter((event) => event.id !== editingEvent.id)
        );
      } catch (error) {
        console.error("Error deleting event:", error);
      } finally {
        setModalOpen(false);
        setEditingEvent(null);
        setNewEvent({
          title: "",
          start: new Date(),
          end: new Date(),
          description: "",
          location: "",
          category: "",
        });
      }
    }
  };

  const moveEvent = ({ event, start, end }) => {
    setEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev) => ev.id !== event.id);
      return [...filtered, { ...existing, start, end }];
    });
  };

  const resizeEvent = ({ event, start, end }) => {
    setEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev) => ev.id !== event.id);
      return [...filtered, { ...existing, start, end }];
    });
  };

  const eventStyleGetter = (event) => {
    const categoryColors = {
      work: "bg-green-600",
      personal: "bg-green-400",
      family: "bg-emerald-500",
      health: "bg-teal-500",
    };

    return {
      className: `${
        categoryColors[event.category] || "bg-green-500"
      } text-white rounded-lg border-none cursor-pointer`,
    };
  };

  const TimeInput = ({ label, name, value, onChange }) => (
    <div className="relative">
      <label
        className="block text-sm font-medium text-gray-700 mb-1"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="datetime-local"
          name={name}
          value={moment(value).format("YYYY-MM-DDTHH:mm")}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
        <Clock
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingEvent(null);
              setNewEvent({ ...newEvent, start: new Date(), end: new Date() });
              setModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            <Plus size={20} className="mr-2" />
            New Event
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-xl border border-green-100"
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 700 }}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            resizable
            onEventDrop={moveEvent}
            onEventResize={resizeEvent}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            view={view}
            date={date}
            onView={(newView) => setView(newView)}
            onNavigate={(newDate) => setDate(new Date(newDate))}
            eventPropGetter={eventStyleGetter}
            className="p-4"
            draggableAccessor={() => true}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {editingEvent ? "Edit Event" : "Add Event"}
                </h2>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => {
                    setModalOpen(false);
                    setEditingEvent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </motion.button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    required
                  />
                </div>

                <TimeInput
                  label="Start Time"
                  name="start"
                  value={newEvent.start}
                  onChange={handleDateTimeChange}
                />

                <TimeInput
                  label="End Time"
                  name="end"
                  value={newEvent.end}
                  onChange={handleDateTimeChange}
                />

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    rows={3}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="location"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="category"
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    value={newEvent.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="family">Family</option>
                    <option value="health">Health</option>
                  </select>
                </div>
                <div className="flex justify-between space-x-3 mt-6">
                  {editingEvent && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleDeleteEvent}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md flex items-center"
                    >
                      <Trash size={16} className="mr-2" />
                      Delete
                    </motion.button>
                  )}
                  <div className="flex space-x-3 ml-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setModalOpen(false);
                        setEditingEvent(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center"
                    >
                      {editingEvent ? (
                        <>
                          <Edit size={16} className="mr-2" />
                          Update
                        </>
                      ) : (
                        <>
                          <Plus size={16} className="mr-2" />
                          Add
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CalendarPage;
