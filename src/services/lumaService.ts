const USE_DUMMY_DATA = true;
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
      cover_url:
        "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/nn/15b57214-b546-44e6-aaa5-bcf624ea7b14",
      url: "https://lu.ma/orlando-js-june",
    },
  },
  {
    api_id: "evt_002",
    event: {
      api_id: "event_002",
      name: "Web Devs Co-Working Session",
      start_at: "2026-06-08T09:00:00Z",
      cover_url:
        "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/nn/15b57214-b546-44e6-aaa5-bcf624ea7b14",
      url: "https://lu.ma/web-devs-coworking",
    },
  },
  {
    api_id: "evt_003",
    event: {
      api_id: "event_003",
      name: "Astro Framework Workshop",
      start_at: "2026-06-11T18:30:00Z",
      cover_url:
        "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/nn/15b57214-b546-44e6-aaa5-bcf624ea7b14",
      url: "https://lu.ma/astro-workshop",
    },
  },
  {
    api_id: "evt_004",
    event: {
      api_id: "event_004",
      name: "UX/UI Design & CSS Deep Dive",
      start_at: "2026-06-15T19:00:00Z",
      cover_url:
        "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/nn/15b57214-b546-44e6-aaa5-bcf624ea7b14",
      url: "https://lu.ma/ux-design",
    },
  },
  {
    api_id: "evt_005",
    event: {
      api_id: "event_005",
      name: "Node.js Best Practices",
      start_at: "2026-06-18T19:00:00Z",
      cover_url:
        "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/nn/15b57214-b546-44e6-aaa5-bcf624ea7b14",
      url: "https://lu.ma/nodejs-bestpractices",
    },
  },
  {
    api_id: "evt_006",
    event: {
      api_id: "event_006",
      name: "Orlando Devs Planning Session",
      start_at: "2026-06-20T10:00:00Z",
      cover_url:
        "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/nn/15b57214-b546-44e6-aaa5-bcf624ea7b14",
      url: "https://lu.ma/odevs-planning",
    },
  },
  {
    api_id: "evt_007",
    event: {
      api_id: "event_007",
      name: "Ruby on Rails Bootcamp",
      start_at: "2026-06-25T18:00:00Z",
      cover_url:
        "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/nn/15b57214-b546-44e6-aaa5-bcf624ea7b14",
      url: "https://lu.ma/rails-bootcamp",
    },
  },
  {
    api_id: "evt_008",
    event: {
      api_id: "event_008",
      name: "Orlando Devs Community Networking",
      start_at: "2026-07-11T19:00:00Z",
      cover_url:
        "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/nn/15b57214-b546-44e6-aaa5-bcf624ea7b14",
      url: "https://lu.ma/odevs-networking",
    },
  },
  {
    api_id: "evt_009",
    event: {
      api_id: "event_009",
      name: "Performance Optimization",
      start_at: "2026-06-18T19:00:00Z",
      cover_url:
        "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/nn/15b57214-b546-44e6-aaa5-bcf624ea7b14",
      url: "https://lu.ma/react-performance",
    },
  },
];

export async function fetchLumaEvents(): Promise<LumaEvent[]> {
  if (USE_DUMMY_DATA || !LUMA_API_KEY) {
    return dummyEvents;
  }

  try {
    const response = await fetch(
      "https://public-api.luma.com/v1/calendar/list-events",
      {
        headers: {
          acept: "application/json",
          "x-luma-api-key": LUMA_API_KEY,
        },
      },
    );

    if (!response.ok) {
      console.error("Luma API error: ", response.status, await response.text());
      return [];
    }

    const data: LumaResponse = await response.json();
    return data.entries;
  } catch (error) {
    console.error("Failed to fetch Luma events", error);
    return [];
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
