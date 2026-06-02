"use client";

import { useState, useEffect, useMemo } from "react";
import type { LumaEvent } from "../services/lumaService";
import { fetchLumaEvents } from "../services/lumaService";

interface EventsCalendarProps {
  initialEvents?: LumaEvent[];
}

export default function EventsCalendar({
  initialEvents = [],
}: EventsCalendarProps) {
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<LumaEvent[]>(initialEvents);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const firstDay = new Date(displayYear, displayMonth, 1);
  const lastDay = new Date(displayYear, displayMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const monthName = firstDay.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const calendarCells: (number | null)[] = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarCells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  const totalCells = Math.ceil(calendarCells.length / 7) * 7;
  while (calendarCells.length < totalCells) {
    calendarCells.push(null);
  }

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getEventsForDay = (day: number | null): LumaEvent[] => {
    if (!day) return [];
    const dateStr = new Date(displayYear, displayMonth, day)
      .toISOString()
      .split("T")[0];
    return eventsByDate.get(dateStr) || [];
  };

  const handlePrev = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNext = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handleCurrent = () => {
    const today = new Date();
    setDisplayMonth(today.getMonth());
    setDisplayYear(today.getFullYear());
  };

  const handleDayClick = (day: number | null) => {
    if (day === null) return;

    setSelectedDay(selectedDay === day ? null : day);
  };

  // Fetch events on component mount
  useEffect(() => {
    if (initialEvents.length === 0) {
      setIsLoading(true);
      fetchLumaEvents()
        .then(setEvents)
        .catch((error) => {
          console.error("Failed to load events:", error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [initialEvents]);

  // Map events to dates
  const eventsByDate = useMemo(() => {
    const map = new Map<string, LumaEvent[]>();
    events.forEach((event) => {
      const dateStr = new Date(event.event.start_at)
        .toISOString()
        .split("T")[0];
      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr)!.push(event);
    });
    return map;
  }, [events]);

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) =>
        new Date(a.event.start_at).getTime() -
        new Date(b.event.start_at).getTime(),
    );
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedDay === null) return sortedEvents;

    const dayEvents = getEventsForDay(selectedDay);
    return dayEvents.sort(
      (a, b) =>
        new Date(a.event.start_at).getTime() -
        new Date(b.event.start_at).getTime(),
    );
  }, [sortedEvents, selectedDay, displayMonth, displayYear]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col-reverse  md:flex-row gap-12">
      <div className="w-full flex flex-col gap-4">
        {filteredEvents.length === 0 ? (
          <div className=" text-zinc-400">
            {isLoading
              ? "Loading events..."
              : "There are no events happening this day"}
          </div>
        ) : (
          filteredEvents.map(({ event, api_id }) => (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
              key={api_id}
            >
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 hover:bg-zinc-900/30 transition-all">
                {event.cover_url && (
                  <div className="flex-shrink-0">
                    <img
                      src={event.cover_url}
                      alt={event.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {event.name}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                    {new Date(event.start_at).toLocaleString(undefined, {
                      month: "long",
                      day: "numeric",
                      timeZone: "America/New_York",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </a>
          ))
        )}
      </div>

      <div className="min-w-[250px] md:min-w-[350px] max-w-[400px] max-h-[400px] ">
        {isLoading && (
          <div className="text-center text-zinc-400 mb-4">
            Loading events...
          </div>
        )}
        <div className="border border-zinc-900 rounded-xl bg-zinc-950 overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 bg-zinc-900/30 border-b border-zinc-900 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              {monthName}
            </span>
            {/* <div className="flex gap-1.5">
              <button
                onClick={handlePrev}
                className="px-2.5 py-1.5 text-[11px] bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border border-zinc-850 rounded transition-colors"
              >
                Prev
              </button>
              <button
                onClick={handleCurrent}
                className="px-2.5 py-1.5 text-[11px] bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border border-zinc-850 rounded transition-colors"
              >
                Current
              </button>
              <button
                onClick={handleNext}
                className="px-2.5 py-1.5 text-[11px] bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border border-zinc-850 rounded transition-colors"
              >
                Next
              </button>
            </div> */}
          </div>

          {/* Week Day Headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-zinc-500 py-3 border-b border-zinc-900 bg-zinc-950 tracking-wider">
            {weekDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 bg-zinc-950">
            {calendarCells.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isMonth = day !== null;
              const isBefore = day === null && index < startingDayOfWeek;

              return (
                <div
                  onClick={() => handleDayClick(day)}
                  key={`${displayYear}-${displayMonth}-${day}-${index}`}
                  className={` p-2.5 border-r border-b border-zinc-900 flex flex-col justify-between transition-all ${
                    isBefore
                      ? "bg-zinc-950 text-zinc-800"
                      : isMonth
                        ? selectedDay === day
                          ? "bg-blue-500/20 border-blue-500 text-zing-300"
                          : "text-zinc-300 hover:bg-zinc-900/10"
                        : "bg-zinc-950 text-zinc-800"
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono ${
                      isMonth ? "text-zinc-400 font-semibold" : "text-zinc-800"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="space-y-1 mt-2">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      // <a
                      //   key={`${day}-${eventIndex}`}
                      //   href={event.event.url}
                      //   target="_blank"
                      //   rel="noopener noreferrer"
                      //   className="w-full text-left truncate text-[10px] px-2 py-1.5 rounded bg-zinc-900 hover:bg-white hover:text-zinc-950 text-zinc-300 border border-zinc-850 transition-all font-medium block"
                      // >
                      //   <span className="text-[8px] opacity-60 block uppercase text-zinc-400 tracking-tighter leading-none mb-0.5">
                      //     Event
                      //   </span>
                      //   {event.event.name}
                      // </a>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] text-zinc-500 px-2">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
