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
  await writeFile(filePath, buffer);

  const allData = await readFile(filePath, { encoding: "utf16le", flag: "r" });
  let fileIndex = 0;
  let indexCount = 0;

  let lines: string[] = [];

  const rows = allData.split("\n");

  allData.split("\n").forEach((line: string, index: number) => {
    const lineTemp = line.trim().replace(/¶/g, "").replace(/'/g, "&apos;");
    const separated = lineTemp.split(") ");

    separated[0] !== ")" &&
      lines.push(
        `INSERT INTO wpcc_name_directory_name(directory, published, letter, name, description) VALUES(2,1,'${separated[0][0]}','${separated[0]})','${separated[1]}');`
      );

    if (indexCount === 599 || index === lines.length - 1) {
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
