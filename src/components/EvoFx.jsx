import { APEX_PTS, EVO_ART, insetPts, segRing } from './evoArt';
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

function clutch(t) {
  return `<circle cx="200" cy="290" r="221" fill="none" stroke="${t.line}" stroke-opacity=".25"/>
<g class="${styles.spin} ${styles.tick}">${segRing(200, 290, 213, 45, 33, 4, t.metal[1], t.line, .2)}</g>
<g class="${styles.beep}"><circle cx="200" cy="290" r="213" fill="none" stroke="${t.metal[1]}" stroke-width="1.6"/></g>
<g class="${styles.beep}" style="animation-delay:1.2s"><circle cx="200" cy="290" r="213" fill="none" stroke="${t.line}" stroke-width="1.2"/></g>`;
}

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

// A comet running round the border: stacked dashes whose front ends line up.
function comet(d, phase, slow) {
  const parts = [[9, 5, '#ff2d55', .3], [6, 4, '#ff3d5e', .55], [3, 3, '#ffb0a0', .85], [1, 2.4, '#fff6dc', 1]];
  return parts.map(([len, w, c, op]) => `<path class="${styles.comet}" d="${d}" pathLength="100" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${len} ${100 - len}" style="--o:${f(-phase - (9 - len))};--dur:${slow ? 7 : 3.6}s"/>`).join('');
}

export const BOLTS = [[-14, 70, -30, 270], [414, 300, 432, 510], [290, -10, 412, 52], [-10, 400, 60, 588]];
export function boltPts([x0, y0, x1, y1]) {
  const n = 9, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  return Array.from({ length: n + 1 }, (_, i) => { const k = i / n, j = i === 0 || i === n ? 0 : (Math.random() - .5) * 34; return `${f(x0 + dx * k + nx * j)},${f(y0 + dy * k + ny * j)}`; }).join(' ');
}

function apexFront(level, border) {
  if (level !== 2) return border ? comet(path(insetPts(8.5)), 0, true) : '';
  const d = path(APEX_PTS);
  const surge = `<path class="${styles.surge}" d="${d}" fill="none" stroke="#ff2850" stroke-width="6" stroke-linejoin="round"/><path class="${styles.surge}" d="${d}" fill="none" stroke="#fff0d2" stroke-width="1.5" stroke-linejoin="round"/>`;
  const bolts = BOLTS.map((b, i) => `<g class="${styles.bolt}" style="--d:${f(i * .8)}s;--dur:${f(2.6 + i * .5)}s" data-bolt="${i}"><polyline points="${boltPts(b)}" fill="none" stroke="#ff2d55" stroke-width="5" stroke-opacity=".55" stroke-linejoin="bevel"/><polyline points="${boltPts(b)}" fill="none" stroke="#fff2f4" stroke-width="1.6" stroke-linejoin="bevel"/></g>`).join('');
  const swipes = [0, 1, 2].map(i => {
    const sd = `M${434 - i * 6},${30 + i * 44} Q${214 - i * 8},${118 + i * 44} ${-34 + i * 4},${404 + i * 40}`;
    return `<path class="${styles.swipe}" style="--d:${f(i * .07)}s" d="${sd}" fill="none" stroke="#ff1f4b" stroke-width="10" stroke-linecap="round"/><path class="${styles.swipe}" style="--d:${f(i * .07 + .02)}s" d="${sd}" fill="none" stroke="#ffe9a8" stroke-width="2.4" stroke-linecap="round"/>`;
  }).join('');
  return (border ? surge + comet(d, 0) + comet(d, 50) : '') + bolts + swipes;
}

const EMBERS = (() => {
  const r = rng(11);
  return Array.from({ length: 20 }, () => ({ left: 18 + r() * 64, d: r() * -6, dur: 3.5 + r() * 3, dx: (r() - .5) * 60, h: -160 - r() * 160, s: 3 + r() * 4, red: r() < .3 }));
})();

// Lightning takes a new path every time it strikes.
function restrike(event) {
  const i = event.target.dataset?.bolt;
  if (i == null) return;
  event.target.querySelectorAll('polyline').forEach(line => line.setAttribute('points', boltPts(BOLTS[+i])));
}

// `border={false}` leaves the running border light out, for the 3D card that draws its own.
export default function EvoFx({ theme, level, layer, border = true }) {
  const t = EVO_ART[theme];
  if (!t || t.tier === 'common') return null;
  let svg = '';
  if (layer === 'back' && theme === 'amethyst' && level === 2) svg = clutch(t);
  if (layer === 'back' && theme === 'cyber' && level === 2) svg = hive(t);
  if (layer === 'front' && theme === 'apex') svg = apexFront(level, border);
  const embers = layer === 'front' && theme === 'apex' ? EMBERS.slice(0, level === 2 ? 20 : 9) : [];
  if (!svg && !embers.length) return null;
  return (
    <div className={styles.fx} data-layer={layer} aria-hidden="true" onAnimationIteration={restrike}>
      {svg && <svg viewBox={VB} dangerouslySetInnerHTML={{ __html: svg }} />}
      {embers.length > 0 && (
        <div className={styles.embers}>
          {embers.map((e, i) => <i key={i} className={styles.ember} data-red={e.red || undefined} style={{ left: `${e.left}%`, '--d': `${e.d}s`, '--dur': `${e.dur}s`, '--dx': `${e.dx}px`, '--h': `${e.h}px`, '--s': `${e.s}px` }} />)}
        </div>
      )}
    </div>
  );
}
