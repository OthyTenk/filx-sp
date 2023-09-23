import { writeFile } from "fs/promises";
import { join } from "path";

export default function ServerUploadPage() {
  async function uploadFile(fileData: FormData) {
    "use server";

    const file: File | null = fileData.get("file") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = join(process.cwd(), "public", file.name);
    await writeFile(filePath, buffer);

    console.log("File written to", filePath);

    return {
      success: true,
    };
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>React Server Component: Upload</h1>

      <form action={uploadFile}>
        <input type="file" name="file" />
        <input
          type="submit"
          value="Upload"
          className="text-white border-b-orange-200 border p-2 bg-blue-600"
        />
      </form>
    </main>
  );
}
