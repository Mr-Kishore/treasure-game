import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedBackground from '@/components/AnimatedBackground';
import { teacherLogin, isTeacherLoggedIn } from '@/lib/teacherStorage';
import { playClickSound } from '@/lib/sounds';
import { ArrowLeft, Lock, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TeacherLogin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (isTeacherLoggedIn()) {
      navigate('/teacher/dashboard');
    }
  }, [navigate]);

  const handleLogin = () => {
    playClickSound();
    if (teacherLogin(password)) {
      toast({
        title: "Welcome, Teacher!",
        description: "You are now logged in.",
      });
      navigate('/teacher/dashboard');
    } else {
      toast({
        title: "Invalid Password",
        description: "Please enter the correct teacher password.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    playClickSound();
    navigate('/');
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <Button
          variant="outline"
          size="default"
          onClick={handleBack}
          className="absolute top-4 left-4 font-fredoka"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="bg-card/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-baloo font-bold text-foreground mb-2">
              Teacher Login
            </h1>
            <p className="text-muted-foreground font-fredoka">
              Enter your password to access Teacher Mode
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="pl-10 h-12 text-lg font-fredoka"
              />
            </div>

            <Button
              variant="treasure"
              size="lg"
              onClick={handleLogin}
              className="w-full font-fredoka text-lg"
            >
              Login
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground font-fredoka">
            Default password: <code className="bg-muted px-2 py-1 rounded">teacher123</code>
          </p>
        </div>
      </div>
    </main>
  );
};

export default TeacherLogin;
