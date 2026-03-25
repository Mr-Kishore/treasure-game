import React from 'react';
import { cn } from '@/lib/utils';

interface BoyCharacterProps {
  state: 'idle' | 'running' | 'celebrating' | 'crying';
  className?: string;
}

const BoyCharacter: React.FC<BoyCharacterProps> = ({ state, className }) => {
  return (
    <div
      className={cn(
        'transition-all duration-500',
        state === 'running' && 'animate-run',
        state === 'celebrating' && 'animate-celebrate',
        state === 'crying' && 'animate-cry',
        className
      )}
    >
      <svg width="120" height="180" viewBox="0 0 120 180">
        {/* Shadow */}
        <ellipse cx="60" cy="175" rx="30" ry="5" fill="hsl(25 30% 20% / 0.3)" />

        {/* Legs */}
        <g className={cn(state === 'running' && 'animate-bounce-fun')}>
          {/* Left leg */}
          <rect
            x="40"
            y="130"
            width="15"
            height="35"
            rx="5"
            fill="hsl(25 60% 70%)"
            className={cn(state === 'running' && 'origin-top animate-[swing_0.3s_ease-in-out_infinite]')}
          />
          {/* Left shoe */}
          <ellipse cx="47" cy="168" rx="12" ry="6" fill="hsl(25 30% 30%)" />

          {/* Right leg */}
          <rect
            x="65"
            y="130"
            width="15"
            height="35"
            rx="5"
            fill="hsl(25 60% 70%)"
            className={cn(state === 'running' && 'origin-top animate-[swing_0.3s_ease-in-out_infinite_0.15s]')}
          />
          {/* Right shoe */}
          <ellipse cx="72" cy="168" rx="12" ry="6" fill="hsl(25 30% 30%)" />
        </g>

        {/* Body / T-shirt */}
        <rect x="35" y="75" width="50" height="60" rx="10" fill="hsl(199 89% 55%)" />
        {/* Shirt collar */}
        <path d="M50,75 L60,85 L70,75" fill="hsl(199 89% 45%)" />

        {/* Arms */}
        <g className={cn(state === 'celebrating' && 'animate-[wave_0.5s_ease-in-out_infinite]')}>
          {/* Left arm */}
          <rect
            x="20"
            y="80"
            width="18"
            height="35"
            rx="8"
            fill="hsl(25 60% 70%)"
            transform={state === 'celebrating' ? 'rotate(-45 29 80)' : 'rotate(0)'}
            className="transition-transform duration-300"
          />
          {/* Left hand */}
          <circle
            cx={state === 'celebrating' ? '12' : '29'}
            cy={state === 'celebrating' ? '60' : '118'}
            r="10"
            fill="hsl(25 60% 70%)"
            className="transition-all duration-300"
          />

          {/* Right arm */}
          <rect
            x="82"
            y="80"
            width="18"
            height="35"
            rx="8"
            fill="hsl(25 60% 70%)"
            transform={state === 'celebrating' ? 'rotate(45 91 80)' : 'rotate(0)'}
            className="transition-transform duration-300"
          />
          {/* Right hand */}
          <circle
            cx={state === 'celebrating' ? '108' : '91'}
            cy={state === 'celebrating' ? '60' : '118'}
            r="10"
            fill="hsl(25 60% 70%)"
            className="transition-all duration-300"
          />
        </g>

        {/* Head */}
        <circle cx="60" cy="45" r="35" fill="hsl(25 60% 75%)" />

        {/* Hair */}
        <ellipse cx="60" cy="20" rx="30" ry="15" fill="hsl(25 40% 25%)" />
        <circle cx="35" cy="30" r="8" fill="hsl(25 40% 25%)" />
        <circle cx="85" cy="30" r="8" fill="hsl(25 40% 25%)" />

        {/* Face */}
        {state === 'crying' ? (
          <>
            {/* Sad eyes */}
            <path d="M42,42 Q48,48 54,42" stroke="hsl(25 30% 20%)" strokeWidth="3" fill="none" />
            <path d="M66,42 Q72,48 78,42" stroke="hsl(25 30% 20%)" strokeWidth="3" fill="none" />
            {/* Tears */}
            <ellipse cx="45" cy="55" rx="4" ry="8" fill="hsl(199 89% 70%)" className="animate-float" />
            <ellipse cx="75" cy="55" rx="4" ry="8" fill="hsl(199 89% 70%)" className="animate-float animation-delay-200" />
            {/* Sad mouth */}
            <path d="M45,65 Q60,55 75,65" stroke="hsl(25 30% 20%)" strokeWidth="3" fill="none" />
          </>
        ) : state === 'celebrating' ? (
          <>
            {/* Happy closed eyes */}
            <path d="M42,42 Q48,36 54,42" stroke="hsl(25 30% 20%)" strokeWidth="3" fill="none" />
            <path d="M66,42 Q72,36 78,42" stroke="hsl(25 30% 20%)" strokeWidth="3" fill="none" />
            {/* Big smile */}
            <path d="M40,60 Q60,80 80,60" stroke="hsl(25 30% 20%)" strokeWidth="3" fill="hsl(350 70% 60%)" />
            {/* Blush */}
            <ellipse cx="35" cy="55" rx="8" ry="5" fill="hsl(350 70% 75%)" opacity="0.6" />
            <ellipse cx="85" cy="55" rx="8" ry="5" fill="hsl(350 70% 75%)" opacity="0.6" />
          </>
        ) : (
          <>
            {/* Normal eyes */}
            <circle cx="48" cy="42" r="6" fill="white" />
            <circle cx="72" cy="42" r="6" fill="white" />
            <circle cx="50" cy="43" r="3" fill="hsl(25 30% 20%)" />
            <circle cx="74" cy="43" r="3" fill="hsl(25 30% 20%)" />
            {/* Normal smile */}
            <path d="M45,62 Q60,72 75,62" stroke="hsl(25 30% 20%)" strokeWidth="3" fill="none" />
          </>
        )}

        {/* Ears */}
        <ellipse cx="25" cy="45" rx="5" ry="8" fill="hsl(25 60% 70%)" />
        <ellipse cx="95" cy="45" rx="5" ry="8" fill="hsl(25 60% 70%)" />

        {/* Stars around head when celebrating */}
        {state === 'celebrating' && (
          <>
            <g className="animate-sparkle">
              <polygon points="10,20 12,16 16,18 12,14 10,10 8,14 4,18 8,16" fill="hsl(45 93% 58%)" />
            </g>
            <g className="animate-sparkle animation-delay-200">
              <polygon points="100,15 102,11 106,13 102,9 100,5 98,9 94,13 98,11" fill="hsl(45 93% 58%)" />
            </g>
            <g className="animate-sparkle animation-delay-300">
              <polygon points="60,0 62,-4 66,-2 62,-6 60,-10 58,-6 54,-2 58,-4" fill="hsl(45 93% 58%)" />
            </g>
          </>
        )}
      </svg>
    </div>
  );
};

export default BoyCharacter;
