import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const { imageIds } = await request.json();
    const { albumId } = await params;

    if (!imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: "Image IDs are required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    await db.collection("albums").updateOne(
      { _id: new ObjectId(albumId) },
      {
        $addToSet: { images: { $each: imageIds } },
        $set: { updatedAt: new Date() }
      }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to add images to album" },
      { status: 500 }
    );
  }
}
