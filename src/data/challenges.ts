import type { ColorMode, DropCounts } from '../lib/colorMixing';

export type Challenge = {
  id: 'warm-orange' | 'forest-green' | 'white-light';
  prompt: string;
  mode: ColorMode;
  targetDrops: DropCounts;
};

export const challenges: Challenge[] = [
  {
    id: 'warm-orange',
    prompt: '따뜻한 주황 만들기',
    mode: 'paint',
    targetDrops: { red: 1, yellow: 1, blue: 0 }
  },
  {
    id: 'forest-green',
    prompt: '풀잎 초록 만들기',
    mode: 'paint',
    targetDrops: { red: 0, yellow: 1, blue: 1 }
  },
  {
    id: 'white-light',
    prompt: '하얀빛 발견하기',
    mode: 'light',
    targetDrops: { red: 1, green: 1, blue: 1 }
  }
];
