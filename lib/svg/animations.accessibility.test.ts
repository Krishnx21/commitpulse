// lib/svg/animations.accessibility.test.ts

import { describe, expect, it } from 'vitest';
import { getTowerAnimationCSS } from './animations';

describe('Tower Animation Accessibility', () => {
  it('provides prefers-reduced-motion support for all animated entrances', () => {
    const entrances: Array<'rise' | 'fade' | 'slide'> = ['rise', 'fade', 'slide'];

    entrances.forEach((entrance) => {
      const css = getTowerAnimationCSS(entrance);
      expect(css).toContain('@media (prefers-reduced-motion: reduce)');
      expect(css).toContain('animation: none !important');
    });
  });

  it('enforces reduced-motion overrides with !important to prevent cascade bypass', () => {
    const css = getTowerAnimationCSS('rise');
    expect(css).toContain('animation: none !important');
    expect(css).toContain('transform: scaleY(1) translateY(0) !important');
    expect(css).toContain('opacity: 1 !important');
  });

  it('exposes a non-animated render path for users who disable motion entirely', () => {
    const css = getTowerAnimationCSS('none');
    expect(css).not.toContain('@keyframes');
    expect(css).not.toContain('animation:');
    expect(css).toContain('transform: scaleY(1)');
    expect(css).toContain('opacity: 1');
  });

  it('maintains visible final state so screen readers and assistive tech see complete content', () => {
    const entrances: Array<'rise' | 'fade' | 'slide' | 'none'> = ['rise', 'fade', 'slide', 'none'];

    entrances.forEach((entrance) => {
      const css = getTowerAnimationCSS(entrance);
      expect(css).not.toContain('display: none');
      expect(css).not.toContain('visibility: hidden');
    });
  });

  it('returns valid non-empty CSS for every supported entrance type to guarantee accessible markup', () => {
    const entrances: Array<'rise' | 'fade' | 'slide' | 'none'> = ['rise', 'fade', 'slide', 'none'];

    entrances.forEach((entrance) => {
      const css = getTowerAnimationCSS(entrance);
      expect(typeof css).toBe('string');
      expect(css.trim().length).toBeGreaterThan(0);
      expect(css).toContain('.cp-tower');
    });
  });
});
