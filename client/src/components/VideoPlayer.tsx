import React from 'react';
import { X, Play, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onClose }) => {
  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  // Added modestbranding=1 and color=red to embed URL for YouTube branding consistency
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=red` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-8">
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 truncate max-w-[80%]">{title}</h3>
          <button
            onClick={onClose}
            // Updated close button hover color
            className="p-2 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Close video player"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Video Container - flex-1 min-h-0 ensures it grows but doesn't overflow */}
        <div className="flex-1 min-h-0 flex flex-col justify-center items-center bg-black px-2 py-4 md:py-8 overflow-auto">
          <div className="w-full max-w-3xl h-full flex items-center justify-center">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={title}
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ objectFit: 'contain', background: 'black' }}
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 text-white rounded-lg">
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Video not available</p>
                    <p className="text-sm opacity-75 mt-2">Please check the video URL</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls/Info */}
        <div className="flex-shrink-0 p-4 md:p-6 bg-gray-50 border-t border-gray-200 sticky bottom-0 z-10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-4">
              {/* Updated "Now Playing" icon background and color */}
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm md:text-base">Now Playing</p>
                <p className="text-xs md:text-sm text-gray-600 max-w-xs truncate">{title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
              <Volume2 className="w-4 h-4" />
              <span>HD Quality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
