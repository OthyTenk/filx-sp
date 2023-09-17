import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file:File | null = data.get('file') as File

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const filePath = join(process.cwd(), 'public', file.name)
    await writeFile(filePath, buffer)
    console.log('File saved to', filePath)

    return NextResponse.json({ success: true, message: 'File uploaded' })
}