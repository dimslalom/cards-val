let context = null;
let masterBus = null;
let reverbSend = null;
let noiseBuffer = null;
let pinkBuffer = null;
let shaperCurve = null;

function getSaturationCurve() {
  if (shaperCurve) return shaperCurve;
  const n = 512;
  shaperCurve = new Float32Array(n);
  for (let i = 0; i < n; i += 1) {
    const x = (i * 2) / n - 1;
    shaperCurve[i] = Math.tanh(x * 2.2);
  }
  return shaperCurve;
}

// Builds a lush stereo arena/broadcast reverb impulse response with early reflections + smooth decay.
function createBroadcastImpulse(ctx, duration = 0.75, decay = 3.4) {
  const length = Math.floor(ctx.sampleRate * duration);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch += 1) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i += 1) {
      const t = i / length;
      const env = (1 - t) ** decay;
      // Early reflection pre-delay shaping (broadcast stage room feel)
      const early = i < ctx.sampleRate * 0.025 ? (i / (ctx.sampleRate * 0.025)) : 1;
      data[i] = (Math.random() * 2 - 1) * env * early * 0.5;
    }
  }
  return impulse;
}

function audioContext(create = true) {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!context && !create) return null;
  if (!context) {
    context = new AudioContext();
    // Broadcast Master Bus: glue compressor + arena convolution reverb send
    const comp = context.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-16, context.currentTime);
    comp.knee.setValueAtTime(12, context.currentTime);
    comp.ratio.setValueAtTime(3.5, context.currentTime);
    comp.attack.setValueAtTime(0.003, context.currentTime);
    comp.release.setValueAtTime(0.16, context.currentTime);
    comp.connect(context.destination);
    masterBus = comp;

    try {
      const convolver = context.createConvolver();
      convolver.buffer = createBroadcastImpulse(context, 0.72, 3.2);
      const revFilter = context.createBiquadFilter();
      revFilter.type = 'lowpass';
      revFilter.frequency.setValueAtTime(3200, context.currentTime);
      const revHighpass = context.createBiquadFilter();
      revHighpass.type = 'highpass';
      revHighpass.frequency.setValueAtTime(180, context.currentTime);
      const revGain = context.createGain();
      revGain.gain.setValueAtTime(0.28, context.currentTime);
      convolver.connect(revHighpass).connect(revFilter).connect(revGain).connect(masterBus);
      reverbSend = convolver;
    } catch {
      reverbSend = null;
    }
  }
  if (context.state === 'suspended') context.resume().catch(() => {});
  return context;
}

function getWhiteNoise(ctx) {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  const length = ctx.sampleRate * 2;
  noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

function getPinkNoise(ctx) {
  if (pinkBuffer && pinkBuffer.sampleRate === ctx.sampleRate) return pinkBuffer;
  const length = ctx.sampleRate * 2;
  pinkBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = pinkBuffer.getChannelData(0);
  let b0 = 0; let b1 = 0; let b2 = 0; let b3 = 0; let b4 = 0; let b5 = 0; let b6 = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  return pinkBuffer;
}

function routeOut(ctx, node, pan = 0, wet = 0.18) {
  const dest = masterBus ?? ctx.destination;
  let out = node;
  if (pan && ctx.createStereoPanner) {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), ctx.currentTime);
    node.connect(panner);
    out = panner;
  }
  out.connect(dest);
  if (reverbSend && wet > 0) {
    const send = ctx.createGain();
    send.gain.setValueAtTime(wet, ctx.currentTime);
    out.connect(send).connect(reverbSend);
  }
}

/**
 * Rich synth voice with optional unison detuning (`unison: 2` or `3`) so tones
 * sound like a warm VCT broadcast synthesizer / brass section rather than a robotic single oscillator.
 */
