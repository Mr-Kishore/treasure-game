import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ocean waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full animate-wave">
          <path
            fill="hsl(199 89% 35%)"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>

      {/* Sun */}
      <div className="absolute top-8 right-12 w-24 h-24 rounded-full bg-primary animate-pulse-glow shadow-2xl" />

      {/* Clouds */}
      <div className="absolute top-16 left-[10%] animate-float-slow">
        <Cloud />
      </div>
      <div className="absolute top-24 left-[60%] animate-float-slow animation-delay-500">
        <Cloud size="lg" />
      </div>
      <div className="absolute top-12 left-[35%] animate-float-slow animation-delay-300">
        <Cloud size="sm" />
      </div>

      {/* Flying birds */}
      <div className="absolute top-32 animate-fly">
        <Bird />
      </div>
      <div className="absolute top-48 animate-fly animation-delay-700" style={{ animationDelay: '3s' }}>
        <Bird />
      </div>
      <div className="absolute top-20 animate-fly" style={{ animationDelay: '7s' }}>
        <Bird />
      </div>

      {/* Islands with palm trees */}
      <div className="absolute bottom-24 left-[5%] animate-float animation-delay-200">
        <Island />
      </div>
      <div className="absolute bottom-20 right-[10%] animate-float animation-delay-500">
        <Island variant="small" />
      </div>

      {/* Floating animals */}
      <div className="absolute bottom-40 left-[20%] animate-bounce-fun animation-delay-300">
        <Lion />
      </div>
      <div className="absolute bottom-36 right-[25%] animate-bounce-fun animation-delay-700">
        <Elephant />
      </div>
      <div className="absolute top-40 left-[15%] animate-float animation-delay-500">
        <Bee />
      </div>
      <div className="absolute top-32 right-[20%] animate-float animation-delay-200">
        <Bee />
      </div>
      <div className="absolute bottom-48 left-[50%] animate-bounce-fun">
        <Tiger />
      </div>

      {/* Swimming fish */}
      <div className="absolute bottom-8 left-[30%] animate-swim">
        <Fish />
      </div>
      <div className="absolute bottom-12 right-[40%] animate-swim animation-delay-500">
        <Fish color="coral" />
      </div>

      {/* Sparkles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-sparkle"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          <Sparkle />
        </div>
      ))}
    </div>
  );
};

const Cloud: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.3 : 1;
  return (
    <svg width={120 * scale} height={60 * scale} viewBox="0 0 120 60">
      <ellipse cx="60" cy="40" rx="50" ry="20" fill="white" opacity="0.9" />
      <ellipse cx="35" cy="35" rx="25" ry="18" fill="white" opacity="0.9" />
      <ellipse cx="85" cy="35" rx="25" ry="18" fill="white" opacity="0.9" />
      <ellipse cx="60" cy="28" rx="30" ry="20" fill="white" opacity="0.95" />
    </svg>
  );
};

const Bird: React.FC = () => (
  <svg width="30" height="20" viewBox="0 0 30 20">
    <path
      d="M5,10 Q10,5 15,10 Q20,5 25,10"
      stroke="hsl(25 30% 20%)"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const Island: React.FC<{ variant?: 'small' | 'large' }> = ({ variant = 'large' }) => {
  const scale = variant === 'small' ? 0.7 : 1;
  return (
    <svg width={150 * scale} height={120 * scale} viewBox="0 0 150 120">
      {/* Sand island */}
      <ellipse cx="75" cy="100" rx="65" ry="18" fill="hsl(45 60% 75%)" />
      {/* Palm tree trunk */}
      <path d="M70,100 Q65,60 75,30" stroke="hsl(25 50% 35%)" strokeWidth="8" fill="none" />
      {/* Palm leaves */}
      <ellipse cx="75" cy="25" rx="35" ry="12" fill="hsl(142 60% 35%)" transform="rotate(-20 75 25)" />
      <ellipse cx="75" cy="25" rx="35" ry="12" fill="hsl(142 70% 40%)" transform="rotate(20 75 25)" />
      <ellipse cx="75" cy="30" rx="30" ry="10" fill="hsl(142 65% 38%)" />
      {/* Coconuts */}
      <circle cx="68" cy="35" r="5" fill="hsl(25 50% 30%)" />
      <circle cx="80" cy="38" r="5" fill="hsl(25 50% 30%)" />
    </svg>
  );
};

const Lion: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 60 60">
    {/* Mane */}
    <circle cx="30" cy="30" r="25" fill="hsl(25 80% 50%)" />
    {/* Face */}
    <circle cx="30" cy="32" r="18" fill="hsl(45 70% 65%)" />
    {/* Eyes */}
    <circle cx="24" cy="28" r="3" fill="hsl(25 30% 20%)" />
    <circle cx="36" cy="28" r="3" fill="hsl(25 30% 20%)" />
    {/* Nose */}
    <ellipse cx="30" cy="36" rx="4" ry="3" fill="hsl(25 30% 30%)" />
    {/* Mouth */}
    <path d="M26,40 Q30,44 34,40" stroke="hsl(25 30% 30%)" strokeWidth="2" fill="none" />
  </svg>
);

