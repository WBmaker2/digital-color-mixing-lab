import type { ColorMode, DropCounts } from '../lib/colorMixing';

export type Challenge = {
  id: 'warm-orange' | 'forest-green' | 'white-light';
  prompt: string;
  description: string;
  successMessage: string;
  mode: ColorMode;
  targetDrops: DropCounts;
};

export const challenges: Challenge[] = [
  {
    id: 'warm-orange',
    prompt: '따뜻한 주황 만들기',
    description: '빨강과 노랑을 같은 비율로 섞어 따뜻한 주황을 만들어 보세요.',
    successMessage: '빨강과 노랑이 만나 주황이 되었어요. 따뜻한 느낌을 관찰해 보세요.',
    mode: 'paint',
    targetDrops: { red: 1, yellow: 1, blue: 0 }
  },
  {
    id: 'forest-green',
    prompt: '풀잎 초록 만들기',
    description: '노랑과 파랑을 같은 비율로 섞어 풀잎 같은 초록을 찾아보세요.',
    successMessage: '노랑과 파랑이 만나 초록이 되었어요. 싱그러운 느낌을 기록해 보세요.',
    mode: 'paint',
    targetDrops: { red: 0, yellow: 1, blue: 1 }
  },
  {
    id: 'white-light',
    prompt: '하얀빛 발견하기',
    description: '빨강빛, 초록빛, 파랑빛을 모두 켜서 빛이 어떻게 합쳐지는지 확인해 보세요.',
    successMessage: '빛의 삼원색이 모두 모여 하얀빛이 되었어요. 물감 모드와 다른 점을 찾아보세요.',
    mode: 'light',
    targetDrops: { red: 1, green: 1, blue: 1 }
  }
];
