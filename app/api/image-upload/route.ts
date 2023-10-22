// pages/api/upload.ts
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path';

// ... (other imports)

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = file.name;
  const filePath = path.join(process.cwd(), 'public', 'image', 'blogCoverImage', fileName);

  try {
    await writeFile(filePath, buffer);
    console.log(`File saved at ${filePath}`);

    // Return the image path or URL
    const imagePath = `/image/blogCoverImage/${fileName}`;
    console.log(data.get(imagePath));

    return NextResponse.json({ data: imagePath, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
