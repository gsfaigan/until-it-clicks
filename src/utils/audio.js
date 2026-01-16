// Audio utilities for algorithm visualizations

// Map array value (5..105 approx) to frequency
export function valueToFrequency(value) {
  const minVal = 5;
  const maxVal = 105;
  const minFreq = 110;
  const maxFreq = 660;
  const v = Math.min(Math.max(value, minVal), maxVal);
  const t = (v - minVal) / (maxVal - minVal);
  const eased = Math.sqrt(t);
  return Math.round(minFreq + eased * (maxFreq - minFreq));
}

// Map grid position to frequency (for pathfinding)
export function positionToFrequency(row, col, rows, cols) {
  const minFreq = 110;
  const maxFreq = 660;
  const t = (row * cols + col) / (rows * cols);
  const eased = Math.sqrt(t);
  return Math.round(minFreq + eased * (maxFreq - minFreq));
}

export function playTone(ctx, freq, duration = 0.12) {
  const t = ctx.currentTime;
  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const g1 = ctx.createGain();
  const g2 = ctx.createGain();
  const master = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  o1.type = 'sine';
  o1.frequency.value = freq;

  o2.type = 'triangle';
  o2.frequency.value = freq * 1.98;
  o2.detune.value = 6;

  const attack = Math.min(0.02, duration * 0.3);

  g1.gain.setValueAtTime(0.0001, t);
  g2.gain.setValueAtTime(0.0001, t);
  master.gain.setValueAtTime(0.0001, t);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.min(1200, freq * 2.5), t);
  filter.Q.setValueAtTime(0.8, t);

  g1.gain.linearRampToValueAtTime(0.09, t + attack);
  g2.gain.linearRampToValueAtTime(0.035, t + attack);
  master.gain.linearRampToValueAtTime(0.6, t + attack);

  g1.gain.linearRampToValueAtTime(0.0001, t + duration);
  g2.gain.linearRampToValueAtTime(0.0001, t + duration);
  master.gain.linearRampToValueAtTime(0.0001, t + duration + 0.02);

  o1.connect(g1);
  o2.connect(g2);
  g1.connect(master);
  g2.connect(master);
  master.connect(filter);
  filter.connect(ctx.destination);

  try {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  } catch (e) {
    // ignore
  }

  o1.start(t);
  o2.start(t);
  o1.stop(t + duration + 0.05);
  o2.stop(t + duration + 0.05);
}
