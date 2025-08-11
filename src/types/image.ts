export interface ImageRecord {
  imageId: string;
  uploadedAt: Date;
  imgbb: {
    image: string | null;
    thumb: string | null;
    medium: string | null;
  } | null;
  freeimage: {
    image: string | null;
    thumb: string | null;
    medium: string | null;
  } | null;
  backup: {
    filename: string;
    path: string;
  } | null;
}