import { APEX_PTS, EVO_ART, OUTLINES, insetPts, segRing } from './evoArt';
import styles from './EvoFx.module.css';

// Effects around an evolved rare or apex card, in the card's own 400x580 space.
// The box reaches 88px past each side and 104px past each end, so effects can
// leave the card a little without being clipped. PlayerCard mounts a `back`
// layer under the card and a `front` layer over it.

const VB = '-88 -104 576 789';
const f = n => n.toFixed(1);
const path = list => `M${list.map(p => p.map(f).join(',')).join(' L')} Z`;

function rng(seed) {
  let a = seed;
  return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; };
}

// ── Shared Comet ─────────────────────────────────────────────────────────────

function comet(d, phase, slow, c1 = '#ff2d55', c2 = '#ff3d5e', c3 = '#ffb0a0', c4 = '#fff6dc') {
  const parts = [[9, 5, c1, .3], [6, 4, c2, .55], [3, 3, c3, .85], [1, 2.4, c4, 1]];
  return parts.map(([len, w, c, op]) => `<path class="${styles.comet}" d="${d}" pathLength="100" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${len} ${100 - len}" style="--o:${f(-phase - (9 - len))};--dur:${slow ? 7 : 3.6}s"/>`).join('');
}

// ── Bolts & Lightning ────────────────────────────────────────────────────────

const BOLTS = [[-14, 70, -30, 270], [414, 300, 432, 510], [290, -10, 412, 52], [-10, 400, 60, 588]];
const BOLTS_TEMPEST = [[-45, 60, -10, 240], [410, 220, 445, 460], [240, -30, 390, 50], [-25, 420, 80, 610]];

function boltPts([x0, y0, x1, y1]) {
  const n = 9, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  return Array.from({ length: n + 1 }, (_, i) => { const k = i / n, j = i === 0 || i === n ? 0 : (Math.random() - .5) * 34; return `${f(x0 + dx * k + nx * j)},${f(y0 + dy * k + ny * j)}`; }).join(' ');
}

// ── RARE BACK EFFECTS (Extend out of border) ─────────────────────────────────

// 1. Amethyst (Clutch): Radar sonar ring and pulsing pings
function clutch(t) {
  return `<circle cx="200" cy="290" r="221" fill="none" stroke="${t.line}" stroke-opacity=".25"/>
<g class="${styles.spin} ${styles.tick}">${segRing(200, 290, 213, 45, 33, 4, t.metal[1], t.line, .2)}</g>
<g class="${styles.beep}"><circle cx="200" cy="290" r="213" fill="none" stroke="${t.metal[1]}" stroke-width="1.6"/></g>
<g class="${styles.beep}" style="animation-delay:1.2s"><circle cx="200" cy="290" r="213" fill="none" stroke="${t.line}" stroke-width="1.2"/></g>`;
}

