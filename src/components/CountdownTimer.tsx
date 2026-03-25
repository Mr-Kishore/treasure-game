import React, { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  seconds: number;
  onTimeUp: () => void;
  isRunning: boolean;
  resetTrigger: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  seconds, 
  onTimeUp, 
  isRunning,
  resetTrigger 
}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [resetTrigger, seconds]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onTimeUp]);

  const percentage = (timeLeft / seconds) * 100;
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 backdrop-blur-sm ${isCritical ? 'animate-pulse' : ''}`}>
      <Timer className={`w-5 h-5 ${isCritical ? 'text-destructive' : isLow ? 'text-secondary' : 'text-foreground'}`} />
      <div className="w-24 h-3 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 rounded-full ${
            isCritical ? 'bg-destructive' : isLow ? 'bg-secondary' : 'bg-accent'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`font-baloo text-lg min-w-[40px] ${isCritical ? 'text-destructive font-bold' : 'text-foreground'}`}>
        {timeLeft}s
      </span>
    </div>
  );
};

export default CountdownTimer;
