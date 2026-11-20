
import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { profileId, action } = await request.json();

    if (!profileId || !["like", "pass"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid swipe data" },
        { status: 400 }
      );
    }

    const db = await readDB();

    const profileExists = db.profiles.some(
      (profile) => profile.id === profileId
    );

    if (!profileExists) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const alreadySwiped = db.swipes.some(
      (swipe) => swipe.profileId === profileId
    );

    if (alreadySwiped) {
      return NextResponse.json(
        { error: "Profile already swiped" },
        { status: 409 }
      );
    }

    db.swipes.push({
      profileId,
      action,
      createdAt: new Date().toISOString()
    });

    const isMatch =
      action === "like" &&
      db.incomingLikes.includes(profileId);

    if (isMatch && !db.matches.includes(profileId)) {
      db.matches.push(profileId);
    }

    await writeDB(db);

    const matchedProfile = isMatch
      ? db.profiles.find((profile) => profile.id === profileId)
      : null;

    return NextResponse.json({
      success: true,
      isMatch,
      match: matchedProfile
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to record swipe" },
      { status: 500 }
    );
  }
}
