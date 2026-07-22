import { createServerFn } from "@tanstack/react-start";

type CalendlyUserResponse = {
  resource?: {
    uri?: string;
  };
};

type CalendlyEventTypesResponse = {
  collection?: Array<{
    active?: boolean;
    duration?: number;
    name?: string;
    scheduling_url?: string;
    uri?: string;
  }>;
};

type CalendlySchedulingLinkResponse = {
  resource?: {
    booking_url?: string;
  };
};

async function readJson<T>(response: Response) {
  const text = await response.text();
  if (!response.ok) {
    console.error(`Calendly gateway failed [${response.status}]: ${text}`);
    throw new Error(`Calendly request failed [${response.status}]`);
  }
  return JSON.parse(text) as T;
}

export const createDiscoverySchedulingLink = createServerFn({ method: "POST" }).handler(
  async () => {
    const gatewayUrl = "https://connector-gateway.lovable.dev/calendly";
    const lovableApiKey = process.env.LOVABLE_API_KEY;
    const calendlyApiKey = process.env.CALENDLY_API_KEY;

    if (!lovableApiKey || !calendlyApiKey) {
      throw new Error("Calendly connector is not configured");
    }

    const headers = {
      Authorization: `Bearer ${lovableApiKey}`,
      "X-Connection-Api-Key": calendlyApiKey,
    };

    const user = await readJson<CalendlyUserResponse>(
      await fetch(`${gatewayUrl}/users/me`, { headers }),
    );
    const userUri = user.resource?.uri;
    if (!userUri) throw new Error("Calendly user was not found");

    const eventTypesUrl = new URL(`${gatewayUrl}/event_types`);
    eventTypesUrl.searchParams.set("user", userUri);
    eventTypesUrl.searchParams.set("active", "true");
    eventTypesUrl.searchParams.set("count", "100");

    const eventTypes = await readJson<CalendlyEventTypesResponse>(
      await fetch(eventTypesUrl.toString(), { headers }),
    );
    const eventType = eventTypes.collection?.find((event) => event.active && event.uri);
    if (!eventType?.uri) {
      throw new Error("No active Calendly event type is available");
    }

    const schedulingLink = await readJson<CalendlySchedulingLinkResponse>(
      await fetch(`${gatewayUrl}/scheduling_links`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          max_event_count: 1,
          owner: eventType.uri,
          owner_type: "EventType",
        }),
      }),
    );

    const bookingUrl = schedulingLink.resource?.booking_url ?? eventType.scheduling_url;
    if (!bookingUrl) throw new Error("Calendly booking link could not be created");

    return {
      bookingUrl,
      eventName: eventType.name ?? "Discovery Call",
      duration: eventType.duration ?? 30,
    };
  },
);