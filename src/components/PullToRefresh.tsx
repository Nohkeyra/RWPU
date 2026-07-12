import { useState, useRef } from 'react';

export function PullToRefresh({ children, onRefresh }: { children: React.ReactNode, onRefresh: () => void }) {
  const [startY, setStartY] = useState(0);
  const [pullDist, setPullDist] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only start if at the top of the scrollable area
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && startY > 0) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      if (diff > 0) {
        // Prevent default scrolling only when pulling down at the top
        if (diff > 5) {
           e.preventDefault();
        }
        setPullDist(Math.min(diff, 100)); // Limit pull distance
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDist > 80) {
      onRefresh();
    }
    setPullDist(0);
    setStartY(0);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full"
    >
      {pullDist > 0 && (
        <div 
          style={{ height: pullDist }} 
          className="flex items-center justify-center overflow-hidden text-sunshine font-accent text-xs uppercase tracking-widest bg-deep-forest/50"
        >
          {pullDist > 80 ? 'Release to refresh' : 'Pull down to refresh...'}
        </div>
      )}
      {children}
    </div>
  );
}
