
import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await readDB();

    const swipedIds = new Set(
      db.swipes.map((swipe) => swipe.profileId)
    );

    const feed = db.profiles.filter(
      (profile) => !swipedIds.has(profile.id)
    );

    return NextResponse.json({ profiles: feed });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load feed" },
      { status: 500 }
    );
  }
}
