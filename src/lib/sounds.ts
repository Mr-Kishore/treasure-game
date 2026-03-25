// Sound effects using Web Audio API
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

// Celebration sound - a happy ascending arpeggio
export const playSuccessSound = () => {
  if (!audioContext) return;
  
  audioContext.resume();
  
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  
  notes.forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
    
    oscillator.start(audioContext.currentTime + i * 0.1);
    oscillator.stop(audioContext.currentTime + i * 0.1 + 0.3);
  });
  
  // Add a cheerful "pop" at the end
  setTimeout(() => {
    const pop = audioContext.createOscillator();
    const popGain = audioContext.createGain();
    
    pop.connect(popGain);
    popGain.connect(audioContext.destination);
    
    pop.type = 'sine';
    pop.frequency.setValueAtTime(1200, audioContext.currentTime);
    pop.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    
    popGain.gain.setValueAtTime(0.4, audioContext.currentTime);
    popGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    pop.start();
    pop.stop(audioContext.currentTime + 0.15);
  }, 400);
};

// Wrong answer buzzer sound
export const playErrorSound = () => {
  if (!audioContext) return;
  
  audioContext.resume();
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
  oscillator.frequency.linearRampToValueAtTime(100, audioContext.currentTime + 0.3);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.4);
  
  // Second buzz for emphasis
  setTimeout(() => {
    const buzz2 = audioContext.createOscillator();
    const buzz2Gain = audioContext.createGain();
    
    buzz2.connect(buzz2Gain);
    buzz2Gain.connect(audioContext.destination);
    
    buzz2.type = 'sawtooth';
    buzz2.frequency.setValueAtTime(120, audioContext.currentTime);
    
    buzz2Gain.gain.setValueAtTime(0.25, audioContext.currentTime);
    buzz2Gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    buzz2.start();
    buzz2.stop(audioContext.currentTime + 0.2);
  }, 150);
};

// Click sound for button interactions
export const playClickSound = () => {
  if (!audioContext) return;
  
  audioContext.resume();
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.08);
};

// Level complete fanfare
export const playLevelCompleteSound = () => {
  if (!audioContext) return;
  
  audioContext.resume();
  
  const melody = [
    { freq: 523.25, time: 0, duration: 0.15 },     // C5
    { freq: 587.33, time: 0.15, duration: 0.15 },  // D5
    { freq: 659.25, time: 0.3, duration: 0.15 },   // E5
    { freq: 783.99, time: 0.45, duration: 0.15 },  // G5
    { freq: 1046.50, time: 0.6, duration: 0.4 },   // C6 (longer)
  ];
  
  melody.forEach(({ freq, time, duration }) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime + time);
    
    gain.gain.setValueAtTime(0.3, audioContext.currentTime + time);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + duration);
    
    osc.start(audioContext.currentTime + time);
    osc.stop(audioContext.currentTime + time + duration);
  });
};