const Elephant: React.FC = () => (
  <svg width="70" height="60" viewBox="0 0 70 60">
    {/* Body */}
    <ellipse cx="40" cy="40" rx="25" ry="18" fill="hsl(210 10% 60%)" />
    {/* Head */}
    <circle cx="18" cy="30" r="15" fill="hsl(210 10% 65%)" />
    {/* Trunk */}
    <path d="M8,35 Q2,45 8,55" stroke="hsl(210 10% 60%)" strokeWidth="8" fill="none" strokeLinecap="round" />
    {/* Ear */}
    <ellipse cx="22" cy="25" rx="8" ry="12" fill="hsl(210 10% 55%)" />
    {/* Eye */}
    <circle cx="14" cy="26" r="3" fill="hsl(25 30% 20%)" />
    {/* Legs */}
    <rect x="25" y="52" width="8" height="8" rx="2" fill="hsl(210 10% 55%)" />
    <rect x="45" y="52" width="8" height="8" rx="2" fill="hsl(210 10% 55%)" />
  </svg>
);

const Bee: React.FC = () => (
  <svg width="40" height="35" viewBox="0 0 40 35">
    {/* Wings */}
    <ellipse cx="12" cy="12" rx="8" ry="5" fill="white" opacity="0.7" />
    <ellipse cx="28" cy="12" rx="8" ry="5" fill="white" opacity="0.7" />
    {/* Body */}
    <ellipse cx="20" cy="20" rx="12" ry="10" fill="hsl(45 90% 50%)" />
    {/* Stripes */}
    <rect x="12" y="16" width="16" height="3" fill="hsl(25 30% 20%)" rx="1" />
    <rect x="14" y="22" width="12" height="3" fill="hsl(25 30% 20%)" rx="1" />
    {/* Eyes */}
    <circle cx="16" cy="18" r="2" fill="hsl(25 30% 20%)" />
    <circle cx="24" cy="18" r="2" fill="hsl(25 30% 20%)" />
    {/* Antenna */}
    <line x1="17" y1="10" x2="14" y2="5" stroke="hsl(25 30% 20%)" strokeWidth="1.5" />
    <line x1="23" y1="10" x2="26" y2="5" stroke="hsl(25 30% 20%)" strokeWidth="1.5" />
    <circle cx="14" cy="4" r="2" fill="hsl(25 30% 20%)" />
    <circle cx="26" cy="4" r="2" fill="hsl(25 30% 20%)" />
  </svg>
);

const Tiger: React.FC = () => (
  <svg width="65" height="55" viewBox="0 0 65 55">
    {/* Body */}
    <ellipse cx="35" cy="35" rx="22" ry="16" fill="hsl(25 90% 55%)" />
    {/* Stripes on body */}
    <path d="M20,30 L25,40" stroke="hsl(25 30% 20%)" strokeWidth="3" />
    <path d="M30,28 L32,42" stroke="hsl(25 30% 20%)" strokeWidth="3" />
    <path d="M40,28 L38,42" stroke="hsl(25 30% 20%)" strokeWidth="3" />
    <path d="M48,30 L45,40" stroke="hsl(25 30% 20%)" strokeWidth="3" />
    {/* Head */}
    <circle cx="15" cy="25" r="12" fill="hsl(25 90% 55%)" />
    {/* Ears */}
    <circle cx="6" cy="16" r="5" fill="hsl(25 90% 55%)" />
    <circle cx="24" cy="16" r="5" fill="hsl(25 90% 55%)" />
    {/* White face markings */}
    <ellipse cx="15" cy="28" rx="6" ry="5" fill="white" />
    {/* Eyes */}
    <circle cx="11" cy="23" r="2.5" fill="hsl(25 30% 20%)" />
    <circle cx="19" cy="23" r="2.5" fill="hsl(25 30% 20%)" />
    {/* Nose */}
    <ellipse cx="15" cy="28" rx="3" ry="2" fill="hsl(350 50% 50%)" />
    {/* Stripes on face */}
    <path d="M8,18 L5,22" stroke="hsl(25 30% 20%)" strokeWidth="2" />
    <path d="M22,18 L25,22" stroke="hsl(25 30% 20%)" strokeWidth="2" />
  </svg>
);

const Fish: React.FC<{ color?: 'blue' | 'coral' }> = ({ color = 'blue' }) => {
  const fill = color === 'coral' ? 'hsl(16 100% 66%)' : 'hsl(199 89% 60%)';
  return (
    <svg width="40" height="25" viewBox="0 0 40 25">
      <ellipse cx="20" cy="12" rx="15" ry="10" fill={fill} />
      <polygon points="35,12 45,5 45,19" fill={fill} />
      <circle cx="12" cy="10" r="2" fill="white" />
      <circle cx="12" cy="10" r="1" fill="hsl(25 30% 20%)" />
      <path d="M18,18 Q22,20 26,18" stroke={fill} strokeWidth="3" fill="none" />
    </svg>
  );
};

const Sparkle: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <path
      d="M10,0 L12,8 L20,10 L12,12 L10,20 L8,12 L0,10 L8,8 Z"
      fill="hsl(45 93% 58%)"
    />
  </svg>
);

export default AnimatedBackground;
