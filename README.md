# Family Video Sharing Platform

A family-friendly video sharing platform where users can upload, watch, and download videos.

## Features
- Upload videos
- Watch videos in a responsive player
- Download videos
- Search functionality
- Mobile-first design
- Responsive layout

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/family-videos
```

4. Create the uploads directory:
```bash
mkdir -p public/uploads
```

5. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Usage
1. Open `http://localhost:3000` in your browser
2. Click the Upload button to share videos
3. Browse videos in the gallery
4. Click on videos to watch them
5. Use the download button to save videos locally

## Tech Stack
- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- File Upload: Multer
