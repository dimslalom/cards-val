import { useCallback, useEffect, useRef } from 'react';
import useReducedMotion, { prefersReducedMotion } from './useReducedMotion';
import { seededRestAngle } from './cardPhysics';

const SPRING = 260;
const DAMPING = 24;
const MAX_TILT = 6;

function coarsePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
}

export default function useCardTilt({ disabled = false, seed } = {}) {
  const reducedMotion = useReducedMotion();
  const tiltRef = useRef(null);
  const frameRef = useRef(0);
  const previousTimeRef = useRef(0);
  const stateRef = useRef({ rx: 0, ry: 0, rz: 0, lift: 0, scale: 1, vx: 0, vy: 0, vz: 0, vl: 0, vs: 0 });
  const targetRef = useRef({ rx: 0, ry: 0, rz: 0, lift: 0, scale: 1 });

  const write = useCallback(() => {
    const node = tiltRef.current;
    if (!node) return;
    const value = stateRef.current;
    node.style.setProperty('--rx', `${value.rx.toFixed(2)}deg`);
    node.style.setProperty('--ry', `${value.ry.toFixed(2)}deg`);
    node.style.setProperty('--rz', `${value.rz.toFixed(2)}deg`);
    node.style.setProperty('--lift', `${value.lift.toFixed(2)}px`);
    node.style.setProperty('--card-scale', value.scale.toFixed(3));
    node.style.setProperty('--mx', (value.ry / (MAX_TILT * 2)).toFixed(3));
    node.style.setProperty('--my', (-value.rx / (MAX_TILT * 2)).toFixed(3));
    node.style.setProperty('--mouse-x', `${(50 + value.ry / (MAX_TILT * 2) * 100).toFixed(2)}%`);
    node.style.setProperty('--mouse-y', `${(50 - value.rx / (MAX_TILT * 2) * 100).toFixed(2)}%`);
    node.style.setProperty('--ambient-opacity', Math.min(1, Math.abs(value.lift) / 24).toFixed(2));
  }, []);

  const animateToTarget = useCallback(() => {
    if (frameRef.current || prefersReducedMotion()) {
      if (prefersReducedMotion()) {
        Object.assign(stateRef.current, targetRef.current, { vx: 0, vy: 0, vz: 0, vl: 0, vs: 0 });
        write();
      }
      return;
    }
    previousTimeRef.current = performance.now();
    const tick = (now) => {
      const elapsed = Math.min((now - previousTimeRef.current) / 1000, 0.1);
      const steps = Math.max(1, Math.ceil(elapsed / (1 / 240)));
      const dt = elapsed / steps;
      previousTimeRef.current = now;
      const state = stateRef.current;
      const target = targetRef.current;
      const channels = [['rx', 'vx'], ['ry', 'vy'], ['rz', 'vz'], ['lift', 'vl'], ['scale', 'vs']];
      let moving = false;
      for (const [position, velocity] of channels) {
        for (let i = 0; i < steps; i += 1) {
          const acceleration = SPRING * (target[position] - state[position]) - DAMPING * state[velocity];
          state[velocity] += acceleration * dt;
          state[position] += state[velocity] * dt;
        }
        if (Math.abs(target[position] - state[position]) > 0.01 || Math.abs(state[velocity]) > 0.02) moving = true;
        else { state[position] = target[position]; state[velocity] = 0; }
      }
      write();
      if (moving) frameRef.current = requestAnimationFrame(tick);
      else frameRef.current = 0;
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [write]);

  const setElevation = useCallback((lift, scale) => {
    if (prefersReducedMotion()) return;
    targetRef.current.lift = lift;
    targetRef.current.scale = scale;
    animateToTarget();
  }, [animateToTarget]);

  const onPointerMove = useCallback((event) => {
    if (disabled || coarsePointer() || prefersReducedMotion()) return;
    const node = tiltRef.current;
    if (!node) return;
    const rect = event.currentTarget.getBoundingClientRect();
    let fx = (event.clientX - rect.left) / rect.width - 0.5;
    let fy = (event.clientY - rect.top) / rect.height - 0.5;
    const radial = Math.hypot(fx, fy) / Math.SQRT1_2;
    if (radial < 0.05) { fx = 0; fy = 0; }

    targetRef.current.rx = -fy * MAX_TILT * 2;
    targetRef.current.ry = fx * MAX_TILT * 2;
    node.style.setProperty('--glare', '.65');
    animateToTarget();
  }, [animateToTarget, disabled]);

  const onPointerEnter = useCallback(() => {
    if (disabled || coarsePointer()) return;
    setElevation(-8, 1.02);
  }, [disabled, setElevation]);

  const onPointerDown = useCallback(() => {
    if (disabled || coarsePointer()) return;
    setElevation(-12, 1.03);
  }, [disabled, setElevation]);

  const onPointerUp = useCallback(() => {
    if (disabled || coarsePointer()) return;
    setElevation(-8, 1.02);
  }, [disabled, setElevation]);

  const onPointerLeave = useCallback(() => {
    const node = tiltRef.current;
    Object.assign(targetRef.current, { rx: 0, ry: 0, rz: 0, lift: 0, scale: 1 });
    if (node) {
      node.style.setProperty('--mx', '0');
      node.style.setProperty('--my', '0');
      node.style.setProperty('--mouse-x', '50%');
      node.style.setProperty('--mouse-y', '50%');
      node.style.setProperty('--glare', '0');
    }
    animateToTarget();
  }, [animateToTarget]);

  const onFocus = useCallback(() => !disabled && setElevation(-8, 1.02), [disabled, setElevation]);
  const onBlur = useCallback(() => onPointerLeave(), [onPointerLeave]);

  useEffect(() => {
    tiltRef.current?.style.setProperty('--rest-rotate', `${seededRestAngle(seed)}deg`);
    return () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [seed]);

  useEffect(() => {
    if (!reducedMotion && !disabled) return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    Object.assign(targetRef.current, { rx: 0, ry: 0, rz: 0, lift: 0, scale: 1 });
    Object.assign(stateRef.current, targetRef.current, { vx: 0, vy: 0, vz: 0, vl: 0, vs: 0 });
    write();
  }, [reducedMotion, disabled, write]);

  return { tiltRef, onPointerMove, onPointerEnter, onPointerDown, onPointerUp, onPointerLeave, onFocus, onBlur };
}
