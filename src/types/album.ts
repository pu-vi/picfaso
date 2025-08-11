export interface Album {
  albumId?: string;
  label: string;
  description: string;
  coverImage: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