function tone(frequency, duration, {
  endFrequency = frequency,
  gain = 0.016,
  type = 'sine',
  delay = 0,
  attack = 0.004,
  filterFreq = 0,
  filterEndFreq = 0,
  filterType = 'lowpass',
  q = 1,
  fmFreq = 0,
  fmDepth = 0,
  drive = false,
  pan = 0,
  wet = 0.18,
  unison = 1,
  detuneSpread = 9,
  jitter = 0.008,
  create = true,
} = {}) {
  const ctx = audioContext(create);
  if (!ctx) return;
  const start = ctx.currentTime + delay;
  const humanize = jitter > 0 ? 1 + (Math.random() - 0.5) * jitter : 1;
  const f0 = Math.max(20, frequency * humanize);
  const f1 = Math.max(20, endFrequency * humanize);

  const volume = ctx.createGain();
  const atk = Math.min(attack, duration * 0.45);
  volume.gain.setValueAtTime(0.0001, start);
  volume.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), start + atk);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  const voiceGain = ctx.createGain();
  voiceGain.gain.setValueAtTime(1 / Math.sqrt(unison), start);

  let mod = null;
  let modGain = null;
  if (fmFreq > 0 && fmDepth > 0) {
    mod = ctx.createOscillator();
    modGain = ctx.createGain();
    mod.type = 'sine';
    mod.frequency.setValueAtTime(fmFreq, start);
    modGain.gain.setValueAtTime(fmDepth, start);
    modGain.gain.exponentialRampToValueAtTime(0.01, start + duration);
    mod.connect(modGain);
    mod.start(start);
    mod.stop(start + duration + 0.02);
  }

  for (let v = 0; v < unison; v += 1) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, start);
    if (f1 !== f0) {
      osc.frequency.exponentialRampToValueAtTime(f1, start + duration);
    }
    if (unison > 1) {
      const offset = (v - (unison - 1) / 2) * detuneSpread;
      osc.detune.setValueAtTime(offset, start);
    }
    if (modGain) modGain.connect(osc.frequency);
    osc.connect(voiceGain);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  let chain = voiceGain;
  if (filterFreq > 0) {
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.Q.setValueAtTime(q, start);
    filter.frequency.setValueAtTime(Math.max(20, filterFreq), start);
    if (filterEndFreq > 0) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(20, filterEndFreq), start + duration);
    }
    chain.connect(filter);
    chain = filter;
  }
  if (drive) {
    const shaper = ctx.createWaveShaper();
    shaper.curve = getSaturationCurve();
    chain.connect(shaper);
    chain = shaper;
  }
  chain.connect(volume);
  routeOut(ctx, volume, pan, wet);
}

function noiseBurst(duration, {
  gain = 0.015,
  delay = 0,
  attack = 0.003,
  pink = false,
  filterType = 'bandpass',
  freq = 1200,
  endFreq = freq,
  q = 1.5,
  pan = 0,
  wet = 0.14,
  create = true,
} = {}) {
  const ctx = audioContext(create);
  if (!ctx) return;
  const start = ctx.currentTime + delay;
  const source = ctx.createBufferSource();
  source.buffer = pink ? getPinkNoise(ctx) : getWhiteNoise(ctx);
  const maxOffset = Math.max(0.01, source.buffer.duration - duration - 0.05);
  const offset = Math.random() * maxOffset;

  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.Q.setValueAtTime(q, start);
  filter.frequency.setValueAtTime(Math.max(30, freq), start);
  if (endFreq !== freq) {
    filter.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), start + duration);
  }

  const volume = ctx.createGain();
  const atk = Math.min(attack, duration * 0.45);
  volume.gain.setValueAtTime(0.0001, start);
  volume.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), start + atk);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.connect(filter).connect(volume);
  routeOut(ctx, volume, pan, wet);

  source.start(start, offset, duration + 0.02);
  source.stop(start + duration + 0.02);
}

