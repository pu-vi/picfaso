"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("/api/upload-img", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        setUploadedUrl(result.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Picfaso</h1>
        <p className="text-gray-600 mb-8">Upload and organize your images</p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-lg font-medium text-gray-700">
              Select an image to upload
            </span>
            <span className="text-sm text-gray-500 mt-2">
              PNG, JPG, GIF up to 10MB
            </span>
          </label>
        </div>

        {selectedFile && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-700">Selected: {selectedFile.name}</p>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}

        {uploadedUrl && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 mb-3">Upload successful!</p>
            <Image
              src={uploadedUrl}
              alt="Uploaded"
              width={300}
              height={200}
              className="max-w-xs mx-auto rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
