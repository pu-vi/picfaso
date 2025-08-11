import Image from "next/image";
import { useState } from "react";
import { ImageRecord } from "@/types/image";

interface ImageCardProps {
  image: ImageRecord;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const thumb =
    image.imgbb?.thumb || image.freeimage?.thumb || image.backup?.path;

  const primaryUrl =
    image.freeimage?.image || image.imgbb?.image || image.backup?.path;

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <>
      <div className="m-6 cursor-pointer" onClick={() => setShowLightbox(true)}>
        <Image
          src={thumb!}
          alt={image.imageId}
          width={99}
          height={99}
          className="rounded-lg object-cover hover:opacity-80 transition-opacity"
        />
      </div>

      {showLightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-2xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{image.imageId}</h3>
              <button
                onClick={() => setShowLightbox(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <Image
              src={primaryUrl!}
              alt={image.imageId}
              width={400}
              height={300}
              className="rounded-lg mb-4 mx-auto"
            />

            <div className="space-y-2">
              {image.imgbb?.image && (
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">IMGBB:</span>
                  <div className="flex gap-2">
                    <a
                      href={image.imgbb.image}
                      target="_blank"
                      className="text-blue-600 text-sm truncate max-w-xs"
                    >
                      {image.imgbb.image}
                    </a>
                    <button
                      onClick={() =>
                        handleDownload(
                          image.imgbb.image!,
                          `${image.imageId}_imgbb.jpg`
                        )
                      }
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}
              {image.freeimage?.image && (
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">FreeImage:</span>
                  <div className="flex gap-2">
                    <a
                      href={image.freeimage.image}
                      target="_blank"
                      className="text-blue-600 text-sm truncate max-w-xs"
                    >
                      {image.freeimage.image}
                    </a>
                    <button
                      onClick={() =>
                        handleDownload(
                          image.freeimage.image!,
                          `${image.imageId}_freeimage.jpg`
                        )
                      }
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}

              {image.backup?.path && (
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">Backup:</span>
                  <div className="flex gap-2">
                    <a
                      href={image.backup.path}
                      target="_blank"
                      className="text-blue-600 text-sm truncate max-w-xs"
                    >
                      {image.backup.path}
                    </a>
                    <button
                      onClick={() =>
                        handleDownload(
                          image.backup.path!,
                          image.backup.filename || `${image.imageId}_backup.jpg`
                        )
                      }
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard;
