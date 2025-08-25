import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselProps {
  children: React.ReactNode[];
  itemsPerView?: number;
  gap?: string;
  className?: string;
  autoScroll?: boolean;
  autoScrollDelay?: number;
}

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export const Carousel: React.FC<CarouselProps> = ({ 
  children, 
  itemsPerView = 3, 
  gap = '1.5rem',
  className = '',
  autoScroll = true,
  autoScrollDelay = 4000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout>();

  // Create infinite loop by duplicating items
  const infiniteChildren = [...children, ...children, ...children];
  const totalItems = children.length;

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(itemsPerView);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, [itemsPerView]);

  const goToSlide = useCallback((index: number, smooth: boolean = true) => {
    setCurrentIndex(index);
  }, []);

  const goLeft = useCallback(() => {
    const newIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, totalItems, goToSlide]);

  const goRight = useCallback(() => {
    const newIndex = currentIndex === totalItems - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, totalItems, goToSlide]);

  // Auto-scroll functionality
  useEffect(() => {
    if (autoScroll && !isHovered) {
      autoScrollRef.current = setInterval(() => {
        goRight();
      }, autoScrollDelay);
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [autoScroll, isHovered, goRight, autoScrollDelay]);

  // Handle infinite loop reset
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex >= totalItems) {
        setCurrentIndex(currentIndex - totalItems);
      } else if (currentIndex < 0) {
        setCurrentIndex(currentIndex + totalItems);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex, totalItems]);

  const itemWidth = `calc((100% - ${gap} * ${itemsToShow - 1}) / ${itemsToShow})`;
  const translateX = -(currentIndex + totalItems) * (100 / itemsToShow);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Buttons */}
      <button
        onClick={goLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-black/10 dark:border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-brand-mint hover:text-black shadow-lg hover:scale-110"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <button
        onClick={goRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-black/10 dark:border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-brand-mint hover:text-black shadow-lg hover:scale-110"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden mx-12">
        <motion.div
          ref={containerRef}
          className="flex"
          style={{ gap }}
          animate={{
            x: `${translateX}%`
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {infiniteChildren.map((child, index) => (
            <div
              key={`${index}-${Math.floor(index / totalItems)}`}
              className="flex-shrink-0"
              style={{ width: itemWidth }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === (currentIndex % totalItems)
                ? 'bg-brand-mint w-6' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};