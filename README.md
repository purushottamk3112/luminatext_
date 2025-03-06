# LuminaText

LuminaText is a modern web application that transcribes audio and video files into text using OpenAI's Whisper model.

## Features

- Audio and video transcription (MP3, WAV, MP4)
- Real-time progress tracking
- Download transcriptions as text files
- Copy to clipboard functionality
- File size limit: 25MB
- Beautiful, responsive UI

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend
- Python 3.12
- FastAPI
- OpenAI Whisper
- FFmpeg
- Pydub

## Setup

1. Install Dependencies:

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
npm install
```

2. Start the Services:

```bash
# Using Docker Compose
docker-compose up

# Or manually:
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload

# Terminal 2 - Frontend
npm run dev
```

3. Access the application at `http://localhost:5173`

## API Documentation

Once the backend is running, access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

## License

MIT