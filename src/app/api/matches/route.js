
import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await readDB();

    const matches = db.profiles.filter(
      (profile) => db.matches.includes(profile.id)
    );

    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load matches" },
      { status: 500 }
    );
  }
}
