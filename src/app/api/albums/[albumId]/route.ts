import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * GET /api/albums/[albumId]
 * Retrieves album details with paginated images
 * 
 * @param request - Contains page and limit query parameters
 * @param params - Contains albumId from URL parameters
 * @returns Album details with paginated images and pagination info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const { albumId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    if (!ObjectId.isValid(albumId)) {
      return NextResponse.json({ error: "Invalid album ID" }, { status: 400 });
    }

    const db = await connectToDatabase();

    const album = await db
      .collection("albums")
      .findOne({ _id: new ObjectId(albumId) });
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const imageIds = album.images || [];
    const paginatedImageIds = imageIds.slice(skip, skip + limit);

    const images = await db
      .collection("images")
      .find({ imageId: { $in: paginatedImageIds } })
      .toArray();

    return NextResponse.json({
      album,
      images,
      pagination: {
        page,
        limit,
        total: imageIds.length,
        totalPages: Math.ceil(imageIds.length / limit)
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch album" },
      { status: 500 }
    );
  }
}
