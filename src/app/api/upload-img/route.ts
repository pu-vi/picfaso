import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append('key', process.env.IMGBB_API_KEY!);
    imgbbFormData.append('image', file);

    const response = await fetch(process.env.IMGBB_API_URL!, {
      method: 'POST',
      body: imgbbFormData,
    });

    const result = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    return NextResponse.json({ 
      url: result.data.url,
      deleteUrl: result.data.delete_url 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}