import React from 'react';
import { motion } from 'framer-motion';

interface VerticalVideoCardProps {
  video: {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
    videoUrl: string;
    isYouTube?: boolean;
  };
  onClick: () => void;
}

const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

export const VerticalVideoCard: React.FC<VerticalVideoCardProps> = ({ video, onClick }) => {
  return (
    <motion.div 
      onClick={onClick}
      className="relative bg-gray-50/50 dark:bg-white/5 rounded-2xl overflow-hidden cursor-pointer group border border-black/10 dark:border-white/10 hover:border-brand-mint/50 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Video Container - Vertical aspect ratio like Instagram Reels */}
      <div className="aspect-[9/16] relative overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <PlayIcon className="w-8 h-8 text-white ml-1" />
          </div>
        </div>

        {/* YouTube badge */}
        {video.isYouTube && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
            YouTube
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-brand-mint/90 text-black text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">
          {video.category}
        </div>

        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
            {video.title}
          </h3>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-brand-mint/30 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};