// Evo card faces. An evolved card drops its tier metal and wears its evo's own
// art: background motif, dark floor and a frame that grows more intricate at
// Evo II. Everything is drawn in the 400x580 card space as SVG strings, cached
// per theme and level, so PlayerCard only pastes them into its planes.
//
// Apex Evo II has its own custom 3D outlines. tools/evo3d/build_apex.py builds
// the 3D version from the exact same numbers, so keep the two in step.

export const SIL_PTS = [[0, 40], [200, 0], [400, 40], [400, 540], [200, 580], [0, 540]];

const APEX_R = [[200, 0], [213, 15], [238, 7], [247, 23], [370, 34], [390, 22], [400, 46], [392, 62], [400, 76], [400, 398], [391, 410], [400, 422], [400, 524], [384, 546], [226, 567], [200, 580]];
export const APEX_PTS = [...APEX_R, ...APEX_R.slice(1, -1).reverse().map(([x, y]) => [400 - x, y])];

const VALKYRIE_R = [[200, 0], [218, 14], [236, 6], [252, 20], [360, 26], [392, 14], [400, 38], [393, 56], [400, 74], [393, 230], [400, 246], [400, 396], [391, 412], [400, 426], [400, 520], [386, 544], [228, 566], [200, 580]];
export const VALKYRIE_PTS = [...VALKYRIE_R, ...VALKYRIE_R.slice(1, -1).reverse().map(([x, y]) => [400 - x, y])];

const SOVEREIGN_R = [[200, 0], [216, 18], [240, 8], [262, 22], [296, 10], [324, 24], [374, 18], [400, 36], [392, 66], [400, 82], [400, 275], [390, 292], [400, 308], [400, 400], [391, 414], [400, 428], [400, 522], [384, 542], [232, 565], [200, 580]];
export const SOVEREIGN_PTS = [...SOVEREIGN_R, ...SOVEREIGN_R.slice(1, -1).reverse().map(([x, y]) => [400 - x, y])];

const SINGULARITY_R = [[200, 0], [222, 22], [246, 12], [270, 26], [368, 30], [396, 16], [400, 42], [390, 70], [400, 88], [400, 260], [388, 282], [400, 304], [400, 398], [390, 412], [400, 426], [400, 526], [386, 548], [224, 568], [200, 580]];
export const SINGULARITY_PTS = [...SINGULARITY_R, ...SINGULARITY_R.slice(1, -1).reverse().map(([x, y]) => [400 - x, y])];

export const FLOOR_PTS = [[0, 410], [400, 410], [400, 540], [200, 580], [0, 540]];
export const APEX_FLOOR_PTS = [[12, 410], [388, 410], [388, 530.2], [200, 567.8], [12, 530.2]];
export const VALKYRIE_FLOOR_PTS = [[14, 410], [386, 410], [386, 528], [200, 566], [14, 528]];
export const SOVEREIGN_FLOOR_PTS = [[12, 410], [388, 410], [388, 526], [200, 568], [12, 526]];
export const SINGULARITY_FLOOR_PTS = [[12, 410], [388, 410], [388, 530], [200, 568], [12, 530]];

export const GEMS = [[392.5, 240], [7.5, 240], [392.5, 480], [7.5, 480]];
export const VALKYRIE_GEMS = [[392.5, 230], [7.5, 230], [392.5, 470], [7.5, 470]];
export const SOVEREIGN_GEMS = [[392.5, 292], [7.5, 292], [392.5, 480], [7.5, 480]];
export const SINGULARITY_GEMS = [[392.5, 282], [7.5, 282], [392.5, 485], [7.5, 485]];

export const OUTLINES = { apex: APEX_PTS, valkyrie: VALKYRIE_PTS, sovereign: SOVEREIGN_PTS, singularity: SINGULARITY_PTS };
const FLOORS = { apex: APEX_FLOOR_PTS, valkyrie: VALKYRIE_FLOOR_PTS, sovereign: SOVEREIGN_FLOOR_PTS, singularity: SINGULARITY_FLOOR_PTS };
const THEME_GEMS = { apex: GEMS, valkyrie: VALKYRIE_GEMS, sovereign: SOVEREIGN_GEMS, singularity: SINGULARITY_GEMS };

const pts = list => list.map(p => p.join(',')).join(' ');
const f = n => n.toFixed(1);

/** The tier silhouette pulled in by d px. */
export function insetPts(d) {
  return [[d, 40 + d * .82], [200, d * 1.02], [400 - d, 40 + d * .82], [400 - d, 540 - d * .82], [200, 580 - d * 1.02], [d, 540 - d * .82]];
}
const inset = d => pts(insetPts(d));

