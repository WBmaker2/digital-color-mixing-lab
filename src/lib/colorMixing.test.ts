import { describe, expect, it } from 'vitest';
import {
  createEmptyDrops,
  getDominantRatioText,
  mixColor,
  type DropCounts
} from './colorMixing';

describe('color mixing engine', () => {
  it('returns a blank paint result before any drops are added', () => {
    const result = mixColor('paint', createEmptyDrops('paint'));

    expect(result.hex).toBe('#f8fafc');
    expect(result.name).toBe('아직 비어 있어요');
    expect(result.totalDrops).toBe(0);
  });

  it('mixes equal red and yellow paint into orange', () => {
    const result = mixColor('paint', { red: 1, yellow: 1 });

    expect(result.hex).toBe('#f97316');
    expect(result.name).toBe('주황');
    expect(result.feelingHint).toContain('따뜻');
  });

  it('mixes equal yellow and blue paint into green', () => {
    const result = mixColor('paint', { yellow: 1, blue: 1 });

    expect(result.hex).toBe('#22c55e');
    expect(result.name).toBe('초록');
  });

  it('mixes equal red and blue paint into purple', () => {
    const result = mixColor('paint', { red: 1, blue: 1 });

    expect(result.hex).toBe('#a855f7');
    expect(result.name).toBe('보라');
  });

  it('names unequal paint pairs with the dominant primary and secondary color', () => {
    const result = mixColor('paint', { red: 2, yellow: 1 });

    expect(result.name).toBe('빨강이 더 많은 주황');
    expect(result.totalDrops).toBe(3);
  });

  it('mixes all three paint primaries into a brownish mixed color', () => {
    const result = mixColor('paint', { red: 1, yellow: 1, blue: 1 });

    expect(result.name).toBe('갈색에 가까운 혼합색');
  });

  it('mixes equal red and green light into yellow light', () => {
    const result = mixColor('light', { red: 1, green: 1 });

    expect(result.hex).toBe('#ffff00');
    expect(result.name).toBe('노란빛');
  });

  it('mixes equal red, green, and blue light into white light', () => {
    const result = mixColor('light', { red: 1, green: 1, blue: 1 });

    expect(result.hex).toBe('#ffffff');
    expect(result.name).toBe('하얀빛');
  });

  it('names equal green and blue light cyan light', () => {
    const result = mixColor('light', { green: 1, blue: 1 });

    expect(result.hex).toBe('#00ffff');
    expect(result.name).toBe('청록빛');
  });

  it('names equal red and blue light magenta light', () => {
    const result = mixColor('light', { red: 1, blue: 1 });

    expect(result.hex).toBe('#ff00ff');
    expect(result.name).toBe('자홍빛');
  });

  it('formats paint ratios in red, yellow, blue order', () => {
    const drops: DropCounts = { red: 2, yellow: 1, blue: 0 };

    expect(getDominantRatioText('paint', drops)).toBe('빨강 2 : 노랑 1 : 파랑 0');
  });

  it('formats light ratios in red, green, blue order', () => {
    const drops: DropCounts = { red: 2, green: 0, blue: 1 };

    expect(getDominantRatioText('light', drops)).toBe('빨강빛 2 : 초록빛 0 : 파랑빛 1');
  });

  it('treats non-finite and negative paint drops as empty', () => {
    const result = mixColor('paint', {
      red: Number.NaN,
      yellow: Number.POSITIVE_INFINITY,
      blue: -2
    });

    expect(result.hex).toBe('#f8fafc');
    expect(result.name).toBe('아직 비어 있어요');
    expect(result.totalDrops).toBe(0);
    expect(
      getDominantRatioText('paint', {
        red: Number.NaN,
        yellow: Number.POSITIVE_INFINITY,
        blue: -2
      })
    ).toBe('빨강 0 : 노랑 0 : 파랑 0');
  });

  it('floors fractional drops before mixing and formatting ratios', () => {
    const drops: DropCounts = { red: 1.9, yellow: 1.1, blue: 0 };
    const result = mixColor('paint', drops);

    expect(result.hex).toBe('#f97316');
    expect(result.name).toBe('주황');
    expect(result.totalDrops).toBe(2);
    expect(getDominantRatioText('paint', drops)).toBe('빨강 1 : 노랑 1 : 파랑 0');
  });

  it('returns a fresh rgb object for empty results', () => {
    const first = mixColor('paint', createEmptyDrops('paint'));
    first.rgb.r = 0;

    const second = mixColor('paint', createEmptyDrops('paint'));

    expect(second.rgb).toEqual({ r: 248, g: 250, b: 252 });
  });

  it('returns fresh rgb objects for primary and secondary results', () => {
    const primary = mixColor('paint', { red: 1 });
    primary.rgb.r = 0;

    const secondary = mixColor('paint', { red: 1, yellow: 1 });
    secondary.rgb.g = 0;

    expect(mixColor('paint', { red: 1 }).rgb).toEqual({ r: 239, g: 68, b: 68 });
    expect(mixColor('paint', { red: 1, yellow: 1 }).rgb).toEqual({
      r: 249,
      g: 115,
      b: 22
    });
  });
});
