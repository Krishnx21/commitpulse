import { describe, it, expect } from 'vitest';
import { isTrustedProxy, ip4ToInt, isIPv4InCidr, isIPv4 } from './trustedProxy';
import type { TrustedProxyConfig } from '../types/network';

describe('trustedProxy — Massive Data Sets and Extreme High Bounds Scaling', () => {
  it('handles a massive list of 10000 trusted proxy IPs without performance degradation', () => {
    const trustedProxies = Array.from(
      { length: 10000 },
      (_, i) => `10.0.${Math.floor(i / 255)}.${i % 255}`
    );
    const config: TrustedProxyConfig = { trustedProxies, trustPrivateRanges: false };

    const start = performance.now();
    const result = isTrustedProxy('10.0.0.1', config);
    const duration = performance.now() - start;

    expect(result).toBe(true);
    expect(duration).toBeLessThan(500);
  });

  it('processes 10000 sequential ip4ToInt conversions within time limit', () => {
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      ip4ToInt(`${(i >> 24) & 255}.${(i >> 16) & 255}.${(i >> 8) & 255}.${i & 255}`);
    }
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(500);
  });

  it('evaluates 10000 CIDR checks against a large subnet without errors', () => {
    const results: boolean[] = [];
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      results.push(
        isIPv4InCidr(`192.168.${Math.floor(i / 255) % 255}.${i % 255}`, '192.168.0.0/16')
      );
    }
    const duration = performance.now() - start;

    expect(results.every((r) => r === true)).toBe(true);
    expect(duration).toBeLessThan(500);
  });

  it('validates 10000 IPv4 addresses correctly under high load', () => {
    const start = performance.now();
    let validCount = 0;
    for (let i = 0; i < 10000; i++) {
      if (isIPv4(`10.0.${Math.floor(i / 255) % 255}.${i % 255}`)) validCount++;
    }
    const duration = performance.now() - start;

    expect(validCount).toBe(10000);
    expect(duration).toBeLessThan(500);
  });

  it('correctly rejects all untrusted IPs from a massive proxy list under scale', () => {
    const trustedProxies = Array.from(
      { length: 5000 },
      (_, i) => `172.16.${Math.floor(i / 255)}.${i % 255}`
    );
    const config: TrustedProxyConfig = { trustedProxies, trustPrivateRanges: false };

    const start = performance.now();
    const result = isTrustedProxy('8.8.8.8', config);
    const duration = performance.now() - start;

    expect(result).toBe(false);
    expect(duration).toBeLessThan(500);
  });
});
