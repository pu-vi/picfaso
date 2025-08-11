import { NextRequest, NextResponse } from "next/server";
import {
  extractFreeImageHostUrls,
  extractIbbImageUrls,
  extractPhpImageUrls
} from "@/utils/json.response.format";
import { connectToDatabase } from "@/lib/mongodb";
import { ImageRecord } from "@/types/image";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const randomName = `img_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}.${file.name.split(".").pop()}`;
    const renamedFile = new File([file], randomName, { type: file.type });

    const imgbbFormData = new FormData();
    imgbbFormData.append("key", process.env.IMGBB_API_KEY!);
    imgbbFormData.append("image", renamedFile);

    const freeImageFormData = new FormData();
    freeImageFormData.append("key", process.env.FREEIMAGE_API_KEY!);
    freeImageFormData.append("source", renamedFile);

    const phpFormData = new FormData();
    phpFormData.append("file", renamedFile);

    const [imgbbResponse, freeImageResponse, phpResponse] = await Promise.all([
      fetch(process.env.IMGBB_API_URL!, {
        method: "POST",
        body: imgbbFormData
      }),
      fetch(process.env.FREEIMAGE_API_URL!, {
        method: "POST",
        body: freeImageFormData
      }),
      fetch(`${process.env.PHP_UPLOAD_URL}/upload.php`!, {
        method: "POST",
        body: phpFormData
      })
    ]);

    const [imgbbResult, freeImageResult, phpResult] = await Promise.all([
      imgbbResponse.json(),
      freeImageResponse.json(),
      phpResponse.json()
    ]);

    const uploads = {
      imgbb: imgbbResponse.ok ? extractIbbImageUrls(imgbbResult) : null,
      freeimage: freeImageResponse.ok
        ? extractFreeImageHostUrls(freeImageResult)
        : null,
      backup: phpResponse.ok ? extractPhpImageUrls(phpResult) : null
    };

    if (!uploads.imgbb && !uploads.freeimage && !uploads.backup) {
      return NextResponse.json(
        { error: "All uploads (IMGBB, FreeImage, PHP) failed" },
        { status: 500 }
      );
    }

    const db = await connectToDatabase();
    const imageRecord: Omit<ImageRecord, "_id"> = {
      imageId: randomName.split(".")[0],
      uploadedAt: new Date(),
      ...uploads
    };

    await db.collection("images").insertOne(imageRecord);

    return NextResponse.json({ uploads });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
