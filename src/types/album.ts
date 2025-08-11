export interface Album {
  _id?: string;
  label: string;
  description: string;
  coverImage: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
