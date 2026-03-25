import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';
import { getLevelTheme } from '@/lib/mathProblems';
import { playClickSound } from '@/lib/sounds';
import { ArrowLeft } from 'lucide-react';

const Levels: React.FC = () => {
  const navigate = useNavigate();
  const arithmeticLevels = Array.from({ length: 100 }, (_, i) => i + 1);
  const wordProblemLevels = Array.from({ length: 50 }, (_, i) => i + 101);

  const handleLevelClick = (level: number) => {
    playClickSound();
    navigate(`/game/${level}`);
  };

  const handleBackClick = () => {
    playClickSound();
    navigate('/select-mode');
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleBackClick}
            className="font-fredoka"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl md:text-5xl font-baloo font-bold text-foreground text-shadow-fun text-center">
            🏝️ Choose Your Island
          </h1>

          <div className="w-24" /> {/* Spacer for alignment */}
        </div>

        {/* Arithmetic Levels Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-baloo font-bold text-foreground mb-4 text-center">
            🔢 Arithmetic Islands (1-100)
          </h2>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 md:gap-4">
            {arithmeticLevels.map((level) => (
              <LevelButton
                key={level}
                level={level}
                onClick={() => handleLevelClick(level)}
              />
            ))}
          </div>

          {/* Arithmetic Legend */}
          <div className="mt-6 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl font-fredoka text-sm">
                1-25: Addition
              </span>
              <span className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl font-fredoka text-sm">
                26-50: + & −
              </span>
              <span className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl font-fredoka text-sm">
                51-75: +, −, ×
              </span>
              <span className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl font-fredoka text-sm">
                76-100: All Operations
              </span>
            </div>
          </div>
        </div>

        {/* Word Problem Levels Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-baloo font-bold text-foreground mb-4 text-center">
            📖 Story Islands (101-150)
          </h2>
          <p className="text-center text-foreground/80 font-fredoka mb-4">
            Word problems with stories! Type your answer to solve.
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 md:gap-4">
            {wordProblemLevels.map((level) => (
              <LevelButton
                key={level}
                level={level}
                onClick={() => handleLevelClick(level)}
                isWordProblem
              />
            ))}
          </div>

          {/* Word Problem Legend */}
          <div className="mt-6 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl font-fredoka text-sm">
                Addition & Subtraction Stories
              </span>
              <span className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl font-fredoka text-sm">
                Multiplication & Division
              </span>
              <span className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl font-fredoka text-sm">
                Geometry & Perimeter
              </span>
              <span className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl font-fredoka text-sm">
                Money & Time Problems
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-foreground/80 font-fredoka text-lg">
            🌴 Each island has unique math challenges!
          </p>
        </div>
      </div>
    </main>
  );
};

const LevelButton: React.FC<{ level: number; onClick: () => void; isWordProblem?: boolean }> = ({
  level,
  onClick,
  isWordProblem = false,
}) => {
  const theme = getLevelTheme(level);
  
  // Different colors for different difficulty tiers
  const getTierColor = (level: number) => {
    if (level <= 25) return 'from-accent to-palm';
    if (level <= 50) return 'from-primary to-sunset';
    if (level <= 75) return 'from-secondary to-coral';
    if (level <= 100) return 'from-coral to-destructive';
    // Word problem levels (101-150)
    if (level <= 120) return 'from-purple-400 to-purple-600';
    if (level <= 135) return 'from-indigo-400 to-indigo-600';
    return 'from-violet-500 to-purple-700';
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative group
        w-full aspect-square
        rounded-2xl
        bg-gradient-to-br ${getTierColor(level)}
        border-4 border-foreground/20
        shadow-lg hover:shadow-xl
        transform hover:-translate-y-2 hover:scale-105
        transition-all duration-300
        font-baloo text-lg md:text-xl font-bold
        text-foreground
        overflow-hidden
      `}
      title={theme}
    >
      {/* Decoration for milestones */}
      {level % 10 === 0 && !isWordProblem && (
        <div className="absolute top-0 right-0 text-xl">🌴</div>
      )}
      {isWordProblem && level % 10 === 0 && (
        <div className="absolute top-0 right-0 text-lg">📖</div>
      )}
      
      {/* Level number */}
      <span className="relative z-10 text-shadow-fun">{level}</span>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
    </button>
  );
};

export default Levels;
