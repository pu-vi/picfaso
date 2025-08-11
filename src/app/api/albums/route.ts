import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Album } from "@/types/album";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const db = await connectToDatabase();
    const albums = await db
      .collection<Album>("albums")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection<Album>("albums").countDocuments();

    return NextResponse.json({
      albums,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch albums" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { label, description, coverImage } = await request.json();

    const db = await connectToDatabase();
    const album: Omit<Album, "albumId"> = {
      label,
      description,
      coverImage,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("albums").insertOne(album);

    return NextResponse.json({
      albumId: result.insertedId,
      ...album
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create album" },
      { status: 500 }
    );
  }
}
