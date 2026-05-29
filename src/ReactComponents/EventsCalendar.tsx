"use client";

import React, { useState, useMemo } from "react";
import type { CollectionEntry } from "astro:content";

interface MockEvent {
  id: string;
  groupName: string;
  subject: string;
  date: string;
  slug: string;
}

interface EventsCalendarProps {
  events: CollectionEntry<"events">[];
}

// Mock event data for demonstration
const mockEvents: MockEvent[] = [
  {
    id: "1",
    groupName: "UX/UI",
    subject: "Design & CSS",
    date: "2026-06-04",
    slug: "design-css",
  },
  {
    id: "2",
    groupName: "Web Devs",
    subject: "Co-Working",
    date: "2026-06-08",
    slug: "web-devs-coworking",
  },
  {
    id: "3",
    groupName: "Web Devs",
    subject: "Astro",
    date: "2026-06-11",
    slug: "web-devs-astro",
  },
  {
    id: "4",
    groupName: "UX/UI",
    subject: "Feedback",
    date: "2026-06-15",
    slug: "ux-feedback",
  },
  {
    id: "5",
    groupName: "Node",
    subject: "NodeJS",
    date: "2026-06-18",
    slug: "nodejs",
  },
  {
    id: "6",
    groupName: "Orlando Devs",
    subject: "Planning",
    date: "2026-06-20",
    slug: "planning",
  },
  {
    id: "7",
    groupName: "Ruby",
    subject: "Rails",
    date: "2026-06-25",
    slug: "rails",
  },
  {
    id: "8",
    groupName: "Orlando Devs",
    subject: "Networking",
    date: "2026-07-11",
    slug: "networking",
  },
  // Previous month events
  {
    id: "9",
    groupName: "Frontend Devs",
    subject: "React Hooks",
    date: "2026-05-10",
    slug: "react-hooks",
  },
  {
    id: "10",
    groupName: "Orlando JS",
    subject: "JavaScript Q&A",
    date: "2026-05-15",
    slug: "js-qa",
  },
  {
    id: "11",
    groupName: "Web Devs",
    subject: "Tailwind Workshop",
    date: "2026-05-22",
    slug: "tailwind",
  },
];

export default function EventsCalendar({ events }: EventsCalendarProps) {
  const [displayMonth, setDisplayMonth] = useState(); // June (0-indexed)
  const [displayYear, setDisplayYear] = useState(2026);

  // Combine real and mock events
  const allEvents = useMemo(() => {
    const eventMap = new Map<string, any[]>();

    // Add real events
    events.forEach((event: any) => {
      const dateStr = event.data.date.toISOString().split("T")[0];
      if (!eventMap.has(dateStr)) {
        eventMap.set(dateStr, []);
      }
      eventMap.get(dateStr)!.push({
        groupName: event.data.groupName,
        subject: event.data.subject,
        slug: event.slug,
      });
    });

    // Add mock events
    mockEvents.forEach((event) => {
      if (!eventMap.has(event.date)) {
        eventMap.set(event.date, []);
      }
      eventMap.get(event.date)!.push({
        groupName: event.groupName,
        subject: event.subject,
        slug: event.slug,
      });
    });

    return eventMap;
  }, [events]);

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

  const getEventsForDay = (day: number | null): any[] => {
    if (!day) return [];
    const dateStr = new Date(displayYear, displayMonth, day)
      .toISOString()
      .split("T")[0];
    return allEvents.get(dateStr) || [];
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="border border-zinc-900 rounded-xl bg-zinc-950 overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 bg-zinc-900/30 border-b border-zinc-900 flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            {monthName}
          </span>
          <div className="flex gap-1.5">
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
          </div>
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
                key={`${displayYear}-${displayMonth}-${day}-${index}`}
                className={`min-h-[120px] p-2.5 border-r border-b border-zinc-900 flex flex-col justify-between transition-all ${
                  isBefore
                    ? "bg-zinc-950 text-zinc-800"
                    : isMonth
                      ? "text-zinc-300 hover:bg-zinc-900/10"
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
                    <a
                      key={`${day}-${eventIndex}`}
                      href={`/events/${event.slug}`}
                      className="w-full text-left truncate text-[10px] px-2 py-1.5 rounded bg-zinc-900 hover:bg-white hover:text-zinc-950 text-zinc-300 border border-zinc-850 transition-all font-medium block"
                    >
                      <span className="text-[8px] opacity-60 block uppercase text-zinc-400 tracking-tighter leading-none mb-0.5">
                        {event.groupName}
                      </span>
                      {event.subject}
                    </a>
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
  );
}