function rng(seed) {
  let a = 0;
  for (const c of seed) a = Math.imul(a ^ c.charCodeAt(0), 2654435761);
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export const EVO_ART = {
  // Existing Common
  glacier: { tier: 'common', bg: ['#1d4f7a', '#081a2e'], floor: '#040e1a', line: '#a9dcff', metal: ['#9cc3e0', '#f0f8ff'], ink: '#f2f8ff' },
  ember: { tier: 'common', bg: ['#4f1610', '#1a0706'], floor: '#120403', line: '#ff8a6b', metal: ['#e8927a', '#ffd9c2'], ink: '#fff2ec' },
  // New Common (3)
  iron: { tier: 'common', bg: ['#2b333a', '#101418'], floor: '#0b0e11', line: '#f59e0b', metal: ['#94a3b8', '#f1f5f9'], ink: '#f8fafc' },
  phantom: { tier: 'common', bg: ['#0f3b39', '#051919'], floor: '#020f0f', line: '#2dd4bf', metal: ['#5eead4', '#ccfbf1'], ink: '#f0fdfa' },
  neon: { tier: 'common', bg: ['#273d09', '#0e1703'], floor: '#070d01', line: '#84cc16', metal: ['#a3e635', '#ecfccb'], ink: '#f7fee7' },

  // Existing Rare
  amethyst: { tier: 'rare', bg: ['#3a1d66', '#130a22'], floor: '#0c0616', line: '#c79bff', metal: ['#c9a8f5', '#f3e8ff'], ink: '#f6f0ff' },
  cyber: { tier: 'rare', bg: ['#063a48', '#020d12'], floor: '#01080c', line: '#22d3ee', metal: ['#45c7dd', '#ccfbff'], ink: '#ecfeff' },
  // New Rare (4)
  solar: { tier: 'rare', bg: ['#542a0c', '#1f0d03'], floor: '#140802', line: '#fb923c', metal: ['#f97316', '#ffedd5'], ink: '#fff7ed' },
  abyss: { tier: 'rare', bg: ['#3b185f', '#120524'], floor: '#0c0318', line: '#a855f7', metal: ['#c084fc', '#f3e8ff'], ink: '#faf5ff' },
  chrono: { tier: 'rare', bg: ['#423213', '#171105'], floor: '#0f0b02', line: '#eab308', metal: ['#ca8a04', '#fef08a'], ink: '#fefce8' },
  storm: { tier: 'rare', bg: ['#132b4f', '#061124'], floor: '#030914', line: '#38bdf8', metal: ['#60a5fa', '#dbeafe'], ink: '#eff6ff' },

  // Existing Apex
  apex: { tier: 'apex', bg: ['#470a16', '#140306'], floor: '#0d0204', line: '#ff1f4b', metal: ['#c9963e', '#ffe9a8'], ink: '#fff4e0' },
  // New Apex (3)
  valkyrie: { tier: 'apex', bg: ['#4a1d2e', '#1c0810'], floor: '#12040a', line: '#fb7185', metal: ['#f43f5e', '#ffe4e6'], ink: '#fff1f2' },
  sovereign: { tier: 'apex', bg: ['#3a0d45', '#14031a'], floor: '#0d0212', line: '#d946ef', metal: ['#e879f9', '#fae8ff'], ink: '#fdf4ff' },
  singularity: { tier: 'apex', bg: ['#071a2c', '#020912'], floor: '#01050a', line: '#06b6d4', metal: ['#22d3ee', '#cffafe'], ink: '#ecfeff' },
};

export const evoArt = theme => EVO_ART[theme] ?? null;
export const isApexII = (theme, level) => EVO_ART[theme]?.tier === 'apex' && level === 2;
export const outlinePts = (theme, level) => isApexII(theme, level) ? (OUTLINES[theme] ?? APEX_PTS) : SIL_PTS;
export const floorPts = (theme, level) => isApexII(theme, level) ? (FLOORS[theme] ?? APEX_FLOOR_PTS) : FLOOR_PTS;

// ── motifs, drawn behind the portrait ───────────────────────────────────────

function glacier(lv, r, t) {
  let s = '';
  const R = lv === 1 ? 24 : 18, h = Math.sqrt(3) * R, top = lv === 1 ? 170 : 20;
  for (let cx = 0, col = 0; cx < 420; cx += 1.5 * R, col++) {
    for (let cy = top + (col % 2 ? h / 2 : 0); cy < 430; cy += h) {
      const k = Math.min(1, Math.max(0, (cy - top) / (420 - top)));
      const op = lv === 1 ? Math.pow(k, 1.4) * .5 : .14 + k * .4;
      const p = [0, 1, 2, 3, 4, 5].map(i => { const a = Math.PI / 3 * i; return `${f(cx + R * Math.cos(a))},${f(cy + R * Math.sin(a))}`; }).join(' ');
      const fill = lv === 2 && r() < .32 ? `fill="${t.line}" fill-opacity="${f(r() * .22 * k + .03)}"` : 'fill="none"';
      s += `<polygon points="${p}" ${fill} stroke="${t.line}" stroke-opacity="${op.toFixed(2)}" stroke-width="1"/>`;
    }
  }
  const shards = lv === 1
    ? [[52, 18, 150], [345, 16, 190], [372, 12, 120]]
    : [[28, 24, 240], [70, 20, 300], [108, 16, 180], [150, 14, 110], [252, 14, 130], [292, 18, 200], [332, 22, 320], [372, 20, 250], [396, 14, 160]];
  for (const [x, w, hh] of shards) {
    const ax = x + (r() - .5) * w, ay = 410 - hh, mx = x + (r() - .3) * w * .5;
    if (lv === 1) { s += `<polygon points="${x - w},410 ${f(ax)},${ay} ${x + w},410" fill="none" stroke="${t.metal[1]}" stroke-opacity=".55" stroke-width="1.2"/>`; continue; }
    s += `<polygon points="${x - w},410 ${f(ax)},${ay} ${f(mx)},410" fill="${t.metal[1]}" fill-opacity=".30"/>`;
    s += `<polygon points="${f(mx)},410 ${f(ax)},${ay} ${x + w},410" fill="${t.bg[0]}" fill-opacity=".75"/>`;
    s += `<polygon points="${x - w},410 ${f(ax)},${ay} ${x + w},410" fill="none" stroke="${t.metal[1]}" stroke-opacity=".85" stroke-width="1.2"/>`;
    s += `<line x1="${f(ax)}" y1="${ay}" x2="${f(mx)}" y2="410" stroke="${t.metal[1]}" stroke-opacity=".5" stroke-width=".8"/>`;
  }
  return s;
}

function ember(lv, r, t) {
  let s = '';
  if (lv === 1) {
    for (let i = 0; i < 7; i++) {
      const x0 = 420 - r() * 60, y0 = 40 + i * 42 + r() * 20, len = 150 + r() * 140, a = Math.PI * .81;
      const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len;
      s += `<line x1="${f(x0)}" y1="${f(y0)}" x2="${f(x1)}" y2="${f(y1)}" stroke="${t.line}" stroke-opacity="${f(.25 + r() * .35)}" stroke-width="${f(1 + r())}"/>`;
      s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x1 + (x0 - x1) * .12)}" y2="${f(y1 + (y0 - y1) * .12)}" stroke="${t.metal[1]}" stroke-width="2.2"/>`;
    }
    return s;
  }
  const F = [292, 148];
  for (let i = 0; i < 34; i++) {
    const a = r() * Math.PI * 2, r0 = 22 + r() * 40, r1 = 260 + r() * 260;
    const x0 = F[0] + Math.cos(a) * r0, y0 = F[1] + Math.sin(a) * r0, x1 = F[0] + Math.cos(a) * r1, y1 = F[1] + Math.sin(a) * r1;
    s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x0)}" y2="${f(y0)}" stroke="${t.line}" stroke-opacity="${f(.18 + r() * .5)}" stroke-width="${f(.8 + r() * 2)}"/>`;
    s += `<line x1="${f(x0)}" y1="${f(y0)}" x2="${f(x0 + Math.cos(a) * 26)}" y2="${f(y0 + Math.sin(a) * 26)}" stroke="${t.metal[1]}" stroke-opacity=".9" stroke-width="1.6"/>`;
  }
  let star = '';
  for (let i = 0; i < 32; i++) { const a = Math.PI * 2 * i / 32, rr = i % 2 ? 9 : 20 + (i % 4 ? 0 : 16); star += `${f(F[0] + Math.cos(a) * rr)},${f(F[1] + Math.sin(a) * rr)} `; }
  s += `<polygon points="${star}" fill="${t.metal[1]}"/><circle cx="${F[0]}" cy="${F[1]}" r="6" fill="#fff8f0"/>`;
  return s;
}

