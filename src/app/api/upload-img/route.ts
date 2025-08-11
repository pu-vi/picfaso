import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append("key", process.env.IMGBB_API_KEY!);
    imgbbFormData.append("image", file);

    const freeImageFormData = new FormData();
    freeImageFormData.append("key", process.env.FREEIMAGE_API_KEY!);
    freeImageFormData.append("source", file);

    const phpFormData = new FormData();
    phpFormData.append("file", file);

    const [imgbbResponse, freeImageResponse, phpResponse] = await Promise.all([
      fetch(process.env.IMGBB_API_URL!, {
        method: "POST",
        body: imgbbFormData
      }),
      fetch(process.env.FREEIMAGE_API_URL!, {
        method: "POST",
        body: freeImageFormData
      }),
      fetch(process.env.PHP_UPLOAD_URL!, {
        method: "POST",
        body: phpFormData
      })
    ]);

    const [imgbbResult, freeImageResult, phpResult] = await Promise.all([
      imgbbResponse.json(),
      freeImageResponse.json(),
      phpResponse.json()
    ]);

    console.log(phpResult);

    const uploads = {
      imgbb: imgbbResponse.ok ? imgbbResult.data.url : null,
      freeimage: freeImageResponse.ok ? freeImageResult.image.url : null,
      php: phpResponse.ok ? phpResult.url : null
    };

    if (!uploads.imgbb && !uploads.freeimage && !uploads.php) {
      return NextResponse.json(
        { error: "All uploads (IMGBB, FreeImage, PHP) failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ uploads });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
