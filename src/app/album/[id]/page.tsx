'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ImageRecord } from '@/types/image';
import { Album } from '@/types/album';
import ImageCard from '@/components/ImageCard';
import Image from 'next/image';

export default function AlbumPage() {
  const params = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchAlbumData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/albums/${params.id}?page=${page}&limit=20`);
      const result = await response.json();
      if (response.ok) {
        setAlbum(result.album);
        setImages(result.images);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch album:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchAlbumData(currentPage);
    }
  }, [params.id, currentPage]);

  if (loading) {
    return <div className="min-h-screen p-8 text-center">Loading...</div>;
  }

  if (!album) {
    return <div className="min-h-screen p-8 text-center">Album not found</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          {album.coverImage && (
            <Image 
              src={album.coverImage} 
              alt={album.label} 
              width={400} 
              height={200} 
              className="w-full h-64 object-cover rounded-lg mb-4" 
            />
          )}
          <h1 className="text-4xl font-bold mb-2">{album.label}</h1>
          <p className="text-gray-600 mb-4">{album.description}</p>
          <p className="text-sm text-gray-500">{album.images.length} images</p>
        </div>

        {images.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((image, index) => (
                <ImageCard key={image.imageId || index} image={image} />
              ))}
            </div>
            
            <div className="flex justify-center mt-8 gap-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">No images in this album</div>
        )}
      </div>
    </div>
  );
}