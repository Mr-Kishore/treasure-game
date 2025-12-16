import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedBackground from '@/components/AnimatedBackground';
import BoyCharacter from '@/components/BoyCharacter';
import TreasureChest from '@/components/TreasureChest';
import CountdownTimer from '@/components/CountdownTimer';
import GameStats from '@/components/GameStats';
import {
  generateMathProblem,
  getLevelTheme,
  getSuccessMessage,
  getEncouragementMessage,
  isWordProblemLevel,
  type MathProblem,
} from '@/lib/mathProblems';
import {
  playSuccessSound,
  playErrorSound,
  playClickSound,
  playLevelCompleteSound,
} from '@/lib/sounds';
import { ArrowLeft, RotateCcw, Lightbulb, Send } from 'lucide-react';

type GameState = 'playing' | 'correct' | 'wrong' | 'timeout' | 'complete' | 'gameover';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { levelId } = useParams<{ levelId: string }>();
  const level = parseInt(levelId || '1', 10);
  const isWordProblem = isWordProblemLevel(level);

  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [boyPosition, setBoyPosition] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(10);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  const QUESTIONS_PER_LEVEL = 5;

  const generateHint = (problem: MathProblem): string => {
    if (problem.hint) {
      return problem.hint;
    }
    const question = problem.question;
    if (question.includes('+')) {
      return 'Try adding the numbers together!';
    } else if (question.includes('-')) {
      return 'Subtract the second number from the first!';
    } else if (question.includes('×')) {
      return 'Multiply the numbers!';
    } else if (question.includes('÷')) {
      return 'Divide the first number by the second!';
    }
    return 'Think carefully about the operation!';
  };

  const generateNewProblem = useCallback(() => {
    const newProblem = generateMathProblem(level);
    setProblem(newProblem);
    setGameState('playing');
    setMessage('');
    setHintUsed(false);
    setShowHint(false);
    setTimerKey((prev) => prev + 1);
    setUserAnswer('');
  }, [level]);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

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
        generateNewProblem();
      }
    }, 1500);
  }, [gameState, lives, generateNewProblem]);

  const handleCorrectAnswer = () => {
    setGameState('correct');
    setMessage(getSuccessMessage());
    setScore((prev) => prev + 1);
    setQuestionsAnswered((prev) => prev + 1);
    setBoyPosition((prev) => prev + 1);
    setCoins((prev) => prev + 5);
    playSuccessSound();

    setTimeout(() => {
      if (questionsAnswered + 1 >= QUESTIONS_PER_LEVEL) {
        setGameState('complete');
        playLevelCompleteSound();
      } else {
        generateNewProblem();
      }
    }, 1500);
  };

  const handleWrongAnswer = () => {
    setGameState('wrong');
    setMessage(getEncouragementMessage());
    playErrorSound();

    setTimeout(() => {
      setGameState('playing');
      setMessage('');
    }, 1500);
  };

  const handleAnswerClick = (selectedAnswer: number) => {
    if (gameState !== 'playing' || !problem) return;

    playClickSound();

    if (selectedAnswer === problem.answer) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  const handleWordAnswerSubmit = () => {
    if (gameState !== 'playing' || !problem || !userAnswer.trim()) return;

    playClickSound();
    const parsedAnswer = parseFloat(userAnswer.trim());

    if (!isNaN(parsedAnswer) && parsedAnswer === problem.answer) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  const handleHint = () => {
    if (hintUsed || coins < 3 || !problem) return;
    playClickSound();
    setCoins((prev) => prev - 3);
    setHintUsed(true);
    setShowHint(true);
  };

  const handleBackClick = () => {
    playClickSound();
    navigate('/levels');
  };

  const handleNextLevel = () => {
    playClickSound();
    if (level < 150) {
      navigate(`/game/${level + 1}`);
      setScore(0);
      setQuestionsAnswered(0);
      setBoyPosition(0);
      setLives(3);
      setCoins(10);
      setHintUsed(false);
      setShowHint(false);
      setUserAnswer('');
    } else {
      navigate('/levels');
    }
  };

  const handleRetry = () => {
    playClickSound();
    setScore(0);
    setQuestionsAnswered(0);
    setBoyPosition(0);
    setLives(3);
    setCoins(10);
    setHintUsed(false);
    setShowHint(false);
    setUserAnswer('');
    generateNewProblem();
  };

  const getBoyState = () => {
    if (gameState === 'correct') return 'celebrating';
    if (gameState === 'wrong' || gameState === 'timeout') return 'crying';
    if (gameState === 'complete') return 'celebrating';
    if (gameState === 'gameover') return 'crying';
    return 'idle';
  };

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
            Islands
          </Button>

          <div className="text-center flex-1 min-w-[200px]">
            <h1 className="text-2xl md:text-4xl font-baloo font-bold text-foreground text-shadow-fun">
              {isWordProblem ? '📖' : '🏝️'} Level {level}
            </h1>
            <p className="text-sm md:text-base font-fredoka text-foreground/80">
              {getLevelTheme(level)}
            </p>
          </div>

          <GameStats lives={lives} coins={coins} />
        </div>

        {/* Timer & Score */}
        <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
          <CountdownTimer
            seconds={isWordProblem ? 90 : 60}
            onTimeUp={handleTimeUp}
            isRunning={gameState === 'playing'}
            resetTrigger={timerKey}
          />
          <div className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl">
            <span className="font-baloo text-lg text-foreground">
              ⭐ {score}/{QUESTIONS_PER_LEVEL}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-2xl mx-auto mb-6">
          <div className="h-4 bg-card/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500 rounded-full"
              style={{ width: `${(questionsAnswered / QUESTIONS_PER_LEVEL) * 100}%` }}
            />
          </div>
        </div>

        {/* Game Content */}
        {gameState === 'complete' ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-8 animate-bounce-fun">
              <h2 className="text-4xl md:text-6xl font-baloo font-bold text-primary text-shadow-glow mb-4">
                🎉 Level Complete!
              </h2>
              <p className="text-xl md:text-2xl font-fredoka text-foreground">
                You scored {score}/{QUESTIONS_PER_LEVEL}!
              </p>
              <p className="text-lg font-fredoka text-accent mt-2">
                🪙 Total Coins: {coins}
              </p>
            </div>

            <div className="mb-8">
              <TreasureChest isOpen={true} className="scale-150" />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleRetry}
                className="font-fredoka"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retry
              </Button>
              {level < 150 && (
                <Button
                  variant="treasure"
                  size="lg"
                  onClick={handleNextLevel}
                  className="font-fredoka"
                >
                  Next Island {isWordProblem ? '📖' : '🏝️'}
                </Button>
              )}
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
                Score: {score}/{QUESTIONS_PER_LEVEL}
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
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-2xl mb-6 max-w-xl w-full">
              {/* Word Problem Story */}
              {isWordProblem && problem?.story && (
                <div className="bg-primary/10 rounded-2xl p-4 mb-6">
                  <p className="text-lg md:text-xl font-fredoka text-foreground leading-relaxed">
                    {problem.story}
                  </p>
                </div>
              )}

              <div className="text-center mb-6">
                <span className={`font-baloo font-bold text-foreground ${isWordProblem ? 'text-xl md:text-2xl' : 'text-4xl md:text-6xl'}`}>
                  {problem?.question}
                </span>
              </div>

              {/* Hint Display */}
              {showHint && problem && (
                <div className="bg-accent/20 border border-accent/30 rounded-xl p-4 mb-4 text-center">
                  <p className="text-foreground font-fredoka">
                    💡 {generateHint(problem)}
                  </p>
                </div>
              )}

              {/* Answer Section */}
              {isWordProblem ? (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Type your answer..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleWordAnswerSubmit()}
                      disabled={gameState !== 'playing'}
                      className="text-2xl font-baloo h-16 text-center"
                    />
                    <Button
                      variant="treasure"
                      size="lg"
                      onClick={handleWordAnswerSubmit}
                      disabled={gameState !== 'playing' || !userAnswer.trim()}
                      className="h-16 px-6"
                    >
                      <Send className="w-6 h-6" />
                    </Button>
                  </div>
                  {gameState === 'wrong' && problem && (
                    <p className="text-center text-muted-foreground font-fredoka">
                      The correct answer was: <strong className="text-accent">{problem.answer}</strong>
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {problem?.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="answer"
                      size="lg"
                      onClick={() => handleAnswerClick(option)}
                      disabled={gameState !== 'playing'}
                      className={`
                        text-2xl md:text-3xl font-baloo h-16 md:h-20
                        ${gameState === 'correct' && option === problem.answer ? 'bg-accent border-accent text-accent-foreground' : ''}
                        ${gameState === 'wrong' && option === problem.answer ? 'bg-accent border-accent text-accent-foreground' : ''}
                      `}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

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
              {/* Path */}
              <div className="absolute bottom-8 left-0 right-0 h-8 bg-sand rounded-full" />

              {/* Treasure chest at the end */}
              <div className="absolute bottom-10 right-8">
                <TreasureChest
                  isOpen={questionsAnswered >= QUESTIONS_PER_LEVEL - 1 && gameState === 'correct'}
                  className="scale-75 md:scale-100"
                />
              </div>

              {/* Boy character */}
              <div
                className="absolute bottom-6 transition-all duration-1000"
                style={{
                  left: `${10 + boyPosition * 15}%`,
                  transform: gameState === 'correct' ? 'translateX(30px)' : 'none',
                }}
              >
                <BoyCharacter
                  state={getBoyState()}
                  className="scale-50 md:scale-75"
                />
              </div>

              {/* Path markers */}
              {[...Array(QUESTIONS_PER_LEVEL)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    absolute bottom-6 w-4 h-4 rounded-full
                    ${i < boyPosition ? 'bg-accent' : 'bg-foreground/30'}
                    transition-colors duration-300
                  `}
                  style={{ left: `${15 + i * 15}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Game;
