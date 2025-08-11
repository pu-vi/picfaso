import Image from "next/image";

interface ImageCardProps {
  imageId: string;
  url: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageId, url }) => {
  return (
    <div className="m-6">
      <Image
        key={imageId}
        src={url}
        alt={imageId}
        width={99}
        height={99}
        className="rounded-lg object-cover"
      />
    </div>
  );
};

export default ImageCard;
