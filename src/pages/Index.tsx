import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';
import TreasureChest from '@/components/TreasureChest';
import { playClickSound } from '@/lib/sounds';
import { GraduationCap } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [chestOpen, setChestOpen] = React.useState(false);

  const handleStartClick = () => {
    playClickSound();
    setChestOpen(true);
    setTimeout(() => {
      navigate('/select-mode');
    }, 800);
  };

  const handleTeacherClick = () => {
    playClickSound();
    navigate('/teacher');
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Teacher Login Button */}
        <Button
          variant="outline"
          onClick={handleTeacherClick}
          className="absolute top-4 right-4 font-fredoka"
        >
          <GraduationCap className="w-5 h-5 mr-2" />
          Teacher Mode
        </Button>

        {/* Title */}
        <div className="text-center mb-8 animate-float-slow">
          <h1 className="text-5xl md:text-7xl font-baloo font-bold text-foreground text-shadow-fun mb-4">
            Treasure Hunt
          </h1>
          <h2 className="text-3xl md:text-5xl font-fredoka font-semibold text-primary text-shadow-glow">
            Math Adventure
          </h2>
        </div>

        {/* Treasure Chest */}
        <div className="mb-10 animate-bounce-fun">
          <TreasureChest isOpen={chestOpen} className="scale-150" />
        </div>

        {/* Decorative stars */}
        <div className="absolute top-20 left-20 animate-sparkle">
          <Star size="lg" />
        </div>
        <div className="absolute top-32 right-24 animate-sparkle animation-delay-300">
          <Star />
        </div>
        <div className="absolute bottom-40 left-16 animate-sparkle animation-delay-500">
          <Star size="sm" />
        </div>
        <div className="absolute bottom-32 right-20 animate-sparkle animation-delay-700">
          <Star />
        </div>

        {/* Start Button */}
        <Button
          variant="treasure"
          size="xl"
          onClick={handleStartClick}
          className="text-2xl font-baloo tracking-wide"
        >
          🏝️ Start Adventure
        </Button>

        {/* Subtitle */}
        <p className="mt-6 text-lg md:text-xl text-foreground/80 font-fredoka text-center max-w-md">
          Solve math problems, find treasures, and become a Math Champion!
        </p>

        {/* Floating coins decoration */}
        <div className="absolute bottom-20 left-1/4 animate-float animation-delay-200">
          <Coin />
        </div>
        <div className="absolute bottom-28 right-1/4 animate-float animation-delay-500">
          <Coin />
        </div>
        <div className="absolute top-40 left-1/3 animate-float animation-delay-700">
          <Coin />
        </div>
      </div>
    </main>
  );
};

const Star: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.4 : 1;
  return (
    <svg width={40 * scale} height={40 * scale} viewBox="0 0 40 40">
      <polygon
        points="20,2 25,15 38,15 27,24 31,38 20,30 9,38 13,24 2,15 15,15"
        fill="hsl(45 93% 58%)"
        stroke="hsl(45 93% 45%)"
        strokeWidth="1"
      />
    </svg>
  );
};

const Coin: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 30 30">
    <circle cx="15" cy="15" r="14" fill="hsl(45 80% 50%)" stroke="hsl(45 90% 40%)" strokeWidth="2" />
    <circle cx="15" cy="15" r="10" fill="hsl(45 85% 55%)" />
    <text x="15" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="hsl(45 90% 35%)">$</text>
  </svg>
);

export default Index;
