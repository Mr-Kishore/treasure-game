import React from 'react';
import { Heart, Coins } from 'lucide-react';

interface GameStatsProps {
  lives: number;
  coins: number;
  maxLives?: number;
}

const GameStats: React.FC<GameStatsProps> = ({ lives, coins, maxLives = 3 }) => {
  return (
    <div className="flex items-center gap-4">
      {/* Lives */}
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-card/50 backdrop-blur-sm">
        {[...Array(maxLives)].map((_, i) => (
          <Heart
            key={i}
            className={`w-5 h-5 ${i < lives ? 'text-destructive fill-destructive' : 'text-muted-foreground'}`}
          />
        ))}
      </div>

      {/* Coins */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/50 backdrop-blur-sm">
        <Coins className="w-5 h-5 text-yellow-500" />
        <span className="font-baloo text-lg text-foreground">{coins}</span>
      </div>
    </div>
  );
};

export default GameStats;
