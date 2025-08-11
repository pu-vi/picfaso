"use client";

import { useState, useEffect } from "react";
import { ImageRecord } from "@/types/image";
import ImageCard from "@/components/ImageCard";

export default function ImagesPage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchImages = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/recent-uploads?page=${page}&limit=20`);
      const result = await response.json();
      if (response.ok) {
        setImages(result.images);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">All Images</h1>
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {images.map((image, index) => (
                <ImageCard key={image.imageId || index} image={image} />
              ))}
            </div>
            <div className="flex justify-center mt-10 gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow disabled:bg-gray-800 disabled:text-gray-500 transition-colors"
              >
                Previous
              </button>
              <span className="px-5 py-2 text-gray-300 bg-gray-900 rounded-lg border border-gray-800">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow disabled:bg-gray-800 disabled:text-gray-500 transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