// 2. Cyber (Overdrive): Branching copper conduits with glowing data packets
function hive(t) {
  const r = rng(7);
  let base = '', packets = '', nodes = '';
  for (let i = 0; i < 9; i++) {
    const side = i % 3, y = 60 + r() * 460, x = 120 + r() * 160;
    let p;
    if (side < 2) {
      const dir = side === 0 ? -1 : 1, x0 = side === 0 ? 0 : 400, h1 = 6 + r() * 8, d = 5 + r() * 5, up = r() < .5 ? -1 : 1;
      p = [[x0, y], [x0 + dir * h1, y], [x0 + dir * (h1 + d), y + up * d], [x0 + dir * (h1 + d + 4 + r() * 6), y + up * d]];
    } else {
      const top = r() < .5, y0 = top ? 14 : 566, dir = top ? -1 : 1, h1 = 8 + r() * 6, d = 4 + r() * 4, lr = r() < .5 ? -1 : 1;
      p = [[x, y0], [x, y0 + dir * h1], [x + lr * d, y0 + dir * (h1 + d)], [x + lr * d, y0 + dir * (h1 + d + 3 + r() * 5)]];
    }
    const line = p.map(q => q.map(f).join(',')).join(' '), end = p[3];
    base += `<polyline points="${line}" fill="none" stroke="${t.line}" stroke-opacity=".5" stroke-width="1.2"/><circle cx="${f(end[0])}" cy="${f(end[1])}" r="2.6" fill="${t.bg[1]}" stroke="${t.line}" stroke-width="1.2"/>`;
    packets += `<polyline class="${styles.packet}" style="--dur:${f(1.4 + r() * 1.8)}s;--d:${f(r() * -3)}s" points="${line}" fill="none" stroke="${t.metal[1]}" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < 6; i++) {
    const x = i % 2 ? -10 - r() * 14 : 410 + r() * 14, y = 60 + r() * 460;
    nodes += `<circle class="${styles.blink}" style="--d:${f(r() * -2)}s" cx="${f(x)}" cy="${f(y)}" r="2.2" fill="${t.line}"/>`;
  }
  return base + packets + nodes;
}

// 3. Solstice (Solar): Giant radiating solar corona with flare spears and expanding CME pulse
function solsticeBack(t) {
  // Center is 200, 290. Spears reach to radius 255 (x = -55 to 455).
  let rays = '';
  for (let i = 0; i < 16; i++) {
    const rad = (i / 16) * Math.PI * 2;
    const x0 = 200 + Math.cos(rad) * 215, y0 = 290 + Math.sin(rad) * 215;
    const x1 = 200 + Math.cos(rad) * 258, y1 = 290 + Math.sin(rad) * 258;
    rays += `<line x1="${f(x0)}" y1="${f(y0)}" x2="${f(x1)}" y2="${f(y1)}" stroke="#ffa94d" stroke-width="2.8" stroke-linecap="round" stroke-opacity=".7"/>`;
  }
  return `
    <circle cx="200" cy="290" r="235" fill="none" stroke="${t.line}" stroke-opacity=".3"/>
    <g class="${styles.spin}">${rays}</g>
    <g class="${styles.solarBeep}">
      <circle cx="200" cy="290" r="225" fill="none" stroke="#ffa94d" stroke-width="2.2"/>
    </g>
    <g class="${styles.solarBeep}" style="animation-delay:1.4s">
      <circle cx="200" cy="290" r="240" fill="none" stroke="#ffd43b" stroke-width="1.4"/>
    </g>
  `;
}

// 4. Void Walker (Abyss): Abyssal tentacles reaching out past borders with pulsing packets
function voidBack(t) {
  const tentacles = [
    // Left side tentacles
    [[-8, 140], [-35, 120], [-60, 160], [-72, 210]],
    [[-8, 380], [-45, 410], [-68, 390], [-75, 440]],
    // Right side tentacles
    [[408, 160], [435, 140], [465, 180], [472, 230]],
    [[408, 400], [445, 420], [466, 390], [474, 450]],
    // Top & Bottom tentacles
    [[140, -4], [120, -35], [150, -60], [170, -72]],
    [[260, -4], [280, -35], [260, -60], [240, -72]],
    [[150, 584], [130, 615], [160, 640], [180, 655]],
    [[250, 584], [270, 615], [245, 640], [225, 655]],
  ];
  let base = '', packets = '', nodes = '';
  tentacles.forEach((p, idx) => {
    const line = p.map(q => q.map(f).join(',')).join(' ');
    const end = p[3];
    base += `<polyline points="${line}" fill="none" stroke="#7950f2" stroke-opacity=".55" stroke-width="2.2" stroke-linecap="round"/>`;
    packets += `<polyline class="${styles.packet}" style="--dur:${f(1.8 + (idx % 3) * .4)}s;--d:${f(-(idx * .3))}s" points="${line}" fill="none" stroke="#b197fc" stroke-width="3" stroke-linecap="round"/>`;
    nodes += `<circle class="${styles.blink}" style="--d:${f(-(idx * .25))}s" cx="${f(end[0])}" cy="${f(end[1])}" r="3.2" fill="#d0bfff"/>`;
  });
  return `
    <circle cx="200" cy="290" r="225" fill="none" stroke="${t.line}" stroke-opacity=".35"/>
    <g class="${styles.beep}"><circle cx="200" cy="290" r="218" fill="none" stroke="#7950f2" stroke-width="1.8"/></g>
    ${base}${packets}${nodes}
  `;
}

// 5. Chronos (Chrono): Celestial astrolabe dial and 4 corner clockwork gears
function chronosBack(t) {
  // Center astrolabe dial extending past card borders
  return `
    <circle cx="200" cy="290" r="235" fill="none" stroke="${t.line}" stroke-opacity=".3"/>
    <g class="${styles.spin}">
      ${segRing(200, 290, 225, 24, 12, 5, '#d8b34c', t.line, .3)}
    </g>
    <!-- 4 corner rotating brass gears extending outside border -->
    <g class="${styles.gearSpin}" style="--cx:-25px;--cy:70px;--dur:16s;--dir:normal">
      <circle cx="-25" cy="70" r="42" fill="none" stroke="#d8b34c" stroke-width="2.5" stroke-dasharray="10 8" stroke-opacity=".85"/>
      <circle cx="-25" cy="70" r="26" fill="none" stroke="#ffe066" stroke-width="1.5" stroke-opacity=".6"/>
    </g>
    <g class="${styles.gearSpin}" style="--cx:425px;--cy:70px;--dur:16s;--dir:reverse">
      <circle cx="425" cy="70" r="42" fill="none" stroke="#d8b34c" stroke-width="2.5" stroke-dasharray="10 8" stroke-opacity=".85"/>
      <circle cx="425" cy="70" r="26" fill="none" stroke="#ffe066" stroke-width="1.5" stroke-opacity=".6"/>
    </g>
    <g class="${styles.gearSpin}" style="--cx:-25px;--cy:510px;--dur:20s;--dir:reverse">
      <circle cx="-25" cy="510" r="46" fill="none" stroke="#d8b34c" stroke-width="2.5" stroke-dasharray="12 8" stroke-opacity=".85"/>
      <circle cx="-25" cy="510" r="30" fill="none" stroke="#ffe066" stroke-width="1.5" stroke-opacity=".6"/>
    </g>
    <g class="${styles.gearSpin}" style="--cx:425px;--cy:510px;--dur:20s;--dir:normal">
      <circle cx="425" cy="510" r="46" fill="none" stroke="#d8b34c" stroke-width="2.5" stroke-dasharray="12 8" stroke-opacity=".85"/>
      <circle cx="425" cy="510" r="30" fill="none" stroke="#ffe066" stroke-width="1.5" stroke-opacity=".6"/>
    </g>
    <g class="${styles.beep}"><circle cx="200" cy="290" r="225" fill="none" stroke="#ffd43b" stroke-width="1.6"/></g>
  `;
}

// 6. Tempest (Storm): Storm generator pylons outside borders with crackling blue lightning
function tempestBack(t) {
  const pylons = [[-45, 60], [-45, 520], [445, 60], [445, 520], [200, -50], [200, 630]];
  let nodes = '';
  pylons.forEach(([x, y], i) => {
    nodes += `<circle cx="${x}" cy="${y}" r="4" fill="#339af0" stroke="#e7f5ff" stroke-width="1.5"/><circle class="${styles.blink}" style="--d:${f(i * -.3)}s" cx="${x}" cy="${y}" r="8" fill="none" stroke="#74c0fc" stroke-width="1.2"/>`;
  });
  const bolts = BOLTS_TEMPEST.map((b, i) => `<g class="${styles.bolt}" style="--d:${f(i * .6)}s;--dur:${f(2.4 + i * .4)}s" data-bolt="${i}" data-set="tempest"><polyline points="${boltPts(b)}" fill="none" stroke="#339af0" stroke-width="4.5" stroke-opacity=".8" stroke-linejoin="bevel"/><polyline points="${boltPts(b)}" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="bevel"/></g>`).join('');
  return `
    <circle cx="200" cy="290" r="225" fill="none" stroke="${t.line}" stroke-opacity=".3"/>
    <g class="${styles.beep}"><circle cx="200" cy="290" r="220" fill="none" stroke="#339af0" stroke-width="1.8"/></g>
    ${bolts}${nodes}
  `;
}

// ── APEX BACK EFFECTS (Extend out of border) ─────────────────────────────────

// 7. Singularity (Apex Back): Massive outer accretion vortex reaching 70px past borders
function singularityBack(t) {
  // Center at 200, 290. Spiral arms curve out past borders to x = -60 and 460
  return `
    <circle cx="200" cy="290" r="235" fill="none" stroke="${t.line}" stroke-opacity=".35"/>
    <g class="${styles.vortexSpin}">
      <path d="M200,290 C150,200 80,180 -50,220" fill="none" stroke="#22b8cf" stroke-width="3" stroke-linecap="round" stroke-opacity=".75"/>
      <path d="M200,290 C250,380 320,400 450,360" fill="none" stroke="#7950f2" stroke-width="3" stroke-linecap="round" stroke-opacity=".75"/>
      <path d="M200,290 C280,240 330,170 430,120" fill="none" stroke="#3bc9db" stroke-width="2.5" stroke-linecap="round" stroke-opacity=".65"/>
      <path d="M200,290 C120,340 70,410 -30,460" fill="none" stroke="#b197fc" stroke-width="2.5" stroke-linecap="round" stroke-opacity=".65"/>
    </g>
    <g class="${styles.beep}">
      <circle cx="200" cy="290" r="225" fill="none" stroke="#22b8cf" stroke-width="2"/>
    </g>
    <g class="${styles.beep}" style="animation-delay:1.2s">
      <circle cx="200" cy="290" r="230" fill="none" stroke="#b197fc" stroke-width="1.4"/>
    </g>
  `;
}

// 8. Valkyrie (Apex Back): Massive golden angel wings extending 80px past sides
function valkyrieBack() {
  return `
    <g class="${styles.wingFlap}">
      <!-- Left angelic wing extending to x = -80 -->
      <path d="M150,270 C90,210 20,150 -75,130 C-95,175 -85,240 -20,285 C-55,315 -45,370 25,380 C0,400 25,435 80,420 C60,440 95,460 145,415 L150,330 Z" fill="rgba(255,215,0,.14)" stroke="#ffd43b" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M130,290 C80,240 25,195 -45,175 C-65,220 -40,265 15,295" fill="none" stroke="#ffe066" stroke-width="1.8"/>
      <!-- Right angelic wing extending to x = 480 -->
      <path d="M250,270 C310,210 380,150 475,130 C495,175 485,240 420,285 C455,315 445,370 375,380 C400,400 375,435 320,420 C340,440 305,460 255,415 L250,330 Z" fill="rgba(255,215,0,.14)" stroke="#ffd43b" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M270,290 C320,240 375,195 445,175 C465,220 440,265 385,295" fill="none" stroke="#ffe066" stroke-width="1.8"/>
    </g>
    <g class="${styles.beep}">
      <circle cx="200" cy="290" r="225" fill="none" stroke="#ffd43b" stroke-width="2"/>
    </g>
  `;
}

// 9. Sovereign (Apex Back): Imperial sunburst seal with royal gold spikes extending past borders
function sovereignBack(t) {
  let spikes = '';
  for (let i = 0; i < 20; i++) {
    const rad = (i / 20) * Math.PI * 2;
    const x0 = 200 + Math.cos(rad) * 215, y0 = 290 + Math.sin(rad) * 215;
    const x1 = 200 + Math.cos(rad) * 250, y1 = 290 + Math.sin(rad) * 250;
    spikes += `<line x1="${f(x0)}" y1="${f(y0)}" x2="${f(x1)}" y2="${f(y1)}" stroke="#d8b34c" stroke-width="2.5" stroke-linecap="round" stroke-opacity=".75"/>`;
  }
  return `
    <circle cx="200" cy="290" r="235" fill="none" stroke="${t.line}" stroke-opacity=".3"/>
    <g class="${styles.spin}">${spikes}</g>
    <g class="${styles.beep}">
      <circle cx="200" cy="290" r="225" fill="none" stroke="#ffd43b" stroke-width="2.2"/>
    </g>
  `;
}

// ── APEX FRONT EFFECTS (Two dynamic animated effects) ────────────────────────

// 1. APEX PREDATOR: Crimson lightning bolts + Animated red claw swipes
function apexPredatorFront(level, border) {
  if (level !== 2) return border ? comet(path(insetPts(8.5)), 0, true) : '';
  const d = path(APEX_PTS);
  const surge = `<path class="${styles.surge}" d="${d}" fill="none" stroke="#ff2850" stroke-width="6" stroke-linejoin="round"/><path class="${styles.surge}" d="${d}" fill="none" stroke="#fff0d2" stroke-width="1.5" stroke-linejoin="round"/>`;
  const bolts = BOLTS.map((b, i) => `<g class="${styles.bolt}" style="--d:${f(i * .45)}s;--dur:${f(2.0 + (i % 2) * .3)}s" data-bolt="${i}" data-set="apex"><polyline points="${boltPts(b)}" fill="none" stroke="#ff2d55" stroke-width="5" stroke-opacity=".65" stroke-linejoin="bevel"/><polyline points="${boltPts(b)}" fill="none" stroke="#fff2f4" stroke-width="1.8" stroke-linejoin="bevel"/></g>`).join('');
  const swipes = [0, 1, 2].map(i => {
    const sd = `M${434 - i * 6},${30 + i * 44} Q${214 - i * 8},${118 + i * 44} ${-34 + i * 4},${404 + i * 40}`;
    return `<path class="${styles.swipe}" style="--d:${f(i * .08)}s" d="${sd}" fill="none" stroke="#ff1f4b" stroke-width="12" stroke-linecap="round"/><path class="${styles.swipe}" style="--d:${f(i * .08 + .02)}s" d="${sd}" fill="none" stroke="#ffe9a8" stroke-width="2.8" stroke-linecap="round"/>`;
  }).join('');
  return (border ? surge + comet(d, 0) + comet(d, 50) : '') + bolts + swipes;
}

// 2. SINGULARITY: Inward gravitational matter streams + Spacetime lensing distortion ripples + Void core
function singularityFront(level, border) {
  const d = path(OUTLINES.singularity ?? APEX_PTS);
  if (level !== 2) return border ? comet(d, 0, true, '#22b8cf', '#3bc9db', '#66d9e8', '#e3fafc') : '';

  // Effect 1: Gravitational Infall Streams (Cosmic matter spiraling directly into the black hole)
  const infallPaths = [
    'M-30,110 C80,170 150,210 200,290',
    'M430,130 C320,170 250,220 200,290',
    'M-20,450 C90,390 150,350 200,290',
    'M420,470 C310,410 250,360 200,290',
    'M200,-50 C160,80 180,180 200,290',
    'M200,630 C240,500 220,400 200,290',
  ];
  const infallStreams = infallPaths.map((p, i) => `
    <path d="${p}" fill="none" stroke="#22b8cf" stroke-width="1.2" stroke-opacity=".35"/>
    <path class="${styles.infall}" style="--d:${f(i * .3)}s;--dur:${f(1.8 + (i % 2) * .4)}s" d="${p}" fill="none" stroke="${i % 2 === 0 ? '#66d9e8' : '#b197fc'}" stroke-width="${i % 2 === 0 ? '3.5' : '2.5'}" stroke-linecap="round"/>
    <path class="${styles.infall}" style="--d:${f(i * .3 + .05)}s;--dur:${f(1.8 + (i % 2) * .4)}s" d="${p}" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"/>
  `).join('');

  // Effect 2: Gravitational Lensing Spacetime Distortion Ripples
  const ripples = [0, 1, 2].map(i => `
    <g class="${styles.lensRipple}" style="--d:${f(i * 1.0)}s;--dur:3.2s">
      <ellipse cx="200" cy="290" rx="140" ry="110" fill="none" stroke="#06b6d4" stroke-width="3" stroke-opacity=".75"/>
      <ellipse cx="200" cy="290" rx="160" ry="125" fill="none" stroke="#b197fc" stroke-width="1.8" stroke-opacity=".6"/>
    </g>
  `).join('');

  // Center Event Horizon Void Core
  const voidCore = `
    <g class="${styles.voidCore}">
      <circle cx="200" cy="290" r="42" fill="none" stroke="#22b8cf" stroke-width="2.5" stroke-opacity=".85"/>
      <circle cx="200" cy="290" r="35" fill="#01050a" stroke="#e3fafc" stroke-width="1.5"/>
      <circle cx="200" cy="290" r="18" fill="#000000"/>
    </g>
  `;

  const cm = border ? comet(d, 0, false, '#22b8cf', '#3bc9db', '#b197fc', '#e3fafc') + comet(d, 50, false, '#7950f2', '#9775fa', '#3bc9db', '#ffffff') : '';
  return cm + ripples + infallStreams + voidCore;
}

// 3. VALKYRIE: Volumetric cathedral god-rays + Falling golden feathers + Sacred runic halo
function valkyrieFront(level, border) {
  const d = path(OUTLINES.valkyrie ?? APEX_PTS);
  if (level !== 2) return border ? comet(d, 0, true, '#fab005', '#ffd43b', '#ffe066', '#fff9db') : '';

  // Effect 1: Volumetric Cathedral God-Rays streaming from heaven
  const godRays = `
    <g>
      <polygon class="${styles.godRay}" style="--d:0s;--dur:3.4s" points="160,-20 220,-20 120,520 40,520" fill="rgba(255,224,102,.14)"/>
      <polygon class="${styles.godRay}" style="--d:1.1s;--dur:3.8s" points="190,-20 250,-20 270,520 190,520" fill="rgba(255,250,210,.18)"/>
      <polygon class="${styles.godRay}" style="--d:2.2s;--dur:3.2s" points="220,-20 280,-20 380,520 300,520" fill="rgba(255,212,59,.14)"/>
      <line class="${styles.godRay}" style="--d:.5s;--dur:2.8s" x1="180" y1="0" x2="100" y2="480" stroke="#fff3bf" stroke-width="2" stroke-linecap="round"/>
      <line class="${styles.godRay}" style="--d:1.7s;--dur:3.0s" x1="240" y1="0" x2="320" y2="480" stroke="#ffe066" stroke-width="2" stroke-linecap="round"/>
    </g>
  `;

  // Effect 2: Falling Golden Feathers & Sacred Runic Halo
  const halo = `
    <g>
      <!-- Outer counter-rotating sacred geometry ring -->
      <g class="${styles.sacredSpin}" style="--dur:16s;--dir:reverse">
        <circle cx="200" cy="58" r="44" fill="none" stroke="#fab005" stroke-width="1.8" stroke-dasharray="14 10" stroke-opacity=".85"/>
      </g>
      <!-- Inner rotating sacred ring -->
      <g class="${styles.sacredSpin}" style="--dur:12s;--dir:normal">
        <circle cx="200" cy="58" r="32" fill="none" stroke="#ffd43b" stroke-width="2" stroke-dasharray="8 6"/>
        <circle cx="200" cy="58" r="22" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-opacity=".9"/>
      </g>
      <circle cx="200" cy="58" r="6" fill="#fff9db" stroke="#ffd43b" stroke-width="1.5"/>
    </g>
  `;

  // Distinct drifting golden feathers swaying down across the card
  const featherPath = 'M0,-16 C6,-12 8,2 0,16 C-8,2 -6,-12 0,-16 M0,-14 L0,14';
  const feathers = [
    { x: 110, y: 70, dur: 4.0, d: 0 },
    { x: 280, y: 90, dur: 4.6, d: 1.2 },
    { x: 170, y: 110, dur: 3.8, d: 2.2 },
    { x: 230, y: 130, dur: 4.4, d: 3.1 },
  ].map((fth) => `
    <g class="${styles.feather}" style="--dur:${f(fth.dur)}s;--d:${f(fth.d)}s">
      <g transform="translate(${fth.x}, ${fth.y}) scale(1.2)">
        <path d="${featherPath}" fill="rgba(255,212,59,.3)" stroke="#ffd43b" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="${featherPath}" fill="none" stroke="#ffffff" stroke-width="0.8"/>
      </g>
    </g>
  `).join('');

  const cm = border ? comet(d, 0, false, '#f59f00', '#ffd43b', '#ffe066', '#ffffff') + comet(d, 50, false, '#fab005', '#ffe066', '#fff3bf', '#ffffff') : '';
  return cm + godRays + halo + feathers;
}

// 4. SOVEREIGN: Floating imperial crown with diamond star-bursts + Expanding royal decree mandalas
function sovereignFront(level, border) {
  const d = path(OUTLINES.sovereign ?? APEX_PTS);
  if (level !== 2) return border ? comet(d, 0, true, '#f59f00', '#ffd43b', '#d8b34c', '#fff9db') : '';

  // Effect 1: Floating Imperial Crown with Scintillating Gem Glints
  const crown = `
    <g class="${styles.crownFloat}">
      <!-- Royal Crown arches and velvet cap -->
      <path d="M148,22 L160,-14 L178,2 L200,-28 L222,2 L240,-14 L252,22 Z" fill="rgba(142,40,0,.22)" stroke="#ffd43b" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M152,18 C165,-6 235,-6 248,18 Z" fill="rgba(100,10,120,.35)"/>
      <rect x="146" y="16" width="108" height="8" rx="2.5" fill="#d8b34c" stroke="#ffd43b" stroke-width="1.2"/>
      <!-- Imperial Crown Jewels -->
      <circle cx="200" cy="-28" r="5" fill="#ff1f4b" stroke="#fff3bf" stroke-width="1.6"/>
      <circle cx="160" cy="-14" r="3.6" fill="#339af0" stroke="#fff3bf" stroke-width="1.2"/>
      <circle cx="240" cy="-14" r="3.6" fill="#339af0" stroke="#fff3bf" stroke-width="1.2"/>
      <circle cx="178" cy="2" r="3.2" fill="#51cf66" stroke="#fff3bf" stroke-width="1"/>
      <circle cx="222" cy="2" r="3.2" fill="#51cf66" stroke="#fff3bf" stroke-width="1"/>
      <circle cx="200" cy="20" r="3" fill="#ff1f4b"/>
      <circle cx="174" cy="20" r="2.4" fill="#339af0"/>
      <circle cx="226" cy="20" r="2.4" fill="#339af0"/>
    </g>
  `;

  // 4-pointed radiant diamond star sparkle helper
  const starGlint = (cx, cy, scale, dur, delay) => `
    <g class="${styles.gemGlint}" style="--gx:${cx}px;--gy:${cy}px;--dur:${dur}s;--d:${delay}s">
      <path d="M${cx},${cy - 12 * scale} Q${cx},${cy} ${cx + 12 * scale},${cy} Q${cx},${cy} ${cx},${cy + 12 * scale} Q${cx},${cy} ${cx - 12 * scale},${cy} Z" fill="#ffffff" stroke="#ffd43b" stroke-width="0.8"/>
      <circle cx="${cx}" cy="${cy}" r="${2 * scale}" fill="#ffffff"/>
    </g>
  `;
  const glints = [
    starGlint(200, 2, 1.2, 2.0, 0),
    starGlint(160, 16, 0.9, 2.4, 0.6),
    starGlint(240, 16, 0.9, 2.4, 1.2),
    starGlint(36, 120, 1.0, 2.2, 0.3),
    starGlint(364, 120, 1.0, 2.2, 1.5),
    starGlint(200, 290, 1.3, 2.6, 0.9),
  ].join('');

  // Effect 2: Royal Decree Mandalas & Golden Heraldic Shockwaves
  const decreeSeal = [0, 1].map(i => `
    <g class="${styles.decreePulse}" style="--d:${f(i * 1.7)}s;--dur:3.4s">
      <circle cx="200" cy="290" r="130" fill="none" stroke="#d8b34c" stroke-width="2.5" stroke-dasharray="16 12" stroke-opacity=".75"/>
      <circle cx="200" cy="290" r="105" fill="none" stroke="#ffd43b" stroke-width="1.8" stroke-dasharray="8 8" stroke-opacity=".85"/>
      <polygon points="200,165 212,190 238,190 216,204 224,228 200,214 176,228 184,204 162,190 188,190" fill="none" stroke="#ffd43b" stroke-width="1.5" stroke-opacity=".8"/>
    </g>
  `).join('');

  const cm = border ? comet(d, 0, false, '#d8b34c', '#fcc419', '#ffe066', '#ffffff') + comet(d, 50, false, '#fab005', '#d8b34c', '#fff3bf', '#ffffff') : '';
  return cm + decreeSeal + crown + glints;
}

// ── COMMON FRONT EFFECTS ─────────────────────────────────────────────────────

function hyperdriveFront(level) {
  if (level !== 2) return '';
  return `
    <g>
      <line class="${styles.speedDash}" style="--d:0s;--dur:1.2s" x1="-60" y1="120" x2="460" y2="120" stroke="#51cf66" stroke-width="2.8" stroke-linecap="round"/>
      <line class="${styles.speedDash}" style="--d:.4s;--dur:1s" x1="-50" y1="210" x2="450" y2="210" stroke="#69db7c" stroke-width="3.2" stroke-linecap="round"/>
      <line class="${styles.speedDash}" style="--d:.2s;--dur:1.4s" x1="-70" y1="330" x2="470" y2="330" stroke="#51cf66" stroke-width="2.5" stroke-linecap="round"/>
      <line class="${styles.speedDash}" style="--d:.7s;--dur:1.1s" x1="-60" y1="450" x2="460" y2="450" stroke="#8ce99a" stroke-width="2.8" stroke-linecap="round"/>
    </g>
  `;
}

function phantomFront(level) {
  if (level !== 2) return '';
  return `
    <g style="opacity:.75">
      <path d="M-30,520 Q50,480 140,510 T300,500 T430,520 L430,585 L-30,585 Z" fill="rgba(177,151,252,.22)"/>
      <path d="M-20,490 Q60,460 160,490 T320,480 T420,500" fill="none" stroke="#b197fc" stroke-width="2.2" stroke-opacity=".7"/>
      <path d="M0,460 Q80,430 180,460 T340,450 T440,470" fill="none" stroke="#9775fa" stroke-width="1.6" stroke-opacity=".5"/>
    </g>
  `;
}

function bastionFront(level) {
  if (level !== 2) return '';
  return `
    <g stroke="#ced4da" stroke-width="2.4" fill="none">
      <path d="M6,72 L6,42 L36,42"/>
      <circle cx="15" cy="51" r="2.8" fill="#ced4da"/>
      <path d="M394,72 L394,42 L364,42"/>
      <circle cx="385" cy="51" r="2.8" fill="#ced4da"/>
      <path d="M6,508 L6,538 L36,538"/>
      <circle cx="15" cy="529" r="2.8" fill="#ced4da"/>
      <path d="M394,508 L394,538 L364,538"/>
      <circle cx="385" cy="529" r="2.8" fill="#ced4da"/>
    </g>
  `;
}

// ── Embers Pool ──────────────────────────────────────────────────────────────

const EMBERS_POOL = (() => {
  const r = rng(11);
  return Array.from({ length: 20 }, () => ({ left: 18 + r() * 64, d: r() * -6, dur: 3.5 + r() * 3, dx: (r() - .5) * 60, h: -160 - r() * 160, s: 3 + r() * 4 }));
})();

const THEME_MAP = {
  solstice: 'solar',
  solar: 'solar',
  void_walker: 'abyss',
  abyss: 'abyss',
  chronos: 'chrono',
  chrono: 'chrono',
  tempest: 'storm',
  storm: 'storm',
  bastion: 'iron',
  iron: 'iron',
  phantom_drift: 'phantom',
  phantom: 'phantom',
  hyperdrive: 'neon',
  neon: 'neon',
  apex_predator: 'apex',
  apex: 'apex',
  singularity: 'singularity',
  valkyrie: 'valkyrie',
  sovereign: 'sovereign',
  amethyst: 'amethyst',
  cyber: 'cyber',
  glacier: 'glacier',
  ember: 'ember',
};

function getEmbers(themeKey, level) {
  const count = level === 2 ? 20 : 8;
  const list = EMBERS_POOL.slice(0, count);
  let color = null;
  let red = false;
  if (themeKey === 'apex') red = true;
  else if (themeKey === 'singularity') color = 'cyan';
  else if (themeKey === 'valkyrie' || themeKey === 'sovereign' || themeKey === 'chrono' || themeKey === 'solar') color = 'gold';
  else if (themeKey === 'neon') color = 'green';
  else if (themeKey === 'phantom' || themeKey === 'abyss') color = 'violet';
  else if (themeKey === 'storm') color = 'blue';
  return list.map(e => ({ ...e, color, red }));
}

function restrike(event) {
  const i = event.target.dataset?.bolt;
  if (i == null) return;
  const set = event.target.dataset?.set;
  const arr = set === 'tempest' ? BOLTS_TEMPEST : BOLTS;
  event.target.querySelectorAll('polyline').forEach(line => line.setAttribute('points', boltPts(arr[+i])));
}

// ── EvoFx Main Component ─────────────────────────────────────────────────────

export default function EvoFx({ theme, level, layer, border = true }) {
  const key = THEME_MAP[theme] ?? theme;
  const t = EVO_ART[key];
  if (!t) return null;
  let svg = '';

  // Back layer effects (extend out of border)
  if (layer === 'back' && level === 2) {
    if (key === 'amethyst') svg = clutch(t);
    else if (key === 'cyber') svg = hive(t);
    else if (key === 'solar') svg = solsticeBack(t);
    else if (key === 'abyss') svg = voidBack(t);
    else if (key === 'chrono') svg = chronosBack(t);
    else if (key === 'storm') svg = tempestBack(t);
    else if (key === 'singularity') svg = singularityBack(t);
    else if (key === 'valkyrie') svg = valkyrieBack();
    else if (key === 'sovereign') svg = sovereignBack(t);
  }

  // Front layer effects (card faces, slashes, lightning, crowns)
  if (layer === 'front') {
    if (key === 'apex') svg = apexPredatorFront(level, border);
    else if (key === 'singularity') svg = singularityFront(level, border);
    else if (key === 'valkyrie') svg = valkyrieFront(level, border);
    else if (key === 'sovereign') svg = sovereignFront(level, border);
    else if (key === 'neon') svg = hyperdriveFront(level);
    else if (key === 'phantom') svg = phantomFront(level);
    else if (key === 'iron') svg = bastionFront(level);
  }

  const embers = (layer === 'front' && (t.tier === 'apex' || (t.tier === 'rare' && level === 2))) ? getEmbers(key, level) : [];
  if (!svg && !embers.length) return null;

  return (
    <div className={styles.fx} data-layer={layer} aria-hidden="true" onAnimationIteration={restrike}>
      {svg && <svg viewBox={VB} dangerouslySetInnerHTML={{ __html: svg }} />}
      {embers.length > 0 && (
        <div className={styles.embers}>
          {embers.map((e, i) => (
            <i
              key={i}
              className={styles.ember}
              data-red={e.red || undefined}
              data-color={e.color || undefined}
              style={{
                left: `${e.left}%`,
                '--d': `${e.d}s`,
                '--dur': `${e.dur}s`,
                '--dx': `${e.dx}px`,
                '--h': `${e.h}px`,
                '--s': `${e.s}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
