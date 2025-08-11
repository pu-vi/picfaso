import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ImageRecord } from "@/types/image";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;

    const db = await connectToDatabase();
    const images = await db
      .collection<ImageRecord>("images")
      .find({})
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection<ImageRecord>("images").countDocuments();
    
    return NextResponse.json({ 
      images, 
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
