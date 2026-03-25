import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedBackground from '@/components/AnimatedBackground';
import { registerStudent, loginStudent, setSession } from '@/lib/api';
import { playClickSound, playSuccessSound, playErrorSound } from '@/lib/sounds';
import { ArrowLeft, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

type Mode = 'login' | 'signup';

const StudentAuth: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

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
      navigate('/levels');
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Back button */}
        <Button
          variant="outline"
          onClick={() => { playClickSound(); navigate('/'); }}
          className="absolute top-4 left-4 font-fredoka"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Home
        </Button>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-baloo font-bold text-foreground text-shadow-fun mb-2">
            🧒 Student Portal
          </h1>
          <p className="text-lg font-fredoka text-foreground/70">
            {mode === 'login' ? 'Welcome back, adventurer!' : 'Join the adventure!'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl w-full max-w-md">
          {/* Mode toggle */}
          <div className="flex rounded-2xl overflow-hidden border border-border mb-6">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-3 font-fredoka text-base font-semibold transition-colors ${
                mode === 'login'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:bg-muted'
              }`}
            >
              <LogIn className="inline w-4 h-4 mr-1" />
              Login
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-3 font-fredoka text-base font-semibold transition-colors ${
                mode === 'signup'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:bg-muted'
              }`}
            >
              <UserPlus className="inline w-4 h-4 mr-1" />
              Sign Up
            </button>
          </div>

          <div className="space-y-4">
            {/* Signup-only fields */}
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-fredoka text-foreground mb-1">Your Name</label>
                  <Input
                    placeholder="e.g. Kishore"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="font-fredoka"
                  />
                </div>
                <div>
                  <label className="block text-sm font-fredoka text-foreground mb-1">Age</label>
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    min={4}
                    max={18}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="font-fredoka"
                  />
                </div>
              </>
            )}

            {/* Common fields */}
            <div>
              <label className="block text-sm font-fredoka text-foreground mb-1">Username</label>
              <Input
                placeholder="Pick a cool username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="font-fredoka"
              />
            </div>

            <div>
              <label className="block text-sm font-fredoka text-foreground mb-1">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="font-fredoka pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-2">
                <p className="text-destructive font-fredoka text-sm">⚠️ {error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              variant="treasure"
              size="lg"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full font-fredoka text-lg mt-2"
            >
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Login & Play!
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account!
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Decorative */}
        <p className="mt-6 text-sm font-fredoka text-foreground/50 text-center">
          {mode === 'login'
            ? "Don't have an account? Switch to Sign Up above!"
            : 'Already have an account? Switch to Login above!'}
        </p>
      </div>
    </main>
  );
};

export default StudentAuth;