// VCT Broadcast & Tactical Foley Sound Engine
export function playUiSound(kind, step = 0) {
  switch (kind) {
    // ── tactile card, desk & broadcast UI foley ─────────────────────────────
    case 'hover':
      // Subtle matte velvet/cardstock brush tick (dry & tight).
      noiseBurst(0.016, { pink: true, freq: 2400, endFreq: 1500, q: 2.5, gain: 0.007, wet: 0.04, create: false });
      tone(190, 0.018, { endFrequency: 110, gain: 0.004, type: 'sine', wet: 0.02, create: false });
      break;

    case 'lane_hover': {
      // Tactical map-zone target sweep as you drag across lanes A / B / C.
      noiseBurst(0.032, { pink: true, freq: 720, endFreq: 1650, q: 2.2, gain: 0.01, wet: 0.12, create: false });
      tone(130, 0.035, { endFrequency: 92, gain: 0.008, type: 'sine', wet: 0.08, create: false });
      break;
    }

    case 'select':
      // Fixed-pitch VCT broadcast desk confirmation: punchy low-end chest thud + warm filtered transient (never climbs pitch on repeat clicks).
      tone(118, 0.075, { endFrequency: 52, gain: 0.024, type: 'sine', drive: true, wet: 0.1, jitter: 0.02 });
      noiseBurst(0.028, { pink: true, freq: 1450, endFreq: 720, q: 1.8, gain: 0.015, wet: 0.08 });
      tone(440, 0.055, { endFrequency: 330, gain: 0.007, type: 'triangle', filterFreq: 1400, wet: 0.12, jitter: 0.02 });
      break;

    case 'lift':
      // Smooth aerodynamic cardstock lift: low-end air release + soft silk whoosh.
      noiseBurst(0.075, { pink: true, freq: 420, endFreq: 1850, q: 1.2, gain: 0.018, attack: 0.01, wet: 0.14 });
      tone(135, 0.065, { endFrequency: 240, gain: 0.011, type: 'sine', wet: 0.08, jitter: 0.025 });
      break;

    case 'drop':
      // Heavy studio desk slam: deep sub-bass thump + crisp matte slap.
      tone(132, 0.095, { endFrequency: 42, gain: 0.032, type: 'sine', drive: true, wet: 0.14, jitter: 0.02 });
      noiseBurst(0.038, { pink: true, freq: 1350, endFreq: 540, q: 1.5, gain: 0.022, attack: 0.002, wet: 0.12 });
      tone(280, 0.04, { endFrequency: 120, gain: 0.009, type: 'triangle', filterFreq: 900, wet: 0.1 });
      break;

    case 'deal': {
      const pan = ((step % 5) - 2) * 0.16;
      noiseBurst(0.062, { pink: true, freq: 680, endFreq: 2100, q: 1.5, gain: 0.017, attack: 0.005, pan, wet: 0.15 });
      tone(145, 0.05, { endFrequency: 78, gain: 0.013, type: 'sine', delay: 0.012, pan, wet: 0.1, jitter: 0.03 });
      break;
    }

    case 'flip': {
      const pan = ((step % 3) - 1) * 0.2;
      // Cinematic broadcast card turn: fast air whip + deep bass lock.
      noiseBurst(0.095, { pink: true, freq: 520, endFreq: 2800, q: 1.4, gain: 0.022, attack: 0.012, pan, wet: 0.22 });
      tone(155, 0.09, { endFrequency: 58, gain: 0.022, type: 'sine', delay: 0.025, drive: true, pan, wet: 0.18 });
      tone(587.33, 0.08, { endFrequency: 880, gain: 0.008, type: 'triangle', filterFreq: 2200, delay: 0.03, pan, wet: 0.25 });
      break;
    }

    case 'chip_lift':
      // Heavy clay poker chip lift: warm ceramic click + low body.
      tone(190, 0.04, { endFrequency: 110, gain: 0.012, type: 'sine', wet: 0.08 });
      tone(2150, 0.042, { endFrequency: 2320, gain: 0.009, type: 'sine', fmFreq: 340, fmDepth: 120, wet: 0.15, jitter: 0.02 });
      noiseBurst(0.022, { pink: true, freq: 3200, endFreq: 4400, q: 3.2, gain: 0.012, wet: 0.1 });
      break;

    case 'chip_drop':
      // Weighted clay poker chip clack onto broadcast table.
      tone(165, 0.075, { endFrequency: 56, gain: 0.026, type: 'sine', drive: true, wet: 0.12 });
      tone(1980, 0.05, { endFrequency: 1860, gain: 0.011, type: 'sine', fmFreq: 480, fmDepth: 160, wet: 0.16, jitter: 0.025 });
      noiseBurst(0.028, { pink: true, freq: 2600, endFreq: 1400, q: 2.8, gain: 0.018, wet: 0.12 });
      break;

    case 'chip_reroll':
      // Casino-grade clay chip shuffle across the felt.
      for (let i = 0; i < 5; i += 1) {
        const d = i * 0.044 + (Math.random() * 0.012);
        const f = 1850 + i * 180 + (Math.random() * 140);
        const pan = (i - 2) * 0.22;
        tone(140, 0.04, { endFrequency: 70, gain: 0.01, type: 'sine', delay: d, pan, wet: 0.08 });
        tone(f, 0.042, { gain: 0.008, type: 'sine', fmFreq: 390, fmDepth: 140, delay: d, pan, wet: 0.16 });
        noiseBurst(0.024, { pink: true, freq: 2400 + i * 180, q: 2.8, gain: 0.013, delay: d, pan, wet: 0.12 });
      }
      break;

    case 'rattle': {
      // Physical foil wrapper crinkle as you drag across the tear strip.
      const base = 2800 + (step % 8) * 260;
      noiseBurst(0.042, { pink: true, freq: base, endFreq: base * 1.25, q: 2.4, gain: 0.02, filterType: 'bandpass', wet: 0.1 });
      noiseBurst(0.028, { freq: base * 1.35, endFreq: base * 0.85, q: 3.2, gain: 0.014, delay: 0.015, filterType: 'highpass', wet: 0.1 });
      tone(140, 0.035, { endFrequency: 75, gain: 0.01, type: 'sine', wet: 0.06 });
      break;
    }

    case 'pack_open':
      // VCT Walkout / Loot Reveal: pressurized air decompression + sub-bass boom + wide unison broadcast synth swell.
      noiseBurst(0.24, { pink: true, freq: 400, endFreq: 4800, q: 0.9, gain: 0.032, attack: 0.008, wet: 0.38 });
      tone(110, 0.36, { endFrequency: 36, gain: 0.042, type: 'sine', drive: true, wet: 0.25 });
      [220, 329.63, 440, 554.37, 659.25].forEach((freq, i) => {
        tone(freq, 0.42, {
          gain: 0.012 - i * 0.0012,
          type: 'sawtooth',
          unison: 2,
          detuneSpread: 11,
          attack: 0.025,
          filterFreq: 2800,
          filterEndFreq: 950,
          delay: 0.02 + i * 0.028,
          pan: (i - 2) * 0.24,
          wet: 0.42,
        });
      });
      break;

    case 'reveal': {
      // Warm broadcast card spotlight reveal.
      noiseBurst(0.12, { pink: true, freq: 500, endFreq: 2600, q: 1.2, gain: 0.018, attack: 0.015, wet: 0.3 });
      tone(98, 0.22, { endFrequency: 46, gain: 0.026, type: 'sine', drive: true, wet: 0.2 });
      [293.66, 440, 587.33, 659.25].forEach((freq, i) => {
        tone(freq, 0.28, {
          gain: 0.01,
          type: 'sawtooth',
          unison: 2,
          detuneSpread: 8,
          attack: 0.02,
          filterFreq: 2400,
          filterEndFreq: 900,
          delay: i * 0.022,
          pan: (i - 1.5) * 0.2,
          wet: 0.35,
        });
      });
      break;
    }

    case 'jackpot':
      // VCT Champions Trophy / Gold Walkout Drop: massive arena sub-drop + wide detuned brass fifths + crowd-air wash.
      tone(110, 0.55, { endFrequency: 34, gain: 0.048, type: 'sine', drive: true, wet: 0.32 });
      noiseBurst(0.35, { pink: true, freq: 350, endFreq: 3800, q: 0.8, gain: 0.026, attack: 0.02, wet: 0.48 });
      [146.83, 220, 293.66, 369.99, 440, 587.33].forEach((freq, i) => {
        tone(freq, 0.52, {
          gain: 0.014 - i * 0.0012,
          type: 'sawtooth',
          unison: 3,
          detuneSpread: 13,
          attack: 0.03,
          filterFreq: 3400,
          filterEndFreq: 1100,
          delay: i * 0.032,
          pan: (i - 2.5) * 0.22,
          wet: 0.48,
        });
      });
      break;

    // ── board powers / skills (VCT Agent & Broadcast Stingers) ──────────────
    case 'skill_mastermind':
    case 'igl':
      // Tactical IGL Comms / Electric Surge: deep sub-impact + warm filtered synth-brass swell + crisp static burst.
      tone(98, 0.28, { endFrequency: 44, gain: 0.032, type: 'sine', drive: true, wet: 0.22 });
      tone(196, 0.26, { endFrequency: 293.66, gain: 0.015, type: 'sawtooth', unison: 2, detuneSpread: 10, filterFreq: 2200, filterEndFreq: 850, wet: 0.32 });
      noiseBurst(0.14, { pink: true, freq: 1800, endFreq: 4800, q: 2.2, gain: 0.018, wet: 0.28 });
      tone(587.33, 0.16, { endFrequency: 880, gain: 0.01, type: 'triangle', delay: 0.04, pan: 0.2, wet: 0.35 });
      break;

    case 'skill_flex':
      // Hologram Prismatic Whoosh: lush wide chorus pad sweep + aerodynamic air glide.
      noiseBurst(0.28, { pink: true, freq: 450, endFreq: 3400, q: 1.8, gain: 0.018, attack: 0.04, wet: 0.4 });
      [293.66, 440, 554.37, 659.25, 880].forEach((freq, i) => {
        tone(freq, 0.32, {
          endFrequency: freq * 1.015,
          gain: 0.009,
          type: 'sawtooth',
          unison: 2,
          detuneSpread: 12,
          attack: 0.035,
          filterFreq: 2600,
          filterEndFreq: 1200,
          delay: i * 0.02,
          pan: (i - 2) * 0.28,
          wet: 0.45,
        });
      });
      break;

    case 'skill_flick':
      // Valorant Headshot / Chamber Op Glint: heavy low-end chest punch + warm metallic resonance (no piercing high beep).
      tone(125, 0.24, { endFrequency: 42, gain: 0.036, type: 'sine', drive: true, wet: 0.22 });
      noiseBurst(0.065, { pink: true, freq: 2200, endFreq: 950, q: 1.6, gain: 0.024, wet: 0.25 });
      tone(587.33, 0.26, { endFrequency: 587.33, gain: 0.015, type: 'triangle', unison: 2, detuneSpread: 8, fmFreq: 880, fmDepth: 140, wet: 0.38 });
      tone(880, 0.3, { endFrequency: 1174.66, gain: 0.011, type: 'sine', delay: 0.025, pan: 0.22, wet: 0.42 });
      break;

    case 'skill_one_trick':
      // Phoenix / Ember Ignite: deep cinematic fire whoosh + warm brassy horn swell + organic crackle.
      noiseBurst(0.3, { pink: true, freq: 220, endFreq: 1350, q: 1.1, gain: 0.03, attack: 0.03, wet: 0.32 });
      tone(110, 0.28, { endFrequency: 55, gain: 0.03, type: 'sine', drive: true, wet: 0.22 });
      tone(220, 0.26, { endFrequency: 329.63, gain: 0.014, type: 'sawtooth', unison: 2, detuneSpread: 10, filterFreq: 1800, delay: 0.02, wet: 0.35 });
      for (let i = 0; i < 3; i += 1) {
        noiseBurst(0.024, { pink: true, freq: 1800 + i * 650, q: 3.5, gain: 0.015, delay: 0.05 + i * 0.05, pan: (i - 1) * 0.3, wet: 0.2 });
      }
      break;

    case 'skill_aura':
      // Omen / Shockwave Bass Drop: theatrical broadcast sub-bass bend + dark detuned low-brass growl.
      tone(116, 0.42, { endFrequency: 36, gain: 0.04, type: 'sine', drive: true, wet: 0.28 });
      tone(116, 0.38, { endFrequency: 58, gain: 0.018, type: 'sawtooth', unison: 3, detuneSpread: 14, filterFreq: 420, filterEndFreq: 120, drive: true, wet: 0.35 });
      noiseBurst(0.28, { pink: true, freq: 480, endFreq: 140, q: 1.6, gain: 0.022, attack: 0.025, wet: 0.32 });
      break;

    // ── VCT broadcast round flow, kill-banner scoring & combos ──────────────
    case 'lock_in':
      // VCT Agent Lock-In Slam: cinematic sub-bass drop + air whoosh + wide unison brass power fifth.
      noiseBurst(0.16, { pink: true, freq: 480, endFreq: 2400, q: 1.2, gain: 0.024, attack: 0.006, wet: 0.32 });
      tone(118, 0.32, { endFrequency: 38, gain: 0.042, type: 'sine', drive: true, wet: 0.24 });
      [196, 293.66, 392].forEach((freq, i) => {
        tone(freq, 0.28, {
          gain: 0.014 - i * 0.002,
          type: 'sawtooth',
          unison: 2,
          detuneSpread: 10,
          attack: 0.012,
          filterFreq: 2400,
          filterEndFreq: 750,
          delay: 0.015 + i * 0.02,
          pan: (i - 1) * 0.2,
          wet: 0.36,
        });
      });
      break;

    case 'rotate_ready':
      // Broadcast Tactical Phase Transition: warm low-tom pulse + stereo synth-horn call.
      tone(110, 0.18, { endFrequency: 55, gain: 0.024, type: 'sine', wet: 0.2 });
      noiseBurst(0.12, { pink: true, freq: 600, endFreq: 1800, q: 1.5, gain: 0.014, wet: 0.28 });
      tone(293.66, 0.16, { gain: 0.012, type: 'sawtooth', unison: 2, filterFreq: 1800, filterEndFreq: 800, pan: -0.18, wet: 0.34 });
      tone(440, 0.22, { gain: 0.013, type: 'sawtooth', unison: 2, filterFreq: 2200, filterEndFreq: 950, delay: 0.075, pan: 0.18, wet: 0.38 });
      break;

    case 'score': {
      // Valorant Kill-Banner Tick: deep percussive chest thump + warm harmonic marimba/brass transient.
      const scale = [196, 220, 246.94, 293.66, 329.63, 392, 440, 493.88, 587.33];
      const idx = Math.max(0, step);
      const f = scale[idx % scale.length];
      tone(115, 0.09, { endFrequency: 46, gain: 0.026, type: 'sine', drive: true, wet: 0.15 });
      noiseBurst(0.03, { pink: true, freq: 1600, endFreq: 750, q: 1.6, gain: 0.016, wet: 0.18 });
      tone(f, 0.15, { gain: 0.015, type: 'sawtooth', unison: 2, detuneSpread: 8, filterFreq: 2200, filterEndFreq: 680, wet: 0.28 });
      break;
    }

    case 'score_opp': {
      // Opponent stat pop: darker, muted low-end pulse so you can tell sides apart by ear without harshness.
      const scale = [146.83, 164.81, 174.61, 196, 220, 246.94, 293.66];
      const idx = Math.max(0, step);
      const f = scale[idx % scale.length];
      tone(95, 0.09, { endFrequency: 42, gain: 0.022, type: 'sine', wet: 0.14 });
      noiseBurst(0.028, { pink: true, freq: 950, endFreq: 480, q: 1.5, gain: 0.013, wet: 0.14 });
      tone(f, 0.13, { gain: 0.012, type: 'sawtooth', unison: 2, detuneSpread: 7, filterFreq: 1200, filterEndFreq: 420, wet: 0.22 });
      break;
    }

    case 'combo':
    case 'specialty': {
      // Synergy Link (Roles +20 / Team +15 / Nation +8): warm broadcast brass double-hit + sub punch.
      const base = 220 * (1 + (step % 4) * 0.125);
      tone(105, 0.18, { endFrequency: 45, gain: 0.028, type: 'sine', drive: true, wet: 0.2 });
      noiseBurst(0.07, { pink: true, freq: 1200, endFreq: 2800, q: 1.4, gain: 0.016, wet: 0.28 });
      [base, base * 1.25, base * 1.5].forEach((freq, i) => {
        tone(freq, 0.22, {
          gain: 0.013,
          type: 'sawtooth',
          unison: 2,
          detuneSpread: 10,
          filterFreq: 2600,
          filterEndFreq: 850,
          delay: i * 0.032,
          pan: (i - 1) * 0.2,
          wet: 0.36,
        });
      });
      break;
    }

    case 'tactic_mult': {
      // 3D Chip Spin & Broadcast Multiplier Slam (×1.5 to ×3.0): rising riser whoosh + massive arena chord slam.
      const intensity = Math.max(1, Math.min(3, step || 2));
      noiseBurst(0.14, { pink: true, freq: 500, endFreq: 2800, q: 1.8, gain: 0.02, attack: 0.02, wet: 0.25 });
      tone(160, 0.13, { endFrequency: 420, gain: 0.014, type: 'triangle', wet: 0.2 });
      // Slam at 0.13s when the spinning chip lands
      tone(98, 0.38, { endFrequency: 36, gain: 0.044, type: 'sine', delay: 0.13, drive: true, wet: 0.3 });
      noiseBurst(0.12, { pink: true, freq: 1800, endFreq: 680, q: 1.2, gain: 0.026, delay: 0.13, wet: 0.32 });
      const root = intensity >= 2.5 ? 220 : 196;
      [root, root * 1.25, root * 1.5, root * 2].forEach((freq, i) => {
        tone(freq, 0.36, {
          gain: 0.014 - i * 0.0015,
          type: 'sawtooth',
          unison: 3,
          detuneSpread: 12,
          filterFreq: 3000,
          filterEndFreq: 900,
          delay: 0.13 + i * 0.018,
          pan: (i - 1.5) * 0.22,
          wet: 0.44,
        });
      });
      break;
    }

    case 'impact':
    case 'lane_win': {
      // VCT Map/Site Claimed Stamp: heavy sub-bass boom + wide brass chord stinger.
      const boost = step > 0 ? 1.12 : 1;
      tone(96 * boost, 0.32, { endFrequency: 38, gain: 0.042, type: 'sine', drive: true, wet: 0.26 });
      noiseBurst(0.11, { pink: true, freq: 1500, endFreq: 520, q: 1.2, gain: 0.026, wet: 0.28 });
      [196 * boost, 293.66 * boost, 392 * boost].forEach((freq, i) => {
        tone(freq, 0.26, {
          gain: 0.013,
          type: 'sawtooth',
          unison: 2,
          detuneSpread: 10,
          filterFreq: 2600,
          filterEndFreq: 800,
          delay: i * 0.02,
          pan: (i - 1) * 0.2,
          wet: 0.38,
        });
      });
      break;
    }

    case 'lane_loss':
      // Site Lost Stamp: deep low-passed thud + dark minor brass resolve.
      tone(88, 0.26, { endFrequency: 38, gain: 0.032, type: 'sine', drive: true, wet: 0.2 });
      noiseBurst(0.08, { pink: true, freq: 620, endFreq: 220, q: 1.4, gain: 0.018, wet: 0.2 });
      tone(196, 0.22, { endFrequency: 174.61, gain: 0.012, type: 'sawtooth', unison: 2, filterFreq: 850, filterEndFreq: 320, wet: 0.28 });
      break;

    case 'round_win':
      // VCT Round Won Broadcast Stinger: arena bass impact + rising 4-voice synth-brass anthem.
      tone(104, 0.42, { endFrequency: 36, gain: 0.044, type: 'sine', drive: true, wet: 0.3 });
      noiseBurst(0.22, { pink: true, freq: 600, endFreq: 3200, q: 1.0, gain: 0.022, attack: 0.015, wet: 0.4 });
      [196, 246.94, 293.66, 392, 493.88].forEach((freq, i) => {
        tone(freq, 0.36, {
          gain: 0.014 - i * 0.0012,
          type: 'sawtooth',
          unison: 3,
          detuneSpread: 11,
          attack: 0.02,
          filterFreq: 2800,
          filterEndFreq: 950,
          delay: i * 0.045,
          pan: (i - 2) * 0.22,
          wet: 0.45,
        });
      });
      break;

    case 'round_loss':
      // Round Lost Broadcast Resolve: heavy sub-drop + warm low-passed minor cadence.
      tone(98, 0.38, { endFrequency: 38, gain: 0.034, type: 'sine', drive: true, wet: 0.25 });
      noiseBurst(0.18, { pink: true, freq: 900, endFreq: 280, q: 1.2, gain: 0.016, wet: 0.28 });
      [220, 196, 164.81].forEach((freq, i) => {
        tone(freq, 0.3, {
          gain: 0.012,
          type: 'sawtooth',
          unison: 2,
          detuneSpread: 9,
          filterFreq: 1050,
          filterEndFreq: 340,
          delay: i * 0.075,
          pan: (i - 1) * 0.18,
          wet: 0.36,
        });
      });
      break;

    case 'series_win':
      // VCT Grand Final / Series Victory Anthem: massive stage drop + lush 3-oscillator unison brass chord + stadium air.
      tone(110, 0.65, { endFrequency: 32, gain: 0.05, type: 'sine', drive: true, wet: 0.35 });
      noiseBurst(0.45, { pink: true, freq: 400, endFreq: 3800, q: 0.8, gain: 0.028, attack: 0.03, wet: 0.5 });
      [146.83, 220, 293.66, 369.99, 440, 587.33, 739.99].forEach((freq, i) => {
        tone(freq, 0.58, {
          gain: 0.015 - i * 0.0014,
          type: 'sawtooth',
          unison: 3,
          detuneSpread: 14,
          attack: 0.035,
          filterFreq: 3400,
          filterEndFreq: 1100,
          delay: i * 0.045,
          pan: (i - 3) * 0.2,
          wet: 0.5,
        });
      });
      break;

    case 'series_loss':
      // Series Defeat Broadcast Outro: deep cinematic sub-drop + warm dark minor brass swell.
      tone(82.41, 0.55, { endFrequency: 34, gain: 0.038, type: 'sine', drive: true, wet: 0.3 });
      noiseBurst(0.3, { pink: true, freq: 600, endFreq: 200, q: 1.1, gain: 0.018, attack: 0.03, wet: 0.35 });
      [196, 233.08, 293.66, 146.83].forEach((freq, i) => {
        tone(freq, 0.42, {
          gain: 0.012,
          type: 'sawtooth',
          unison: 3,
          detuneSpread: 11,
          attack: 0.03,
          filterFreq: 950,
          filterEndFreq: 280,
          delay: i * 0.075,
          pan: (i - 1.5) * 0.18,
          wet: 0.42,
        });
      });
      break;

    // ── club mode hub: training, tapes, contracts, vault ────────────────────
    case 'train_start':
      // Broadcast Power-Up Riser during the 1.15s training drill animation.
      noiseBurst(0.95, { pink: true, freq: 240, endFreq: 2200, q: 1.8, gain: 0.018, attack: 0.18, wet: 0.35 });
      tone(110, 0.95, { endFrequency: 293.66, gain: 0.018, type: 'sawtooth', unison: 2, detuneSpread: 10, attack: 0.15, filterFreq: 600, filterEndFreq: 2400, wet: 0.35 });
      tone(164.81, 0.9, { endFrequency: 440, gain: 0.012, type: 'triangle', unison: 2, attack: 0.22, delay: 0.05, wet: 0.38 });
      break;

    case 'train_done':
      // Warm Broadcast Rank-Up Stinger when training completes or OVR levels up.
      tone(110, 0.26, { endFrequency: 44, gain: 0.034, type: 'sine', drive: true, wet: 0.24 });
      noiseBurst(0.1, { pink: true, freq: 900, endFreq: 2800, q: 1.4, gain: 0.018, wet: 0.3 });
      [293.66, 440, 587.33].forEach((freq, i) => {
        tone(freq, 0.28, {
          gain: 0.014,
          type: 'sawtooth',
          unison: 2,
          detuneSpread: 10,
          filterFreq: 2600,
          filterEndFreq: 900,
          delay: i * 0.045,
          pan: (i - 1) * 0.2,
          wet: 0.4,
        });
      });
      break;

    case 'tape':
      // Physical VHS / Cassette Deck Clunk-Whir-Latch.
      tone(140, 0.06, { endFrequency: 58, gain: 0.026, type: 'sine', drive: true, wet: 0.1 });
      noiseBurst(0.032, { pink: true, freq: 1200, endFreq: 580, q: 2.5, gain: 0.022, wet: 0.1 });
      noiseBurst(0.12, { pink: true, freq: 700, endFreq: 1900, q: 2.2, gain: 0.014, delay: 0.045, wet: 0.15 });
      tone(220, 0.07, { endFrequency: 330, gain: 0.012, type: 'triangle', delay: 0.15, wet: 0.18 });
      noiseBurst(0.025, { pink: true, freq: 2200, q: 3, gain: 0.018, delay: 0.155, wet: 0.12 });
      break;

    case 'sign':
      // Official Contract Stamp / Roster Lock-In: deep desk stamp + warm brass fifth.
      tone(118, 0.18, { endFrequency: 44, gain: 0.034, type: 'sine', drive: true, wet: 0.2 });
      noiseBurst(0.055, { pink: true, freq: 1650, endFreq: 680, q: 1.6, gain: 0.022, wet: 0.18 });
      tone(293.66, 0.18, { gain: 0.012, type: 'sawtooth', unison: 2, filterFreq: 2200, filterEndFreq: 800, delay: 0.025, wet: 0.32 });
      tone(440, 0.22, { gain: 0.011, type: 'sawtooth', unison: 2, filterFreq: 2400, filterEndFreq: 900, delay: 0.065, wet: 0.36 });
      break;

    case 'vault_bump':
      // Heavy vault counter thud + warm chord ping when flying packs/tapes land.
      tone(130, 0.12, { endFrequency: 52, gain: 0.026, type: 'sine', drive: true, wet: 0.16 });
      tone(329.63, 0.14, { endFrequency: 493.88, gain: 0.012, type: 'sawtooth', unison: 2, filterFreq: 2200, filterEndFreq: 850, wet: 0.28 });
      noiseBurst(0.03, { pink: true, freq: 2100, gain: 0.012, wet: 0.16 });
      break;

    default:
      break;
  }
}
