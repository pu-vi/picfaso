# Picfaso - Image Management Platform

Picfaso is a modern web application for uploading, organizing, and managing your images with multi-platform backup and album organization capabilities.

## Features

### 🖼️ Image Upload & Management
- **Multi-Platform Upload**: Automatically uploads images to IMGBB, FreeImage, and a backup PHP server for redundancy
- **Randomized Filenames**: Ensures unique file names to prevent conflicts
- **Image Gallery**: Browse all uploaded images with pagination (20 images per page)
- **Lightbox View**: Click any image to view in full size with direct URLs and download options

### 📁 Album Organization
- **Create Albums**: Organize images into custom albums with names, descriptions, and cover images
- **Bulk Selection**: Select multiple images and add them to albums efficiently
- **Album Gallery**: Browse albums with cover images and image counts
- **Album Details**: View album contents with pagination

### 🔗 Multi-Platform Integration
- **IMGBB Integration**: Primary image hosting with API key authentication
- **FreeImage Integration**: Secondary hosting for redundancy
- **PHP Backup Server**: Additional backup storage option
- **MongoDB Storage**: Metadata and album information storage

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- API keys for IMGBB and FreeImage
- PHP server for backup storage (optional)

### Environment Setup
Create a `.env.local` file with:
```bash
# MongoDB
MONGO_URI=your_mongodb_connection_string

# Image Hosting APIs
IMGBB_API_KEY=your_imgbb_api_key
IMGBB_API_URL=https://api.imgbb.com/1/upload

FREEIMAGE_API_KEY=your_freeimage_api_key
FREEIMAGE_API_URL=https://freeimage.host/api/1/upload

# Backup Server (Optional)
PHP_UPLOAD_URL=your_php_server_upload_endpoint

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Installation & Running
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## Usage

### Uploading Images
1. Go to the home page
2. Select an image file (PNG, JPG, GIF up to 10MB)
3. Click "Upload" - the image will be uploaded to all configured platforms
4. View recent uploads in the grid below

### Managing Albums
1. Navigate to "Albums" in the header
2. Click "Create Album" to make a new album
3. Go to "Images" to select and add images to albums
4. Use bulk selection and "Add to Album" feature

### Viewing Images
- **All Images**: Browse all uploaded images with pagination
- **Album View**: Click any album to see its contents
- **Lightbox**: Click images for full-size view with download options

## Technology Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Image Hosting**: IMGBB, FreeImage, Custom PHP Server
- **Database**: MongoDB for metadata and album organization

## Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── types/              # TypeScript type definitions
├── lib/                # Database and utility functions
└── utils/              # Helper functions and formatters
```

## Contributing
This project is designed for personal image management with multi-platform redundancy. Feel free to fork and customize for your needs.