"use client";

import { useState, useEffect } from "react";
import { ImageRecord } from "@/types/image";
import { Album } from "@/types/album";
import ImageCard from "@/components/ImageCard";

export default function ImagesPage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState("");

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

  const fetchAlbums = async () => {
    try {
      const response = await fetch("/api/albums?limit=100");
      const result = await response.json();
      if (response.ok) {
        setAlbums(result.albums);
      }
    } catch (error) {
      console.error("Failed to fetch albums:", error);
    }
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedImages((prev) =>
      prev.length === images.length
        ? []
        : (images.map((img) => img.imageId).filter(Boolean) as string[])
    );
  };

  const addToAlbum = async () => {
    if (!selectedAlbum || selectedImages.length === 0) return;

    try {
      const response = await fetch(`/api/albums/${selectedAlbum}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageIds: selectedImages })
      });

      if (response.ok) {
        setSelectedImages([]);
        setSelectedAlbum("");
      }
    } catch (error) {
      console.error("Failed to add images to album:", error);
    }
  };

  useEffect(() => {
    fetchImages(currentPage);
    fetchAlbums();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">All Images</h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center text-gray-300">
              <input
                type="checkbox"
                checked={
                  selectedImages.length === images.length && images.length > 0
                }
                onChange={toggleSelectAll}
                className="mr-2"
              />
              Select All
            </label>
            {selectedImages.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                  className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-600"
                >
                  <option value="">Select Album</option>
                  {albums.map((album) => (
                    <option key={album._id} value={album._id}>
                      {album.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addToAlbum}
                  disabled={!selectedAlbum}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600"
                >
                  Add to Album ({selectedImages.length})
                </button>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {images.map((image, index) => (
                <div key={image.imageId || index} className="relative">
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image.imageId!)}
                    onChange={() => toggleImageSelection(image.imageId!)}
                    className="absolute top-2 left-2 z-10 w-4 h-4"
                  />
                  <ImageCard image={image} />
                </div>
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
