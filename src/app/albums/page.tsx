"use client";

import { useState, useEffect } from "react";
import { Album } from "@/types/album";
import AlbumForm from "@/components/AlbumForm";
import Image from "next/image";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchAlbums = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/albums?page=${page}&limit=10`);
      const result = await response.json();
      if (response.ok) {
        setAlbums(result.albums);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch albums:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAlbum = async (albumData: {
    label: string;
    description: string;
    coverImage: string;
  }) => {
    try {
      const response = await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(albumData)
      });

      if (response.ok) {
        setShowCreateForm(false);
        fetchAlbums(currentPage);
      }
    } catch (error) {
      console.error("Failed to create album:", error);
    }
  };

  useEffect(() => {
    fetchAlbums(currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Albums</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Album
          </button>
        </div>

        {showCreateForm && (
          <AlbumForm
            createAlbum={createAlbum}
            closeForm={() => setShowCreateForm(false)}
          />
        )}

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map((album, index) => (
                <div
                  key={album.albumId || index}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  {album.coverImage ? (
                    <Image
                      src={album.coverImage}
                      alt={album.label}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-400">No Cover</span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold mb-1">{album.label}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {album.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {album.images.length} images
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
