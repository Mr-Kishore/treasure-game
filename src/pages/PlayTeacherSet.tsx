import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';
import BoyCharacter from '@/components/BoyCharacter';
import TreasureChest from '@/components/TreasureChest';
import CountdownTimer from '@/components/CountdownTimer';
import GameStats from '@/components/GameStats';
import { getQuestionSetById, type TeacherQuestion } from '@/lib/teacherStorage';
import { getSuccessMessage, getEncouragementMessage } from '@/lib/mathProblems';
import {
  playSuccessSound,
  playErrorSound,
  playClickSound,
  playLevelCompleteSound,
} from '@/lib/sounds';
import { ArrowLeft, RotateCcw, Lightbulb } from 'lucide-react';

type GameState = 'playing' | 'correct' | 'wrong' | 'timeout' | 'complete' | 'gameover';

const PlayTeacherSet: React.FC = () => {
  const navigate = useNavigate();
  const { setId } = useParams<{ setId: string }>();
  const questionSet = getQuestionSetById(setId || '');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [boyPosition, setBoyPosition] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(10);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const currentQuestion: TeacherQuestion | undefined = questionSet?.questions[currentIndex];
  const totalQuestions = questionSet?.questions.length || 0;

  useEffect(() => {
    if (!questionSet) {
      navigate('/select-mode');
    }
  }, [questionSet, navigate]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      setGameState('complete');
      playLevelCompleteSound();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setGameState('playing');
      setMessage('');
      setHintUsed(false);
      setShowHint(false);
      setTimerKey((prev) => prev + 1);
    }
  }, [currentIndex, totalQuestions]);

  const handleTimeUp = useCallback(() => {
    if (gameState !== 'playing') return;
    setLives((prev) => prev - 1);
    setGameState('timeout');
    setMessage('⏰ Time\'s up!');
    playErrorSound();

    setTimeout(() => {
      if (lives <= 1) {
        setGameState('gameover');
      } else {
        nextQuestion();
      }
    }, 1500);
  }, [gameState, lives, nextQuestion]);

  const handleAnswerClick = (selectedIndex: number) => {
    if (gameState !== 'playing' || !currentQuestion) return;

    playClickSound();

    if (selectedIndex === currentQuestion.correctIndex) {
      setGameState('correct');
      setMessage(getSuccessMessage());
      setScore((prev) => prev + 1);
      setBoyPosition((prev) => prev + 1);
      setCoins((prev) => prev + 5);
      playSuccessSound();

      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      setGameState('wrong');
      setMessage(getEncouragementMessage());
      playErrorSound();

      setTimeout(() => {
        setGameState('playing');
        setMessage('');
      }, 1500);
    }
  };

  const handleHint = () => {
    if (hintUsed || coins < 3 || !currentQuestion) return;
    playClickSound();
    setCoins((prev) => prev - 3);
    setHintUsed(true);
    setShowHint(true);
  };

  const handleBackClick = () => {
    playClickSound();
    navigate('/select-mode');
  };

  const handleRetry = () => {
    playClickSound();
    setCurrentIndex(0);
    setScore(0);
    setBoyPosition(0);
    setLives(3);
    setCoins(10);
    setHintUsed(false);
    setShowHint(false);
    setGameState('playing');
    setMessage('');
    setTimerKey((prev) => prev + 1);
  };

  const getBoyState = () => {
    if (gameState === 'correct') return 'celebrating';
    if (gameState === 'wrong' || gameState === 'timeout') return 'crying';
    if (gameState === 'complete') return 'celebrating';
    if (gameState === 'gameover') return 'crying';
    return 'idle';
  };

  if (!questionSet || !currentQuestion) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen p-4 md:p-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={handleBackClick}
            className="font-fredoka"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <div className="text-center flex-1 min-w-[200px]">
            <h1 className="text-xl md:text-3xl font-baloo font-bold text-foreground text-shadow-fun">
              📚 {questionSet.name}
            </h1>
          </div>

          <GameStats lives={lives} coins={coins} />
        </div>

        {/* Timer & Score */}
        <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
          <CountdownTimer
            seconds={60}
            onTimeUp={handleTimeUp}
            isRunning={gameState === 'playing'}
            resetTrigger={timerKey}
          />
          <div className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl">
            <span className="font-baloo text-lg text-foreground">
              ⭐ {score}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-2xl mx-auto mb-6">
          <div className="h-4 bg-card/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500 rounded-full"
              style={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Game Content */}
        {gameState === 'complete' ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-8 animate-bounce-fun">
              <h2 className="text-4xl md:text-6xl font-baloo font-bold text-primary text-shadow-glow mb-4">
                🎉 Complete!
              </h2>
              <p className="text-xl md:text-2xl font-fredoka text-foreground">
                You scored {score}/{totalQuestions}!
              </p>
              <p className="text-lg font-fredoka text-accent mt-2">
                🪙 Total Coins: {coins}
              </p>
            </div>

            <div className="mb-8">
              <TreasureChest isOpen={true} className="scale-150" />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" size="lg" onClick={handleRetry} className="font-fredoka">
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Button variant="treasure" size="lg" onClick={() => navigate('/select-mode')} className="font-fredoka">
                More Sets 📚
              </Button>
            </div>
          </div>
        ) : gameState === 'gameover' ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-6xl font-baloo font-bold text-destructive mb-4">
                💔 Game Over
              </h2>
              <p className="text-xl md:text-2xl font-fredoka text-foreground">
                You ran out of lives!
              </p>
              <p className="text-lg font-fredoka text-muted-foreground mt-2">
                Score: {score}/{totalQuestions}
              </p>
            </div>

            <div className="mb-8">
              <BoyCharacter state="crying" className="scale-100" />
            </div>

            <Button variant="treasure" size="lg" onClick={handleRetry} className="font-fredoka">
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Question Card */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-2xl mb-6 max-w-lg w-full">
              <div className="text-center mb-6">
                <span className="text-3xl md:text-5xl font-baloo font-bold text-foreground">
                  {currentQuestion.question}
                </span>
              </div>

              {/* Hint Display */}
              {showHint && currentQuestion.hint && (
                <div className="bg-accent/20 border border-accent/30 rounded-xl p-4 mb-4 text-center">
                  <p className="text-foreground font-fredoka">
                    💡 {currentQuestion.hint}
                  </p>
                </div>
              )}

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="answer"
                    size="lg"
                    onClick={() => handleAnswerClick(index)}
                    disabled={gameState !== 'playing'}
                    className={`
                      text-xl md:text-2xl font-baloo h-14 md:h-18
                      ${gameState === 'correct' && index === currentQuestion.correctIndex ? 'bg-accent border-accent text-accent-foreground' : ''}
                      ${gameState === 'wrong' && index === currentQuestion.correctIndex ? 'bg-accent border-accent text-accent-foreground' : ''}
                    `}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {/* Hint Button */}
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={handleHint}
                  disabled={hintUsed || coins < 3 || gameState !== 'playing'}
                  className="font-fredoka"
                >
                  <Lightbulb className={`w-5 h-5 mr-2 ${hintUsed ? 'text-muted-foreground' : 'text-yellow-500'}`} />
                  {hintUsed ? 'Hint Used' : 'Use Hint (-3 🪙)'}
                </Button>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`
                  text-2xl md:text-4xl font-baloo font-bold mb-6 animate-bounce-fun
                  ${gameState === 'correct' ? 'text-accent' : 'text-secondary'}
                `}
              >
                {message}
              </div>
            )}

            {/* Game Scene */}
            <div className="relative w-full max-w-2xl h-48 md:h-64">
              <div className="absolute bottom-8 left-0 right-0 h-8 bg-sand rounded-full" />

              <div className="absolute bottom-10 right-8">
                <TreasureChest
                  isOpen={currentIndex >= totalQuestions - 1 && gameState === 'correct'}
                  className="scale-75 md:scale-100"
                />
              </div>

              <div
                className="absolute bottom-6 transition-all duration-1000"
                style={{
                  left: `${10 + boyPosition * (70 / totalQuestions)}%`,
                  transform: gameState === 'correct' ? 'translateX(30px)' : 'none',
                }}
              >
                <BoyCharacter state={getBoyState()} className="scale-50 md:scale-75" />
              </div>

              {[...Array(totalQuestions)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    absolute bottom-6 w-4 h-4 rounded-full
                    ${i < boyPosition ? 'bg-accent' : 'bg-foreground/30'}
                    transition-colors duration-300
                  `}
                  style={{ left: `${15 + i * (70 / totalQuestions)}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PlayTeacherSet;
