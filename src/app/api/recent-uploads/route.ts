import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ImageRecord } from "@/types/image";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const images = await db
      .collection<ImageRecord>("images")
      .find({})
      .sort({ uploadedAt: -1 })
      .limit(6)
      .toArray();

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
