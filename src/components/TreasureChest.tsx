import React from 'react';
import { cn } from '@/lib/utils';

interface TreasureChestProps {
  isOpen?: boolean;
  className?: string;
}

const TreasureChest: React.FC<TreasureChestProps> = ({ isOpen = false, className }) => {
  return (
    <div className={cn('relative', className)}>
      <svg width="100" height="80" viewBox="0 0 100 80">
        {/* Chest body */}
        <rect x="10" y="35" width="80" height="45" rx="5" fill="hsl(25 70% 35%)" />
        <rect x="15" y="40" width="70" height="35" rx="3" fill="hsl(25 60% 45%)" />
        
        {/* Metal bands */}
        <rect x="8" y="45" width="84" height="6" fill="hsl(45 70% 45%)" />
        <rect x="8" y="60" width="84" height="6" fill="hsl(45 70% 45%)" />
        
        {/* Lock */}
        <rect x="42" y="48" width="16" height="20" rx="3" fill="hsl(45 80% 50%)" />
        <circle cx="50" cy="58" r="4" fill="hsl(25 30% 20%)" />
        
        {/* Lid */}
        <g 
          className="transition-transform duration-500 origin-bottom"
          style={{ transform: isOpen ? 'rotateX(-120deg)' : 'rotateX(0deg)' }}
        >
          <path 
            d="M10,35 Q50,0 90,35 L90,35 L10,35 Z" 
            fill="hsl(25 70% 35%)"
          />
          <path 
            d="M15,33 Q50,5 85,33 L85,33 L15,33 Z" 
            fill="hsl(25 60% 45%)"
          />
          {/* Lid metal band */}
          <path 
            d="M8,32 Q50,2 92,32" 
            stroke="hsl(45 70% 45%)" 
            strokeWidth="6" 
            fill="none"
          />
        </g>
        
        {/* Glow when open */}
        {isOpen && (
          <ellipse 
            cx="50" 
            cy="50" 
            rx="25" 
            ry="15" 
            fill="hsl(45 93% 58%)" 
            opacity="0.6"
            className="animate-pulse"
          />
        )}
      </svg>
      
      {/* Coins animation when open */}
      {isOpen && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${(i - 2) * 15}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="9" fill="hsl(45 80% 50%)" stroke="hsl(45 90% 40%)" strokeWidth="2" />
                <text x="10" y="14" textAnchor="middle" fontSize="10" fill="hsl(45 90% 35%)">$</text>
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreasureChest;
