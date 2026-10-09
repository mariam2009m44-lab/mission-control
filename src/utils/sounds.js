let audioContext = null;
let bgMusic = null;

const getContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

const playTone = (frequency, duration, type = 'sine', volume = 0.3, delay = 0) => {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.start(now);
  osc.stop(now + duration);
};

export const playCountdownBeep = (isLast = false) => {
  if (isLast) {
    playTone(880, 0.5, 'sine', 0.4);
    playTone(1320, 0.5, 'sine', 0.2, 0.05);
  } else {
    playTone(440, 0.15, 'sine', 0.3);
  }
};

export const playLaunchSound = () => {
  playTone(120, 2.5, 'sawtooth', 0.15);
  playTone(180, 2.5, 'triangle', 0.1, 0.2);
};

export const playClick = () => playTone(600, 0.08, 'sine', 0.12);
export const playSuccess = () => {
  [523, 659, 784].forEach((f, i) => playTone(f, 0.3, 'sine', 0.2, i * 0.1));
};
export const playFailure = () => {
  [350, 300, 250].forEach((f, i) => playTone(f, 0.3, 'triangle', 0.2, i * 0.12));
};
export const playAchievement = () => {
  [784, 988, 1318].forEach((f, i) => playTone(f, 0.4, 'sine', 0.25, i * 0.1));
};
export const playPlanetDiscover = () => {
  playTone(880, 0.25, 'sine', 0.15);
  playTone(1174, 0.35, 'sine', 0.12, 0.1);
};

// ========== HTML5 Audio - Simple & Reliable ==========
const MUSIC_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3';

export const startAmbientMusic = () => {
  if (bgMusic && !bgMusic.paused) return;

  if (!bgMusic) {
    bgMusic = new Audio(MUSIC_URL);
    bgMusic.loop = true;
    bgMusic.volume = 0.25;
    bgMusic.crossOrigin = 'anonymous';
  }

  const playPromise = bgMusic.play();
  if (playPromise) {
    playPromise.catch((e) => {
      console.warn('Autoplay blocked, will retry on click');
      const retry = () => {
        bgMusic.play().catch(() => {});
        document.removeEventListener('click', retry);
        document.removeEventListener('touchstart', retry);
      };
      document.addEventListener('click', retry);
      document.addEventListener('touchstart', retry);
    });
  }
};

export const stopAmbientMusic = () => {
  if (bgMusic) {
    bgMusic.pause();
  }
};

export const setAmbientVolume = () => {};
export const initAudio = () => { getContext(); };
