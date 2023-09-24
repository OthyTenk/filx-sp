import { read } from "fs";
import { readFile, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

const writeLines = async (lines: string[], fileIndex: number) => {
  const filePath = join(process.cwd(), "public", `file-${fileIndex}.txt`);
  await writeFile(filePath, lines.join("\n"));
};

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ success: false, message: "No file uploaded" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = join(process.cwd(), "public", file.name);
  const result = await writeFile(filePath, buffer);
  console.log("File saved to", filePath);

  console.log("result ", result);

  const allDatas = await readFile(filePath, {
    encoding: "utf-8",
  });

  let fileIndex = 0;
  let indexCount = 0;

  let lines: string[] = [];

  allDatas.split("\n").forEach((line, index) => {
    lines.push(line);

    if (indexCount === 999 || index === lines.length - 1) {
      writeLines(lines, fileIndex);
      fileIndex++;
      indexCount = 0;
      lines = [];
    } else {
      indexCount++;
    }
  });

  console.log(`Used ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);

  return NextResponse.json({ success: true, message: "File uploaded" });
}