function iron(lv, r, t) {
  let s = '';
  const step = lv === 1 ? 40 : 28;
  for (let y = 60; y < 400; y += step) {
    const op = lv === 1 ? 0.35 : 0.65;
    s += `<line x1="20" y1="${y}" x2="380" y2="${y}" stroke="${t.line}" stroke-opacity="${op}" stroke-width="1.2"/>`;
    for (let x = 30; x <= 370; x += 34) {
      s += `<circle cx="${x}" cy="${y}" r="2" fill="${t.metal[0]}" stroke="${t.bg[1]}" stroke-width="0.8"/>`;
    }
  }
  for (let i = 0; i < (lv === 1 ? 6 : 14); i++) {
    const x = 40 + r() * 320, y = 80 + r() * 300, w = 18 + r() * 24;
    s += `<polygon points="${f(x)},${f(y)} ${f(x + w)},${f(y)} ${f(x + w - 8)},${f(y + 12)} ${f(x - 8)},${f(y + 12)}" fill="${t.metal[1]}" fill-opacity="${lv === 1 ? 0.2 : 0.4}"/>`;
  }
  return s;
}

function phantom(lv, r, t) {
  let s = '';
  const waves = lv === 1 ? 6 : 12;
  for (let i = 0; i < waves; i++) {
    const y0 = 60 + i * (340 / waves);
    const amp = 14 + r() * 18;
    s += `<path d="M 20 ${f(y0)} Q 100 ${f(y0 - amp)} 200 ${f(y0)} T 380 ${f(y0)}" fill="none" stroke="${t.line}" stroke-opacity="${lv === 1 ? 0.3 : 0.5}" stroke-width="${lv === 1 ? 1.2 : 1.8}"/>`;
  }
  for (let i = 0; i < (lv === 1 ? 16 : 32); i++) {
    const x = 30 + r() * 340, y = 60 + r() * 340, rad = 1.2 + r() * 2.5;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="${t.metal[1]}" fill-opacity="${f(0.25 + r() * 0.4)}"/>`;
  }
  return s;
}

function neon(lv, r, t) {
  let s = '';
  const bars = lv === 1 ? 9 : 18;
  for (let i = 0; i < bars; i++) {
    const x = 24 + i * (352 / bars);
    const h = 40 + r() * 220;
    s += `<line x1="${f(x)}" y1="${f(400 - h)}" x2="${f(x)}" y2="400" stroke="${t.line}" stroke-opacity="${f(0.3 + r() * 0.4)}" stroke-width="${lv === 1 ? 2 : 3}" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < (lv === 1 ? 4 : 8); i++) {
    const y = 80 + i * 42, dir = i % 2 ? 1 : -1;
    s += `<path d="M ${dir === 1 ? 30 : 370} ${y} l ${dir * 30} -14 l 0 28 z" fill="${t.metal[1]}" fill-opacity="${lv === 1 ? 0.3 : 0.6}"/>`;
  }
  return s;
}

