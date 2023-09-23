"use client";
import { FormEvent, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File>();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log(data);

      if (!data.success) {
        throw new Error(await data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={onSubmit}>
        <div className="z-10 max-w-7xl w-full items-center justify-between font-mono text-sm ">
          <h1>React Client Component: Upload</h1>
          <br />
          <br />
          <div className="flex flex-col items-center justify-between">
            <input
              type="file"
              name="file"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
            <input
              type="submit"
              value="Upload"
              className="text-white border-b-orange-200 border p-2 bg-blue-600"
            />
          </div>
        </div>
      </form>
    </main>
  );
}
