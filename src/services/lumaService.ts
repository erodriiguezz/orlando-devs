// Configuration
const USE_DUMMY_DATA = true; // Set to false when you have a real API key
const LUMA_API_KEY = import.meta.env.LUMA_API_KEY || "";

export interface LumaEvent {
  api_id: string;
  event: {
    api_id: string;
    name: string;
    start_at: string;
    cover_url: string;
    url: string;
  };
}

export interface LumaResponse {
  entries: LumaEvent[];
}

const dummyEvents: LumaEvent[] = [
  {
    api_id: "evt_001",
    event: {
      api_id: "event_001",
      name: "Orlando JS Monthly Meetup",
      start_at: "2026-06-04T19:00:00Z",
      cover_url: "https://www.orlandodevs.com/footer-odev.png",
      url: "https://lu.ma/orlando-js-june",
    },
  },
  {
    api_id: "evt_002",
    event: {
      api_id: "event_002",
      name: "Web Devs Co-Working Session",
      start_at: "2026-06-08T09:00:00Z",
      cover_url: "https://www.orlandodevs.com/footer-odev.png",
      url: "https://lu.ma/web-devs-coworking",
    },
  },
  {
    api_id: "evt_003",
    event: {
      api_id: "event_003",
      name: "Astro Framework Workshop",
      start_at: "2026-06-11T18:30:00Z",
      cover_url: "https://www.orlandodevs.com/footer-odev.png",
      url: "https://lu.ma/astro-workshop",
    },
  },
  {
    api_id: "evt_004",
    event: {
      api_id: "event_004",
      name: "UX/UI Design & CSS Deep Dive",
      start_at: "2026-06-15T19:00:00Z",
      cover_url: "https://www.orlandodevs.com/footer-odev.png",
      url: "https://lu.ma/ux-design",
    },
  },
  {
    api_id: "evt_005",
    event: {
      api_id: "event_005",
      name: "Node.js Best Practices",
      start_at: "2026-06-18T19:00:00Z",
      cover_url: "https://www.orlandodevs.com/footer-odev.png",
      url: "https://lu.ma/nodejs-bestpractices",
    },
  },
  {
    api_id: "evt_006",
    event: {
      api_id: "event_006",
      name: "Orlando Devs Planning Session",
      start_at: "2026-06-20T10:00:00Z",
      cover_url: "https://www.orlandodevs.com/footer-odev.png",
      url: "https://lu.ma/odevs-planning",
    },
  },
  {
    api_id: "evt_007",
    event: {
      api_id: "event_007",
      name: "Ruby on Rails Bootcamp",
      start_at: "2026-06-25T18:00:00Z",
      cover_url: "https://www.orlandodevs.com/footer-odev.png",
      url: "https://lu.ma/rails-bootcamp",
    },
  },
  {
    api_id: "evt_008",
    event: {
      api_id: "event_008",
      name: "Orlando Devs Community Networking",
      start_at: "2026-07-11T19:00:00Z",
      cover_url: "https://www.orlandodevs.com/footer-odev.png",
      url: "https://lu.ma/odevs-networking",
    },
  },
];

/**
 * Fetch events from Luma API or return dummy data
 * @returns Promise<LumaEvent[]>
 */
export async function fetchLumaEvents(): Promise<LumaEvent[]> {
  if (USE_DUMMY_DATA || !LUMA_API_KEY) {
    console.log(
      "Using dummy event data. Set USE_DUMMY_DATA to false with a valid API key to fetch real data.",
    );
    return dummyEvents;
  }

  try {
    const response = await fetch("https://api.lu.ma/public/v1/events", {
      headers: {
        "x-api-key": LUMA_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Luma API error: ${response.statusText}`);
    }

    const data: LumaResponse = await response.json();
    return data.entries || [];
  } catch (error) {
    console.error(
      "Failed to fetch Luma events, falling back to dummy data:",
      error,
    );
    return dummyEvents;
  }
}

/**
 * Get events by month
 */
export function getEventsByMonth(
  events: LumaEvent[],
  month: number,
  year: number,
): LumaEvent[] {
  return events.filter((event) => {
    const eventDate = new Date(event.event.start_at);
    return eventDate.getMonth() === month && eventDate.getFullYear() === year;
  });
}
