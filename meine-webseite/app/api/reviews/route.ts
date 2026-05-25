import { NextResponse } from "next/server";

interface GoogleReview {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlacesResponse {
  status: string;
  error_message?: string;
  result?: {
    reviews?: GoogleReview[];
    rating?: number;
    user_ratings_total?: number;
  };
}

export async function GET() {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!placeId || !apiKey) {
    return NextResponse.json({ configured: false });
  }

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=reviews,rating,user_ratings_total` +
      `&language=de` +
      `&key=${apiKey}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data: GooglePlacesResponse = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { configured: true, error: data.status, message: data.error_message ?? "" },
        { status: 502 }
      );
    }

    const reviews = (data.result?.reviews ?? []).map((r) => ({
      name: r.author_name,
      initials: r.author_name
        .split(/\s+/)
        .map((w) => w.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase(),
      date: r.relative_time_description,
      text: r.text,
      photo: r.profile_photo_url ?? null,
      rating: r.rating,
    }));

    return NextResponse.json({
      configured: true,
      reviews,
      rating: data.result?.rating ?? null,
      total: data.result?.user_ratings_total ?? 0,
    });
  } catch {
    return NextResponse.json(
      { configured: true, error: "network_error" },
      { status: 500 }
    );
  }
}
