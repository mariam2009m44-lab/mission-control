// Web Audio API sound system - no external files needed

let audioContext = null;

const getContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

// Play a simple tone
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

// Countdown beep
export const playCountdownBeep = (isLast = false) => {
  if (isLast) {
    playTone(880, 0.5, 'sine', 0.4);
    playTone(1320, 0.5, 'sine', 0.2, 0.05);
  } else {
    playTone(440, 0.15, 'sine', 0.3);
  }
};

// Launch sound - rocket whoosh with rising pitch
export const playLaunchSound = () => {
  const ctx = getContext();

  // Rising rumble
  const noise = ctx.createBufferSource();
  const bufferSize = ctx.sampleRate * 2.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noise.buffer = buffer;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0;
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  const now = ctx.currentTime;
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.5);
  noiseGain.gain.linearRampToValueAtTime(0.15, now + 2);
  noiseGain.gain.linearRampToValueAtTime(0, now + 2.5);

  noise.start(now);
  noise.stop(now + 2.5);

  // Rising pitch
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(80, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 2);

  oscGain.gain.value = 0;
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  oscGain.gain.setValueAtTime(0.15, now);
  oscGain.gain.linearRampToValueAtTime(0, now + 2.5);

  osc.start(now);
  osc.stop(now + 2.5);
};

// Soft click for UI
export const playClick = () => {
  playTone(600, 0.08, 'sine', 0.15);
};

// Success sound
export const playSuccess = () => {
  [523, 659, 784, 1046].forEach((f, i) => {
    playTone(f, 0.4, 'sine', 0.25, i * 0.12);
  });
};

// Failure sound
export const playFailure = () => {
  [400, 350, 300, 250].forEach((f, i) => {
    playTone(f, 0.35, 'triangle', 0.25, i * 0.15);
  });
};

// Achievement sound
export const playAchievement = () => {
  [784, 988, 1318].forEach((f, i) => {
    playTone(f, 0.5, 'sine', 0.3, i * 0.1);
  });
};

// Planet discovery sound
export const playPlanetDiscover = () => {
  playTone(880, 0.3, 'sine', 0.2);
  playTone(1174, 0.4, 'sine', 0.15, 0.1);
};

// Space ambient background music (continuous)
let ambientNodes = null;

export const startAmbientMusic = () => {
  if (ambientNodes) return;

  const ctx = getContext();
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.08;
  masterGain.connect(ctx.destination);

  // Low drone
  const drone = ctx.createOscillator();
  drone.type = 'sine';
  drone.frequency.value = 55;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.5;
  drone.connect(droneGain);
  droneGain.connect(masterGain);
  drone.start();

  // Shimmering pad with slow LFO
  const pad = ctx.createOscillator();
  pad.type = 'sine';
  pad.frequency.value = 220;
  const padGain = ctx.createGain();
  padGain.gain.value = 0.15;
  pad.connect(padGain);
  padGain.connect(masterGain);
  pad.start();

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.1;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 30;
  lfo.connect(lfoGain);
  lfoGain.connect(pad.frequency);
  lfo.start();

  ambientNodes = { drone, pad, lfo, masterGain };
};

export const stopAmbientMusic = () => {
  if (!ambientNodes) return;
  try {
    ambientNodes.drone.stop();
    ambientNodes.pad.stop();
    ambientNodes.lfo.stop();
    ambientNodes.masterGain.disconnect();
  } catch (e) {
    // ignore
  }
  ambientNodes = null;
};

export const setAmbientVolume = (v) => {
  if (ambientNodes) {
    ambientNodes.masterGain.gain.value = v;
  }
};

// Initialize on user interaction (required for mobile)
export const initAudio = () => {
  getContext();
};