export function segRing(cx, cy, rad, n, lit, w, on, off, offOp = .18) {
  const step = Math.PI * 2 / n, gap = step * .28;
  let s = '';
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI / 2 + i * step + gap / 2, a1 = a0 + step - gap;
    const lit1 = i < lit;
    s += `<path d="M${f(cx + rad * Math.cos(a0))},${f(cy + rad * Math.sin(a0))} A${rad},${rad} 0 0 1 ${f(cx + rad * Math.cos(a1))},${f(cy + rad * Math.sin(a1))}" fill="none" stroke="${lit1 ? on : off}" stroke-opacity="${lit1 ? .9 : offOp}" stroke-width="${w}"/>`;
  }
  return s;
}

function amethyst(lv, r, t) {
  if (lv === 1) return segRing(200, 196, 160, 45, 12, 6, t.metal[1], t.line) + `<circle cx="200" cy="196" r="174" fill="none" stroke="${t.line}" stroke-opacity=".3"/>`;
  let s = `<polygon points="200,82 262,196 200,310 138,196" fill="${t.line}" fill-opacity=".12" stroke="${t.metal[1]}" stroke-opacity=".6" stroke-width="1.2"/>`;
  s += `<polygon points="200,118 238,196 200,274 162,196" fill="none" stroke="${t.metal[1]}" stroke-opacity=".4"/>`;
  for (let i = 0; i < 90; i++) {
    const a = Math.PI * 2 * i / 90, r1 = i % 5 ? 228 : 262;
    s += `<line x1="${f(200 + Math.cos(a) * 206)}" y1="${f(196 + Math.sin(a) * 206)}" x2="${f(200 + Math.cos(a) * r1)}" y2="${f(196 + Math.sin(a) * r1)}" stroke="${t.metal[0]}" stroke-opacity="${i % 5 ? .3 : .7}"/>`;
  }
  return s + segRing(200, 196, 120, 30, 30, 4, t.metal[1], t.line) + segRing(200, 196, 160, 45, 45, 7, t.metal[1], t.line) + segRing(200, 196, 196, 60, 60, 3, t.metal[1], t.line);
}

