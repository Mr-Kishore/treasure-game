import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedBackground from '@/components/AnimatedBackground';
import { registerStudent, loginStudent, setSession, getStoredStudent } from '@/lib/api';
import { playClickSound, playSuccessSound, playErrorSound } from '@/lib/sounds';
import { GraduationCap, LogIn, UserPlus, Eye, EyeOff, Sparkles } from 'lucide-react';

type Mode = 'login' | 'signup';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    const student = getStoredStudent();
    if (student) {
      navigate('/home');
      return;
    }
    setTimeout(() => setAnimateIn(true), 50);
  }, [navigate]);

  const switchMode = (m: Mode) => {
    playClickSound();
    setMode(m);
    setError('');
    setUsername('');
    setPassword('');
    setName('');
    setAge('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (mode === 'signup' && (!name.trim() || !age)) {
      setError('Please fill in all fields.');
      return;
    }

    playClickSound();
    setLoading(true);
    try {
      let res;
      if (mode === 'login') {
        res = await loginStudent(username.trim(), password);
      } else {
        res = await registerStudent({
          username: username.trim(),
          name: name.trim(),
          age: parseInt(age),
          password,
        });
      }
      playSuccessSound();
      setSession(res.token, res.student);
      navigate('/home');
    } catch (err: unknown) {
      playErrorSound();
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      {/* Teacher Mode button — top right */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          onClick={() => { playClickSound(); navigate('/teacher'); }}
          className="font-fredoka bg-card/80 backdrop-blur-sm border-2 hover:bg-card"
        >
          <GraduationCap className="w-5 h-5 mr-2" />
          Teacher Mode
        </Button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">

        {/* Logo / Branding */}
        <div
          className="text-center mb-8 transition-all duration-700"
          style={{
            opacity: animateIn ? 1 : 0,
            transform: animateIn ? 'translateY(0)' : 'translateY(-30px)',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl" style={{ animation: 'bounce 1s infinite' }}>🏴‍☠️</span>
            <h1 className="text-4xl md:text-6xl font-baloo font-bold text-foreground text-shadow-fun">
              Treasure Hunt
            </h1>
            <span className="text-5xl" style={{ animation: 'bounce 1s infinite 0.3s' }}>💎</span>
          </div>
          <p className="text-xl md:text-2xl font-fredoka font-semibold text-primary text-shadow-glow">
            Math Adventure
          </p>
          <p className="text-sm md:text-base font-fredoka text-foreground/70 mt-1">
            Sign in to start your adventure!
          </p>
        </div>

        {/* Auth Card */}
        <div
          className="bg-card/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl w-full max-w-md border border-foreground/10 transition-all duration-700"
          style={{
            opacity: animateIn ? 1 : 0,
            transform: animateIn ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
          }}
        >
          {/* Mode Toggle */}
          <div className="flex rounded-2xl overflow-hidden border-2 border-border mb-6">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-3 font-fredoka text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:bg-muted'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-3 font-fredoka text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                mode === 'signup'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:bg-muted'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          <div className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-fredoka text-foreground mb-1 font-semibold">Your Name 👤</label>
                  <Input
                    placeholder="e.g. Alex"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="font-fredoka h-12 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-fredoka text-foreground mb-1 font-semibold">Age 🎂</label>
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    min={4}
                    max={18}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="font-fredoka h-12 text-base"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-fredoka text-foreground mb-1 font-semibold">Username 🧒</label>
              <Input
                placeholder="Pick a cool username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="font-fredoka h-12 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-fredoka text-foreground mb-1 font-semibold">Password 🔑</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="font-fredoka h-12 text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">
                <p className="text-destructive font-fredoka text-sm">⚠️ {error}</p>
              </div>
            )}

            <Button
              variant="treasure"
              size="lg"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full font-fredoka text-lg mt-2 h-14"
            >
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Login &amp; Play! 🎮
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Account &amp; Play! 🚀
                </>
              )}
            </Button>
          </div>

          <p className="mt-5 text-center text-sm font-fredoka text-foreground/50">
            {mode === 'login'
              ? "New adventurer? Switch to Sign Up above!"
              : 'Already have an account? Switch to Login above!'}
          </p>
        </div>

        {/* Bottom tagline */}
        <p
          className="mt-6 text-foreground/70 font-fredoka text-base text-center transition-all duration-700"
          style={{ opacity: animateIn ? 1 : 0, transitionDelay: '300ms' }}
        >
          🌴 Solve math problems · Find treasures · Become a Math Champion!
        </p>
      </div>
    </main>
  );
};

export default Index;