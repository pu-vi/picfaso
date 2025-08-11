"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Toast from "@/components/Toast";
import { ImageRecord } from "@/types/image";
import ImageCard from "@/components/ImageCard";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [recentImages, setRecentImages] = useState<ImageRecord[]>([]);

  useEffect(() => {
    fetchRecentImages();
  }, []);

  const fetchRecentImages = async () => {
    try {
      const response = await fetch("/api/recent-uploads");
      const result = await response.json();
      if (response.ok) {
        setRecentImages(result.images);
      }
    } catch (error) {
      console.error("Failed to fetch recent images:", error);
    }
  };

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

      await response.json();

      if (response.ok) {
        setSelectedFile(null);
        setShowToast(true);
        fetchRecentImages();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex mt-9 justify-center">
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

        {recentImages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-9">Recent Uploads</h2>
            <div className="grid grid-cols-3 gap-4">
              {recentImages.map((img) => {
                const imageUrl =
                  img.freeimage?.thumb || img.backup?.path || img.imgbb?.image;
                return imageUrl ? (
                  <ImageCard
                    key={img.imageId}
                    imageId={img.imageId}
                    url={imageUrl}
                  />
                ) : null;
              })}
            </div>
          </div>
        )}

        <Toast
          message="Image uploaded successfully!"
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
}