function cyber(lv, r, t) {
  let s = '';
  const main = [[200, 64], [342, 132], [352, 318], [48, 318], [58, 132]];
  const node = ([x, y], big) => `<circle cx="${f(x)}" cy="${f(y)}" r="${big ? 11 : 6}" fill="none" stroke="${t.line}" stroke-opacity="${big ? .7 : .4}"/><circle cx="${f(x)}" cy="${f(y)}" r="${big ? 4.5 : 2.2}" fill="${big ? t.metal[1] : t.line}"/>`;
  const line = (a, b, op, w = 1) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${t.line}" stroke-opacity="${op}" stroke-width="${w}"/>`;
  if (lv === 1) {
    main.forEach((p, i) => { s += line(p, main[(i + 1) % 5], .55, 1.3); });
    main.forEach(p => { s += node(p, true); });
    return s;
  }
  const all = [...main];
  for (let i = 0; i < 36; i++) all.push([16 + r() * 368, 30 + r() * 380]);
  all.forEach((p, i) => {
    const near = all.map((q, j) => [j, (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 3);
    near.forEach(([j]) => { if (j > i) s += line(p, all[j], .28); });
  });
  main.forEach((p, i) => { s += line(p, main[(i + 1) % 5], .85, 1.8); main.forEach((q, j) => { if (j > i + 1 && !(i === 0 && j === 4)) s += line(p, q, .35, 1); }); });
  for (let i = 0; i < 10; i++) {
    const left = i % 2 === 0, y = 70 + r() * 320, x0 = left ? 14 : 386, dir = left ? 1 : -1;
    const h1 = 20 + r() * 50, d = 14 + r() * 26, h2 = 10 + r() * 40, up = r() < .5 ? -1 : 1;
    const x1 = x0 + dir * h1, x2 = x1 + dir * d, y2 = y + up * d, x3 = x2 + dir * h2;
    s += `<polyline points="${x0},${f(y)} ${f(x1)},${f(y)} ${f(x2)},${f(y2)} ${f(x3)},${f(y2)}" fill="none" stroke="${t.metal[1]}" stroke-opacity=".75" stroke-width="1.4"/><circle cx="${f(x3)}" cy="${f(y2)}" r="3.4" fill="none" stroke="${t.metal[1]}" stroke-width="1.4"/>`;
  }
  all.slice(5).forEach(p => { s += node(p, false); });
  main.forEach(p => { s += node(p, true); });
  return s;
}

function solar(lv, r, t) {
  let s = '';
  const rays = lv === 1 ? 16 : 32;
  const cx = 200, cy = 200;
  for (let i = 0; i < rays; i++) {
    const a = (Math.PI * 2 * i) / rays;
    const r0 = 40 + (i % 2 ? 10 : 0);
    const r1 = lv === 1 ? 130 + r() * 40 : 170 + r() * 80;
    s += `<line x1="${f(cx + Math.cos(a) * r0)}" y1="${f(cy + Math.sin(a) * r0)}" x2="${f(cx + Math.cos(a) * r1)}" y2="${f(cy + Math.sin(a) * r1)}" stroke="${t.line}" stroke-opacity="${f(0.25 + r() * 0.45)}" stroke-width="${i % 2 ? 1.5 : 2.5}"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${lv === 1 ? 32 : 46}" fill="none" stroke="${t.metal[1]}" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="18" fill="${t.metal[0]}"/>`;
  return s;
}

function abyss(lv, r, t) {
  let s = '';
  const rings = lv === 1 ? 5 : 9;
  const cx = 200, cy = 210;
  for (let i = 1; i <= rings; i++) {
    const rx = i * 22, ry = i * 16;
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${t.line}" stroke-opacity="${f(0.2 + (i / rings) * 0.4)}" stroke-width="1.4" stroke-dasharray="${i * 4} 4"/>`;
  }
  for (let i = 0; i < (lv === 1 ? 12 : 24); i++) {
    const a = r() * Math.PI * 2, rad = 30 + r() * 150;
    s += `<circle cx="${f(cx + Math.cos(a) * rad)}" cy="${f(cy + Math.sin(a) * (rad * 0.7))}" r="2" fill="${t.metal[1]}" fill-opacity="${f(0.3 + r() * 0.5)}"/>`;
  }
  return s;
}

function chrono(lv, r, t) {
  let s = '';
  const cx = 200, cy = 200;
  const teethCount = lv === 1 ? 24 : 40;
  for (let i = 0; i < teethCount; i++) {
    const a = (Math.PI * 2 * i) / teethCount;
    const r0 = 120, r1 = 138;
    s += `<line x1="${f(cx + Math.cos(a) * r0)}" y1="${f(cy + Math.sin(a) * r0)}" x2="${f(cx + Math.cos(a) * r1)}" y2="${f(cy + Math.sin(a) * r1)}" stroke="${t.metal[1]}" stroke-width="${lv === 1 ? 2 : 3}" stroke-opacity="0.8"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="120" fill="none" stroke="${t.line}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="80" fill="none" stroke="${t.metal[0]}" stroke-width="1.5"/>`;
  if (lv === 2) {
    for (let h = 0; h < 12; h++) {
      const a = (Math.PI * 2 * h) / 12 - Math.PI / 2;
      s += `<line x1="${f(cx + Math.cos(a) * 65)}" y1="${f(cy + Math.sin(a) * 65)}" x2="${f(cx + Math.cos(a) * 78)}" y2="${f(cy + Math.sin(a) * 78)}" stroke="${t.metal[1]}" stroke-width="2.5"/>`;
    }
  }
  return s;
}

function storm(lv, r, t) {
  let s = '';
  const forks = lv === 1 ? 4 : 8;
  for (let i = 0; i < forks; i++) {
    let x = 40 + i * (320 / forks), y = 40;
    let d = `M ${f(x)} ${y}`;
    while (y < 400) {
      x += (r() - 0.5) * 36;
      y += 20 + r() * 30;
      d += ` L ${f(x)} ${f(y)}`;
    }
    s += `<path d="${d}" fill="none" stroke="${t.line}" stroke-opacity="${f(0.4 + r() * 0.4)}" stroke-width="${lv === 1 ? 1.5 : 2.5}"/>`;
    s += `<path d="${d}" fill="none" stroke="${t.metal[1]}" stroke-opacity="0.9" stroke-width="0.8"/>`;
  }
  return s;
}

// Claw rakes: crescent slivers, top right to bottom left.
export function rake(i) {
  const o = i * 40;
  const S = [352 - o * .2, 34 + o], E = [64 + o * .25, 318 + o * .9], C1 = [150 + o * .6, 70 + o], C2 = [182 + o * .6, 104 + o];
  const q = (a, c, b, tt) => [(1 - tt) ** 2 * a[0] + 2 * (1 - tt) * tt * c[0] + tt * tt * b[0], (1 - tt) ** 2 * a[1] + 2 * (1 - tt) * tt * c[1] + tt * tt * b[1]];
  return { S, E, C1, C2, d: `M${S} Q${C1} ${E} Q${C2} ${S} Z`, edge: tt => q(S, C1, E, tt), inner: tt => q(S, C2, E, tt) };
}

// Teeth along each rake's outer edge.
export function teeth() {
  const out = [];
  for (let i = 0; i < 3; i++) {
    const k = rake(i), n = 16;
    for (let j = 1; j < n; j++) {
      const tt = j / n, p = k.edge(tt), p2 = k.edge(tt + .02), m = k.inner(tt);
      let nx = p[0] - m[0], ny = p[1] - m[1]; const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
      const tx = p2[0] - p[0], ty = p2[1] - p[1], TL = Math.hypot(tx, ty) || 1;
      const len = (i === 0 && tt < .3 ? 30 : 12) + ((j * 37 + i * 11) % 23), half = 6;
      out.push({ b0: [p[0] - tx / TL * half, p[1] - ty / TL * half], b1: [p[0] + tx / TL * half, p[1] + ty / TL * half], tip: [p[0] + nx * len - tx / TL * 4, p[1] + ny * len - ty / TL * 4], p });
    }
  }
  return out;
}
const teethSvg = t => teeth().map(({ b0, b1, tip, p }) => `<polygon points="${b0.map(f)} ${tip.map(f)} ${p.map(f)}" fill="${t.metal[1]}"/><polygon points="${p.map(f)} ${tip.map(f)} ${b1.map(f)}" fill="${t.metal[0]}"/>`).join('');

function apex(lv, r, t) {
  let s = '';
  if (lv === 2) {
    for (let x = 22; x < 150; x += 11) for (let y = 60; y < 200; y += 11) if (x + y < 230) s += `<circle cx="${x}" cy="${y}" r="1.3" fill="${t.metal[0]}" fill-opacity=".35"/>`;
  }
  for (let i = 0; i < 3; i++) s += `<path d="${rake(i).d}" fill="${lv === 1 ? t.line : 'url(#evoGold)'}" fill-opacity="${lv === 1 ? .85 : 1}"/>`;
  if (lv === 2) s += teethSvg(t);
  return s;
}

function valkyrie(lv, r, t) {
  let s = '';
  // Feathered wing arcs across the card flanks
  for (let i = 0; i < (lv === 1 ? 3 : 6); i++) {
    const o = i * 28;
    const d1 = `M 380 ${60 + o} Q 280 ${130 + o} 120 ${310 + o * 0.5}`;
    const d2 = `M 20 ${60 + o} Q 120 ${130 + o} 280 ${310 + o * 0.5}`;
    s += `<path d="${d1}" fill="none" stroke="${t.line}" stroke-width="${lv === 1 ? 2 : 3.5}" stroke-opacity="${lv === 1 ? 0.4 : 0.7}" stroke-linecap="round"/>`;
    s += `<path d="${d2}" fill="none" stroke="${t.line}" stroke-width="${lv === 1 ? 2 : 3.5}" stroke-opacity="${lv === 1 ? 0.4 : 0.7}" stroke-linecap="round"/>`;
  }
  if (lv === 2) {
    for (let i = 0; i < 16; i++) {
      const x = 50 + r() * 300, y = 60 + r() * 260;
      s += `<polygon points="${f(x)},${f(y)} ${f(x + 12)},${f(y - 18)} ${f(x + 24)},${f(y)} ${f(x + 12)},${f(y + 8)}" fill="${t.metal[1]}" fill-opacity="0.35"/>`;
    }
  }
  return s;
}

function sovereign(lv, r, t) {
  let s = '';
  // Scepters and crown tines
  s += `<line x1="80" y1="360" x2="320" y2="100" stroke="${t.metal[1]}" stroke-width="${lv === 1 ? 3 : 5}" stroke-linecap="round" stroke-opacity="0.6"/>`;
  s += `<line x1="320" y1="360" x2="80" y2="100" stroke="${t.metal[1]}" stroke-width="${lv === 1 ? 3 : 5}" stroke-linecap="round" stroke-opacity="0.6"/>`;
  if (lv === 2) {
    const spk = [120, 160, 200, 240, 280];
    spk.forEach((x, i) => {
      const h = i === 2 ? 40 : i % 2 ? 30 : 20;
      s += `<polygon points="${x - 10},120 ${x},${120 - h} ${x + 10},120" fill="url(#evoGold)"/>`;
    });
    for (let i = 0; i < 20; i++) {
      const x = 40 + r() * 320, y = 80 + r() * 280;
      s += `<polygon points="${f(x)},${f(y - 6)} ${f(x + 4)},${f(y)} ${f(x)},${f(y + 6)} ${f(x - 4)},${f(y)}" fill="${t.metal[0]}" fill-opacity="0.4"/>`;
    }
  }
  return s;
}

function singularity(lv, r, t) {
  let s = '';
  const cx = 200, cy = 230;
  // Accretion spirals
  for (let i = 0; i < 4; i++) {
    const a0 = (Math.PI / 2) * i;
    let d = `M ${cx} ${cy}`;
    for (let step = 0; step < 24; step++) {
      const th = a0 + step * 0.22;
      const rad = step * 6.5;
      d += ` L ${f(cx + Math.cos(th) * rad)} ${f(cy + Math.sin(th) * rad)}`;
    }
    s += `<path d="${d}" fill="none" stroke="${t.line}" stroke-width="${lv === 1 ? 2 : 3.5}" stroke-opacity="${lv === 1 ? 0.45 : 0.8}"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${lv === 1 ? 16 : 24}" fill="${t.floor}" stroke="${t.metal[1]}" stroke-width="3"/>`;
  if (lv === 2) {
    for (let i = 0; i < 28; i++) {
      const a = r() * Math.PI * 2, rad = 30 + r() * 140;
      s += `<circle cx="${f(cx + Math.cos(a) * rad)}" cy="${f(cy + Math.sin(a) * rad)}" r="1.5" fill="${t.metal[1]}" fill-opacity="${f(0.4 + r() * 0.5)}"/>`;
    }
  }
  return s;
}

const MOTIF = {
  glacier, ember, iron, phantom, neon,
  amethyst, cyber, solar, abyss, chrono, storm,
  apex, valkyrie, sovereign, singularity,
};

// ── frame, drawn in front of the portrait ───────────────────────────────────

const GLYPH = {
  glacier: c => { const p = [0, 1, 2, 3, 4, 5].map(i => { const a = Math.PI / 3 * i + Math.PI / 6; return `${f(200 + 8 * Math.cos(a))},${f(24 + 8 * Math.sin(a))}`; }).join(' '); return `<polygon points="${p}" fill="none" stroke="${c}" stroke-width="1.6"/>`; },
  ember: c => `<polygon points="200,14 205,21 205,33 195,33 195,21" fill="none" stroke="${c}" stroke-width="1.6"/><line x1="195" y1="28" x2="205" y2="28" stroke="${c}" stroke-width="1.2"/>`,
  iron: c => `<polygon points="192,16 208,16 208,30 200,35 192,30" fill="none" stroke="${c}" stroke-width="1.6"/><circle cx="200" cy="23" r="2.2" fill="${c}"/>`,
  phantom: c => `<path d="M 194 30 C 192 20 196 15 200 15 C 204 15 208 20 206 30 Z" fill="none" stroke="${c}" stroke-width="1.6"/><circle cx="200" cy="22" r="1.8" fill="${c}"/>`,
  neon: c => `<polyline points="193,17 200,23 193,29" fill="none" stroke="${c}" stroke-width="1.6"/><polyline points="200,17 207,23 200,29" fill="none" stroke="${c}" stroke-width="1.6"/>`,
  amethyst: c => `<polygon points="200,14 208,24 200,34 192,24" fill="none" stroke="${c}" stroke-width="1.6"/><line x1="200" y1="18" x2="200" y2="30" stroke="${c}" stroke-width="1.2"/>`,
  cyber: c => `<polyline points="193,30 200,17 207,30 193,30" fill="none" stroke="${c}" stroke-width="1.2"/><circle cx="200" cy="17" r="2.6" fill="${c}"/><circle cx="193" cy="30" r="2.6" fill="${c}"/><circle cx="207" cy="30" r="2.6" fill="${c}"/>`,
  solar: c => `<circle cx="200" cy="24" r="5" fill="none" stroke="${c}" stroke-width="1.6"/><circle cx="200" cy="24" r="2" fill="${c}"/>`,
  abyss: c => `<ellipse cx="200" cy="24" rx="7" ry="4.5" fill="none" stroke="${c}" stroke-width="1.6"/><circle cx="200" cy="24" r="2" fill="${c}"/>`,
  chrono: c => `<circle cx="200" cy="24" r="6" fill="none" stroke="${c}" stroke-width="1.6"/><polyline points="200,21 200,24 203,24" stroke="${c}" stroke-width="1.2"/>`,
  storm: c => `<polyline points="198,15 194,24 204,22 198,33" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/>`,
  apex: c => `<polygon points="192,15 197,15 199,33" fill="${c}"/><polygon points="203,15 208,15 201,33" fill="${c}"/>`,
  valkyrie: c => `<polygon points="192,18 200,10 208,18 200,24" fill="none" stroke="${c}" stroke-width="1.6"/><polyline points="188,26 200,18 212,26" fill="none" stroke="${c}" stroke-width="1.2"/>`,
  sovereign: c => `<polygon points="192,26 195,18 200,21 205,18 208,26" fill="none" stroke="${c}" stroke-width="1.6"/><circle cx="200" cy="15" r="1.6" fill="${c}"/>`,
  singularity: c => `<circle cx="200" cy="24" r="6.5" fill="none" stroke="${c}" stroke-width="1.8"/><circle cx="200" cy="24" r="2" fill="${c}"/>`,
};

function frame(theme, t, lv) {
  if (lv === 1) return `<polygon points="${inset(9)}" fill="none" stroke="${t.metal[0]}" stroke-width="1.5"/>${GLYPH[theme](t.metal[1])}`;
  const crest = `<polygon points="178,24 200,-6 222,24 200,44" fill="${t.bg[1]}" stroke="${t.metal[1]}" stroke-width="2"/>${GLYPH[theme](t.metal[1])}`;
  const finial = `<polygon points="190,564 200,552 210,564 200,576" fill="${t.metal[1]}"/>`;

  if (t.tier === 'apex') {
    const ptsOutline = OUTLINES[theme] ?? APEX_PTS;
    const themeGemList = THEME_GEMS[theme] ?? GEMS;
    const gemColor = theme === 'sovereign' ? '#9333ea' : theme === 'singularity' ? '#0891b2' : '#c8102e';
    return `<path d="M${pts(ptsOutline)} Z M${inset(15)} Z" fill="url(#evoGold)" fill-rule="evenodd"/>`
      + `<polygon points="${inset(9)}" fill="none" stroke="#8a5a1c" stroke-width="1.2"/><polygon points="${inset(15)}" fill="none" stroke="${t.metal[1]}" stroke-width="1.5"/>`
      + themeGemList.map(([x, y]) => `<polygon points="${x},${y - 9} ${x + 4},${y} ${x},${y + 9} ${x - 4},${y}" fill="${gemColor}" stroke="#ffe9a8" stroke-width=".8"/>`).join('')
      + finial + crest;
  }

  let s = `<polygon points="${inset(7)}" fill="none" stroke="${t.metal[1]}" stroke-width="2.6"/><polygon points="${inset(14)}" fill="none" stroke="${t.metal[0]}" stroke-width="1"/>`;
  for (const x of [14, 386]) s += `<line x1="${x}" y1="48" x2="${x}" y2="80" stroke="${t.metal[1]}" stroke-width="2"/><line x1="${x}" y1="500" x2="${x}" y2="532" stroke="${t.metal[1]}" stroke-width="2"/>`;
  if (theme === 'ember') for (let y = 120; y <= 392; y += 8) s += `<line x1="17" y1="${y}" x2="${(y - 120) % 40 ? 25 : 33}" y2="${y}" stroke="${t.metal[0]}" stroke-opacity=".8"/>`;
  if (theme === 'cyber') for (const [x, y] of [[7, 46], [393, 46], [7, 534], [393, 534]]) s += `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="${t.bg[1]}" stroke="${t.metal[1]}" stroke-width="1.6"/>`;
  if (theme === 'iron') for (const [x, y] of [[14, 120], [386, 120], [14, 340], [386, 340]]) s += `<circle cx="${x}" cy="${y}" r="3" fill="${t.metal[1]}"/>`;
  if (theme === 'chrono') for (let y = 140; y <= 380; y += 20) s += `<line x1="15" y1="${y}" x2="23" y2="${y}" stroke="${t.metal[1]}" stroke-width="1.5"/><line x1="377" y1="${y}" x2="385" y2="${y}" stroke="${t.metal[1]}" stroke-width="1.5"/>`;

  return s + finial + crest;
}

const GOLD_DEF = '<linearGradient id="evoGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1c2"/><stop offset=".45" stop-color="#d9a84a"/><stop offset="1" stop-color="#8a5a1c"/></linearGradient>';
const cache = new Map();

/**
 * The SVG for one evo face: `back` sits under the portrait (background, motif,
 * floor), `front` over it (frame, crest, Apex's teeth where they leave the
 * card), `mask` is the outline as a data URI for the card's shadows and glare.
 */
export function evoFace(theme, level) {
  const t = EVO_ART[theme];
  if (!t) return null;
  const lv = level === 2 ? 2 : 1, key = `${theme}${lv}`;
  if (cache.has(key)) return cache.get(key);
  const apexII = isApexII(theme, lv), outline = pts(outlinePts(theme, lv)), floor = pts(floorPts(theme, lv));
  const id = `evo-${key}`;
  const back = `<svg viewBox="0 0 400 580" width="400" height="580" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>${GOLD_DEF.replace('evoGold', `${id}-gold`)}<clipPath id="${id}-clip"><polygon points="${outline}"/></clipPath>
<linearGradient id="${id}-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.bg[0]}"/><stop offset=".72" stop-color="${t.bg[1]}"/></linearGradient></defs>
<g clip-path="url(#${id}-clip)"><rect width="400" height="580" fill="url(#${id}-bg)"/>${MOTIF[theme](lv, rng(theme + lv), t).replaceAll('url(#evoGold)', `url(#${id}-gold)`)}
<polygon points="${floor}" fill="${t.floor}" fill-opacity=".94"/><line x1="0" y1="410" x2="400" y2="410" stroke="${t.line}" stroke-opacity=".6"/>${lv === 2 ? `<line x1="0" y1="416" x2="400" y2="416" stroke="${t.line}" stroke-opacity=".25"/>` : ''}</g></svg>`;
  const spill = (theme === 'apex' && apexII) ? `<g mask="url(#${id}-out)">${teethSvg(t)}</g>` : '';
  const front = `<svg viewBox="0 0 400 580" width="400" height="580" xmlns="http://www.w3.org/2000/svg" overflow="visible" aria-hidden="true">
<defs>${GOLD_DEF.replace('evoGold', `${id}-fgold`)}<mask id="${id}-out"><rect x="-60" y="-60" width="520" height="700" fill="#fff"/><polygon points="${outline}" fill="#000"/></mask></defs>
${spill}${frame(theme, t, lv).replaceAll('url(#evoGold)', `url(#${id}-fgold)`)}</svg>`;
  const mask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580"><polygon points="${outline}" fill="#000"/></svg>`)}")`;
  const out = { back, front, mask, ink: t.ink, metal: t.metal, tier: t.tier, floor: t.floor };
  cache.set(key, out);
  return out;
}
