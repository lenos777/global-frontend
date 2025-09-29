import { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

const ImageZoomModal = ({ src, alt, isOpen, onClose }) => {
  // Prevent background scroll when zoomed
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Handle click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Minimalist close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 focus:outline-none"
          aria-label="Close zoom"
        >
          <X className="h-6 w-6 md:h-8 md:w-8" />
        </button>
        
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain"
          tabIndex="0"
        />
      </div>
    </div>
  );
};

const ZoomableImage = ({ src, alt, className = "", ...props }) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (currentSrc !== '/default-certificate.jpg') {
      setCurrentSrc('/default-certificate.jpg');
    }
  };

  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => setIsZoomOpen(true)}>
        <img
          src={currentSrc}
          alt={alt}
          className={`${className} transition-transform duration-300 group-hover:scale-105`}
          onError={handleError}
          {...props}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center rounded-lg">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>
      
      <ImageZoomModal
        src={currentSrc}
        alt={alt}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </>
  );
};

export default ZoomableImage;