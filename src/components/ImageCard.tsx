import Image from "next/image";
import { useState } from "react";
import { ImageRecord } from "@/types/image";
import UrlCopyField from "./UrlCopyField";

interface ImageCardProps {
  image: ImageRecord;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  console.log(image);
  const thumb =
    image.imgbb?.thumb || image.freeimage?.thumb || image.backup?.path;

  const primaryUrl =
    image.freeimage?.image || image.imgbb?.image || image.backup?.path;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = primaryUrl!;
    link.download = `${image.imageId}.jpg`;
    link.click();
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <>
      <div
        className="m-6 cursor-pointer bg-gray-900 rounded-lg p-2 border border-gray-800 hover:shadow-lg transition-shadow"
        onClick={() => setShowLightbox(true)}
      >
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
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="bg-gray-900 p-6 rounded-lg max-w-2xl max-h-[90vh] overflow-auto border border-gray-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">
                {image.imageId}
              </h3>
              <button
                onClick={() => setShowLightbox(false)}
                className="text-gray-400 hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>

            <Image
              src={primaryUrl!}
              alt={image.imageId}
              width={400}
              height={300}
              className="rounded-lg mb-4 mx-auto border border-gray-800"
            />

            <div className="mb-4">
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Download Image
              </button>
            </div>

            <div className="space-y-3">
              {image.imgbb?.image && (
                <UrlCopyField
                  label="IMGBB"
                  url={image.imgbb.image}
                  onCopy={copyToClipboard}
                />
              )}
              {image.freeimage?.image && (
                <UrlCopyField
                  label="FreeImage"
                  url={image.freeimage.image}
                  onCopy={copyToClipboard}
                />
              )}
              {image.backup?.path && (
                <UrlCopyField
                  label="Backup"
                  url={image.backup.path}
                  onCopy={copyToClipboard}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard;
