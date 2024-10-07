"use client";

import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Plus, X, CalendarIcon, Clock, Edit, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    username: "dev",
    title: "",
    start: new Date(),
    end: new Date(),
    reschedulable: true,
    intensity: 1,
    type: "other",
    repeat: "never",
  });

  const handleNavigateToPreferences = () => {
    router.push("/preferences");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();

        const formattedEvents = data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    setEditingEvent(null);
    setNewEvent({
      ...newEvent,
      start: new Date(start),
      end: new Date(end),
    });
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    const newDate = new Date(value);
    setNewEvent((prev) => ({
      ...prev,
      [name]: newDate,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventToSubmit = {
      ...newEvent,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
    };

    console.log("Submitting event:", eventToSubmit);

    try {
      if (editingEvent) {
        const response = await fetch(`/api/events/${editingEvent._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventToSubmit),
        });

        if (!response.ok) {
          throw new Error("Failed to update event");
        }

        const updatedEventData = await response.json();
        const updatedEvent = {
          ...updatedEventData,
          start: new Date(updatedEventData.start),
          end: new Date(updatedEventData.end),
        };

        setEvents((prev) =>
          prev.map((event) =>
            event._id === updatedEvent._id ? updatedEvent : event
          )
        );
      } else {
        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventToSubmit),
        });

        if (!response.ok) {
          throw new Error("Failed to create event");
        }

        const createdEventData = await response.json();
        const createdEvent = {
          ...createdEventData,
          start: new Date(createdEventData.start),
          end: new Date(createdEventData.end),
        };

        setEvents((prev) => [...prev, createdEvent]);
      }
    } catch (error) {
      console.error("Error submitting event:", error);
    } finally {
      setModalOpen(false);
      setEditingEvent(null);
      setNewEvent({
        username: "dev",
        title: "",
        start: new Date(),
        end: new Date(),
        reschedulable: true,
        intensity: 1,
        type: "other",
        repeat: "never",
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (editingEvent) {
      console.log("Deleting event:", editingEvent);
      try {
        const response = await fetch(`/api/events/${editingEvent._id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete event");
        }

        setEvents((prev) =>
          prev.filter((event) => event._id !== editingEvent._id)
        );
      } catch (error) {
        console.error("Error deleting event:", error);
      } finally {
        setModalOpen(false);
        setEditingEvent(null);
        setNewEvent({
          username: "dev",
          title: "",
          start: new Date(),
          end: new Date(),
          reschedulable: true,
          intensity: 1,
          type: "other",
          repeat: "never",
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
      const existing = prev.find((ev) => ev._id === event._id) ?? {};
      const filtered = prev.filter((ev) => ev._id !== event._id);
      return [...filtered, { ...existing, start, end }];
    });
  };

  // const eventStyleGetter = (event) => {
  //   let baseColor;

  //   // Determine color based on reschedulability
  //   if (event.reschedulable) {
  //     baseColor = 'bg-green-400'; // Light green for reschedulable events
  //   } else {
  //     baseColor = 'bg-green-700'; // Dark green for non-reschedulable events
  //   }

  //   // Type-based border accents
  //   const typeAccents = {
  //     work: 'border-blue-600',
  //     personal: 'border-purple-600',
  //     family: 'border-yellow-600',
  //     social: 'border-orange-600',
  //     health: 'border-red-600',
  //     other: 'border-gray-600',
  //   };

  //   const borderAccent = typeAccents[event.type] || 'border-gray-600';

  //   return {
  //     className: `${baseColor} ${borderAccent} text-white rounded-lg border-l-4 border-red-600 cursor-pointer transition-all hover:opacity-90`,
  //     style: {
  //       fontSize: '0.85em',
  //     }
  //   };
  // };

  const eventStyleGetter = (event) => {
    console.log("Styling event:", event); // Log to see if it's called

    return {
      className: "bg-red-500", // Temporary style to test
      style: {
        fontSize: "0.85em",
      },
    };
  };

  const CalendarLegend = () => (
    <div className="flex items-center space-x-4 text-sm mb-4">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
        <span>TASK (RESCHEDULABLE)</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-700 rounded mr-2"></div>
        <span>EVENT (FIXED)</span>
      </div>
    </div>
  );

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

  const handleSubmitOptimize = async (e) => {
    // e.preventDefault();

    console.log("Optimizing schedule");
    console.log("Events:", events);
    let tasks = events.filter((event) => event.reschedulable);
    tasks = tasks.map((task) => ({
      priority: task.intensity,
      duration: moment(task.end).diff(moment(task.start), "minutes") / 60,
      name: task.title,
    }));
    let pureEvents = events.filter((event) => !event.reschedulable);
    console.log("PURERRE EVENTS:", pureEvents);
    pureEvents = pureEvents.map((event) => ({
      start: event.start,
      end: event.end,
      title: event.title,
    }));

    console.log("Tasks:", tasks);
    console.log("Pure events:", pureEvents);

    const response = await fetch("/api/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tasks,
        events: pureEvents,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to optimize schedule");
    }

    const data = await response.json();
    console.log("Optimized schedule:", data);

    const updatedEvents = events.map((event) => {
      const newTime = data.find((optEvent) => optEvent.title === event.title);
      if (newTime) {
        return {
          ...event,
          start: new Date(newTime.start),
          end: new Date(newTime.end),
        };
      }
      return event;
    });

    console.log("Updated events:", updatedEvents);
    setEvents(updatedEvents);

    await Promise.all(
      updatedEvents.map(async (event) => {
        const response = await fetch(`/api/events/${event._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: event.title,
            start: event.start,
            end: event.end,
            reschedulable: event.reschedulable,
            intensity: event.intensity,
            type: event.type,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update event ${event.title}`);
        }
      })
    );
  };

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
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNavigateToPreferences}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
              Go to Preferences
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmitOptimize}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Optimize
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingEvent(null);
                setNewEvent({
                  username: "dev",
                  title: "",
                  start: new Date(),
                  end: new Date(),
                  reschedulable: true,
                  intensity: 1,
                  type: "other",
                  repeat: "never",
                });
                setModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <Plus size={20} className="mr-2" />
              New Event
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-xl border border-green-100 p-4"
        >
          <CalendarLegend />
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
            onNavigate={(newDate) => setDate(newDate)}
            eventPropGetter={eventStyleGetter}
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

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="start"
                  >
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    name="start"
                    value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                    onChange={handleDateTimeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="end"
                  >
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    name="end"
                    value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                    onChange={handleDateTimeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="type"
                  >
                    Type
                  </label>
                  <select
                    name="type"
                    value={newEvent.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="family">Family</option>
                    <option value="social">Social</option>
                    <option value="health">Health</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="intensity"
                  >
                    Intensity (1-5)
                  </label>
                  <input
                    type="number"
                    name="intensity"
                    min="1"
                    max="5"
                    value={newEvent.intensity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="repeat"
                  >
                    Repeat
                  </label>
                  <select
                    name="repeat"
                    value={newEvent.repeat}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    <option value="never">Never</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reschedulable"
                    name="reschedulable"
                    checked={newEvent.reschedulable}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        reschedulable: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="reschedulable"
                  >
                    Reschedulable
                  </label>
                </div>
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
