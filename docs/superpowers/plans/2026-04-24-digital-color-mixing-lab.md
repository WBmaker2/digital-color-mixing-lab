# Digital Color Mixing Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an elementary-friendly web app where learners add drops of color, observe real-time mixture changes, compare paint and light color modes, and record the color name or feeling.

**Architecture:** Start from an empty project and create a small Vite + React + TypeScript app. Keep color-mixing logic in a pure, tested module, keep lesson challenge data separate, and keep the first screen as the actual usable lab rather than a landing page.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, plain `src/App.css`, Lucide React icons.

---

## Project Context

- Project root: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab`
- Current state: empty directory, not a git repository.
- Plan assumption: initialize a fresh frontend app in this directory.
- User-facing language: Korean honorific/polite educational copy where full sentences appear; compact UI labels may use concise nouns.

## Visual And Product Direction

- The first viewport is the app itself: a large central beaker/palette, color-drop controls, live mixture result, ratio text, and a note input.
- Target audience: elementary students in grades 3-6 and teachers using it for art/science lessons.
- Mood: bright, tactile, playful science lab; clear enough for classroom projection.
- Main modes:
  - `물감 모드`: red, yellow, blue drops; teaches 3 primary colors and mixed colors.
  - `빛 모드`: red, green, blue light beams; extends to science lessons about light's primary colors.
- Interaction loop: choose mode -> add drops -> observe result -> name/feeling note -> try a challenge -> reset.

## File Structure

- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/package.json`
  - Defines scripts and dependencies.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/index.html`
  - Vite entry HTML.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/tsconfig.json`
  - TypeScript project config.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/tsconfig.node.json`
  - Vite config TypeScript config.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/vite.config.ts`
  - React and Vitest config.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/main.tsx`
  - React app bootstrap.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.tsx`
  - Main lab UI and state.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.css`
  - Responsive visual styling, beaker/palette surface, controls.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/lib/colorMixing.ts`
  - Pure color mixing engine, names, ratios, hex helpers.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/lib/colorMixing.test.ts`
  - Unit tests for color mixing.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/data/challenges.ts`
  - Small classroom challenge prompts.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/setupTests.ts`
  - Testing Library matcher setup.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/vite-env.d.ts`
  - Vite environment types.

---

### Task 1: Initialize The Frontend Project

**Files:**
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/package.json`
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/index.html`
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/tsconfig.json`
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/tsconfig.node.json`
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/vite.config.ts`
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/main.tsx`
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/setupTests.ts`
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/vite-env.d.ts`

- [ ] **Step 1: Initialize git**

Run:

```bash
git init
```

Expected: repository initialized in `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/.git`.

- [ ] **Step 2: Create package metadata**

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/package.json`:

```json
{
  "name": "digital-color-mixing-lab",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "lucide-react": "^1.9.0",
    "react": "^19.2.5",
    "react-dom": "^19.2.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "typescript": "^6.0.3",
    "vite": "^8.0.10",
    "vitest": "^4.1.5",
    "jsdom": "^29.0.2"
  }
}
```

- [ ] **Step 3: Create the Vite HTML shell**

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="물감과 빛의 색 혼합 원리를 실험하는 디지털 팔레트 웹앱"
    />
    <title>디지털 팔레트: 색깔 혼합 실험실</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create TypeScript and Vite config**

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts'
  }
});
```

- [ ] **Step 5: Create the React bootstrap files**

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/setupTests.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 6: Install dependencies**

Run:

```bash
npm install
```

Expected: `node_modules` and `package-lock.json` are created.

- [ ] **Step 7: Commit scaffold**

Run:

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts src/main.tsx src/setupTests.ts src/vite-env.d.ts
git commit -m "chore: scaffold color mixing lab"
```

Expected: first project commit succeeds.

---

### Task 2: Build And Test The Color Mixing Engine

**Files:**
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/lib/colorMixing.test.ts`
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/lib/colorMixing.ts`

- [ ] **Step 1: Write failing tests for paint and light mixing**

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/lib/colorMixing.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  createEmptyDrops,
  getDominantRatioText,
  mixColor,
  type ColorMode,
  type DropKey
} from './colorMixing';

describe('colorMixing', () => {
  it('returns a blank result before any drops are added', () => {
    const result = mixColor('paint', createEmptyDrops('paint'));

    expect(result.hex).toBe('#f8fafc');
    expect(result.name).toBe('아직 비어 있어요');
    expect(result.totalDrops).toBe(0);
  });

  it('mixes equal red and yellow paint into orange', () => {
    const result = mixColor('paint', { red: 1, yellow: 1, blue: 0 });

    expect(result.hex).toBe('#f97316');
    expect(result.name).toBe('주황');
    expect(result.feelingHint).toContain('따뜻');
  });

  it('mixes equal yellow and blue paint into green', () => {
    const result = mixColor('paint', { red: 0, yellow: 1, blue: 1 });

    expect(result.hex).toBe('#22c55e');
    expect(result.name).toBe('초록');
  });

  it('mixes equal red and blue paint into purple', () => {
    const result = mixColor('paint', { red: 1, yellow: 0, blue: 1 });

    expect(result.hex).toBe('#a855f7');
    expect(result.name).toBe('보라');
  });

  it('mixes equal red and green light into yellow light', () => {
    const result = mixColor('light', { red: 1, green: 1, blue: 0 });

    expect(result.hex).toBe('#ffff00');
    expect(result.name).toBe('노란빛');
  });

  it('mixes all light primaries into white light', () => {
    const result = mixColor('light', { red: 1, green: 1, blue: 1 });

    expect(result.hex).toBe('#ffffff');
    expect(result.name).toBe('하얀빛');
  });

  it('formats ratio text in the current mode order', () => {
    const modes: Array<[ColorMode, Record<DropKey, number>]> = [
      ['paint', { red: 2, yellow: 1, blue: 0 }],
      ['light', { red: 2, green: 0, blue: 1 }]
    ];

    expect(getDominantRatioText(...modes[0])).toBe('빨강 2 : 노랑 1 : 파랑 0');
    expect(getDominantRatioText(...modes[1])).toBe('빨강빛 2 : 초록빛 0 : 파랑빛 1');
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- src/lib/colorMixing.test.ts
```

Expected: FAIL because `src/lib/colorMixing.ts` does not exist yet.

- [ ] **Step 3: Implement the color mixing module**

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/lib/colorMixing.ts`:

```ts
export type ColorMode = 'paint' | 'light';
export type DropKey = 'red' | 'yellow' | 'green' | 'blue';
export type DropCounts = Partial<Record<DropKey, number>>;

type Rgb = [number, number, number];

export type MixedColor = {
  hex: string;
  rgb: Rgb;
  name: string;
  feelingHint: string;
  totalDrops: number;
};

const EMPTY: MixedColor = {
  hex: '#f8fafc',
  rgb: [248, 250, 252],
  name: '아직 비어 있어요',
  feelingHint: '색 물약을 한 방울 떨어뜨려 보세요.',
  totalDrops: 0
};

const PAINT_PRIMARY: Record<'red' | 'yellow' | 'blue', Rgb> = {
  red: [239, 68, 68],
  yellow: [250, 204, 21],
  blue: [59, 130, 246]
};

const PAINT_SECONDARY: Record<string, { rgb: Rgb; name: string; feelingHint: string }> = {
  'red+yellow': {
    rgb: [249, 115, 22],
    name: '주황',
    feelingHint: '따뜻하고 활기찬 느낌이 납니다.'
  },
  'yellow+blue': {
    rgb: [34, 197, 94],
    name: '초록',
    feelingHint: '풀잎처럼 싱그럽고 편안한 느낌이 납니다.'
  },
  'blue+red': {
    rgb: [168, 85, 247],
    name: '보라',
    feelingHint: '신비롭고 차분한 느낌이 납니다.'
  }
};

const PAINT_NAMES: Record<'red' | 'yellow' | 'blue', { name: string; feelingHint: string }> = {
  red: { name: '빨강', feelingHint: '강하고 따뜻한 느낌이 납니다.' },
  yellow: { name: '노랑', feelingHint: '밝고 명랑한 느낌이 납니다.' },
  blue: { name: '파랑', feelingHint: '시원하고 안정된 느낌이 납니다.' }
};

const LIGHT_NAMES: Record<string, { name: string; feelingHint: string }> = {
  red: { name: '빨간빛', feelingHint: '빨간빛만 보이는 상태입니다.' },
  green: { name: '초록빛', feelingHint: '초록빛만 보이는 상태입니다.' },
  blue: { name: '파란빛', feelingHint: '파란빛만 보이는 상태입니다.' },
  'red+green': { name: '노란빛', feelingHint: '빨간빛과 초록빛이 만나 노란빛으로 보입니다.' },
  'green+blue': { name: '청록빛', feelingHint: '초록빛과 파란빛이 만나 시원한 청록빛이 됩니다.' },
  'blue+red': { name: '자홍빛', feelingHint: '파란빛과 빨간빛이 만나 선명한 자홍빛이 됩니다.' },
  'red+green+blue': { name: '하얀빛', feelingHint: '빛의 삼원색이 모두 모여 밝은 하얀빛이 됩니다.' }
};

const PAINT_ORDER: Array<'red' | 'yellow' | 'blue'> = ['red', 'yellow', 'blue'];
const LIGHT_ORDER: Array<'red' | 'green' | 'blue'> = ['red', 'green', 'blue'];

export function createEmptyDrops(mode: ColorMode): DropCounts {
  return mode === 'paint'
    ? { red: 0, yellow: 0, blue: 0 }
    : { red: 0, green: 0, blue: 0 };
}

export function mixColor(mode: ColorMode, drops: DropCounts): MixedColor {
  const keys = mode === 'paint' ? PAINT_ORDER : LIGHT_ORDER;
  const totalDrops = keys.reduce((sum, key) => sum + (drops[key] ?? 0), 0);

  if (totalDrops === 0) {
    return EMPTY;
  }

  return mode === 'paint'
    ? mixPaint(drops, totalDrops)
    : mixLight(drops, totalDrops);
}

export function getDominantRatioText(mode: ColorMode, drops: DropCounts): string {
  const labels =
    mode === 'paint'
      ? [
          ['red', '빨강'],
          ['yellow', '노랑'],
          ['blue', '파랑']
        ]
      : [
          ['red', '빨강빛'],
          ['green', '초록빛'],
          ['blue', '파랑빛']
        ];

  return labels
    .map(([key, label]) => `${label} ${drops[key as DropKey] ?? 0}`)
    .join(' : ');
}

function mixPaint(drops: DropCounts, totalDrops: number): MixedColor {
  const active = PAINT_ORDER.filter((key) => (drops[key] ?? 0) > 0);

  if (active.length === 1) {
    const key = active[0];
    const rgb = PAINT_PRIMARY[key];
    return {
      rgb,
      hex: rgbToHex(rgb),
      name: PAINT_NAMES[key].name,
      feelingHint: PAINT_NAMES[key].feelingHint,
      totalDrops
    };
  }

  if (active.length === 2) {
    const pairKey = normalizePaintPair(active);
    const secondary = PAINT_SECONDARY[pairKey];
    const [first, second] = active;
    const firstCount = drops[first] ?? 0;
    const secondCount = drops[second] ?? 0;

    if (firstCount === secondCount) {
      return {
        rgb: secondary.rgb,
        hex: rgbToHex(secondary.rgb),
        name: secondary.name,
        feelingHint: secondary.feelingHint,
        totalDrops
      };
    }

    const dominant = firstCount > secondCount ? first : second;
    const dominance = Math.abs(firstCount - secondCount) / (firstCount + secondCount);
    const rgb = lerpRgb(secondary.rgb, PAINT_PRIMARY[dominant], Math.min(0.65, dominance));

    return {
      rgb,
      hex: rgbToHex(rgb),
      name: `${PAINT_NAMES[dominant].name}이 더 많은 ${secondary.name}`,
      feelingHint: secondary.feelingHint,
      totalDrops
    };
  }

  const brown: Rgb = [120, 83, 45];
  const averaged = weightedAverage(PAINT_ORDER.map((key) => [PAINT_PRIMARY[key], drops[key] ?? 0]));
  const balance = Math.min(...PAINT_ORDER.map((key) => drops[key] ?? 0)) / Math.max(...PAINT_ORDER.map((key) => drops[key] ?? 1));
  const rgb = lerpRgb(averaged, brown, Math.max(0.35, balance));

  return {
    rgb,
    hex: rgbToHex(rgb),
    name: '갈색에 가까운 혼합색',
    feelingHint: '세 가지 물감이 많이 섞이면 차분하고 깊은 색이 됩니다.',
    totalDrops
  };
}

function mixLight(drops: DropCounts, totalDrops: number): MixedColor {
  const red = drops.red && drops.red > 0 ? 255 : 0;
  const green = drops.green && drops.green > 0 ? 255 : 0;
  const blue = drops.blue && drops.blue > 0 ? 255 : 0;
  const active = LIGHT_ORDER.filter((key) => (drops[key] ?? 0) > 0);
  const rgb: Rgb = [red, green, blue];
  const nameKey = normalizeLightKey(active);
  const text = LIGHT_NAMES[nameKey];

  return {
    rgb,
    hex: rgbToHex(rgb),
    name: text.name,
    feelingHint: text.feelingHint,
    totalDrops
  };
}

function normalizePaintPair(active: Array<'red' | 'yellow' | 'blue'>): string {
  if (active.includes('red') && active.includes('yellow')) return 'red+yellow';
  if (active.includes('yellow') && active.includes('blue')) return 'yellow+blue';
  return 'blue+red';
}

function normalizeLightKey(active: Array<'red' | 'green' | 'blue'>): string {
  if (active.length === 3) return 'red+green+blue';
  if (active.includes('red') && active.includes('green')) return 'red+green';
  if (active.includes('green') && active.includes('blue')) return 'green+blue';
  if (active.includes('blue') && active.includes('red')) return 'blue+red';
  return active[0];
}

function weightedAverage(entries: Array<[Rgb, number]>): Rgb {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  return entries
    .reduce<Rgb>(
      (acc, [rgb, weight]) => [
        acc[0] + rgb[0] * weight,
        acc[1] + rgb[1] * weight,
        acc[2] + rgb[2] * weight
      ],
      [0, 0, 0]
    )
    .map((value) => Math.round(value / total)) as Rgb;
}

function lerpRgb(from: Rgb, to: Rgb, amount: number): Rgb {
  return from.map((channel, index) =>
    Math.round(channel + (to[index] - channel) * amount)
  ) as Rgb;
}

function rgbToHex(rgb: Rgb): string {
  return `#${rgb
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}
```

- [ ] **Step 4: Run tests to verify pass**

Run:

```bash
npm test -- src/lib/colorMixing.test.ts
```

Expected: PASS for all color-mixing tests.

- [ ] **Step 5: Commit the color engine**

Run:

```bash
git add src/lib/colorMixing.ts src/lib/colorMixing.test.ts
git commit -m "feat: add tested color mixing engine"
```

Expected: commit succeeds.

---

### Task 3: Create The Core Digital Palette UI

**Files:**
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/data/challenges.ts`
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.tsx`
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.css`

- [ ] **Step 1: Create classroom challenge data**

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/data/challenges.ts`:

```ts
import type { ColorMode, DropCounts } from '../lib/colorMixing';

export type Challenge = {
  id: string;
  mode: ColorMode;
  title: string;
  prompt: string;
  targetDrops: DropCounts;
};

export const challenges: Challenge[] = [
  {
    id: 'warm-orange',
    mode: 'paint',
    title: '따뜻한 주황 만들기',
    prompt: '빨강과 노랑을 섞어 따뜻한 느낌의 색을 만들어 보세요.',
    targetDrops: { red: 1, yellow: 1, blue: 0 }
  },
  {
    id: 'forest-green',
    mode: 'paint',
    title: '풀잎 초록 만들기',
    prompt: '노랑과 파랑을 섞으면 어떤 색이 되는지 관찰해 보세요.',
    targetDrops: { red: 0, yellow: 1, blue: 1 }
  },
  {
    id: 'white-light',
    mode: 'light',
    title: '하얀빛 발견하기',
    prompt: '빨강빛, 초록빛, 파랑빛을 모두 켜서 빛이 어떻게 보이는지 확인해 보세요.',
    targetDrops: { red: 1, green: 1, blue: 1 }
  }
];
```

- [ ] **Step 2: Implement the main app UI**

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.tsx`:

```tsx
import { Beaker, Lightbulb, Paintbrush, RotateCcw, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { challenges } from './data/challenges';
import {
  createEmptyDrops,
  getDominantRatioText,
  mixColor,
  type ColorMode,
  type DropCounts,
  type DropKey
} from './lib/colorMixing';

const paintButtons: Array<{ key: DropKey; label: string; css: string }> = [
  { key: 'red', label: '빨강', css: 'red' },
  { key: 'yellow', label: '노랑', css: 'yellow' },
  { key: 'blue', label: '파랑', css: 'blue' }
];

const lightButtons: Array<{ key: DropKey; label: string; css: string }> = [
  { key: 'red', label: '빨강빛', css: 'red' },
  { key: 'green', label: '초록빛', css: 'green' },
  { key: 'blue', label: '파랑빛', css: 'blue' }
];

export default function App() {
  const [mode, setMode] = useState<ColorMode>('paint');
  const [drops, setDrops] = useState<DropCounts>(() => createEmptyDrops('paint'));
  const [note, setNote] = useState('');
  const [activeChallengeId, setActiveChallengeId] = useState(challenges[0].id);

  const mixed = useMemo(() => mixColor(mode, drops), [mode, drops]);
  const ratioText = getDominantRatioText(mode, drops);
  const controls = mode === 'paint' ? paintButtons : lightButtons;
  const activeChallenge = challenges.find((challenge) => challenge.id === activeChallengeId) ?? challenges[0];

  const addDrop = (key: DropKey) => {
    setDrops((current) => ({ ...current, [key]: (current[key] ?? 0) + 1 }));
  };

  const resetDrops = () => {
    setDrops(createEmptyDrops(mode));
    setNote('');
  };

  const switchMode = (nextMode: ColorMode) => {
    setMode(nextMode);
    setDrops(createEmptyDrops(nextMode));
    setNote('');
    const firstChallenge = challenges.find((challenge) => challenge.mode === nextMode);
    setActiveChallengeId(firstChallenge?.id ?? challenges[0].id);
  };

  const loadChallenge = (challengeId: string) => {
    const challenge = challenges.find((item) => item.id === challengeId);
    if (!challenge) return;

    setActiveChallengeId(challenge.id);
    setMode(challenge.mode);
    setDrops(challenge.targetDrops);
    setNote('');
  };

  return (
    <main className="lab-shell">
      <section className="lab-header" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">미술 / 과학 융합 실험</p>
          <h1 id="app-title">디지털 팔레트: 색깔 혼합 실험실</h1>
        </div>
        <div className="mode-toggle" aria-label="실험 모드 선택">
          <button
            className={mode === 'paint' ? 'active' : ''}
            type="button"
            onClick={() => switchMode('paint')}
          >
            <Paintbrush size={18} aria-hidden="true" />
            물감
          </button>
          <button
            className={mode === 'light' ? 'active' : ''}
            type="button"
            onClick={() => switchMode('light')}
          >
            <Lightbulb size={18} aria-hidden="true" />
            빛
          </button>
        </div>
      </section>

      <section className="lab-grid" aria-label="색깔 혼합 실험 도구">
        <aside className="control-panel" aria-label="색 물약 선택">
          <div className="panel-title">
            <Beaker size={20} aria-hidden="true" />
            <h2>{mode === 'paint' ? '색 물약' : '빛 스위치'}</h2>
          </div>

          <div className="drop-buttons">
            {controls.map((control) => (
              <button
                className={`drop-button ${control.css}`}
                key={control.key}
                type="button"
                onClick={() => addDrop(control.key)}
                aria-label={`${control.label} 한 방울 추가`}
              >
                <span className="drop-shape" aria-hidden="true" />
                <span>{control.label}</span>
                <strong>{drops[control.key] ?? 0}</strong>
              </button>
            ))}
          </div>

          <button className="reset-button" type="button" onClick={resetDrops}>
            <RotateCcw size={18} aria-hidden="true" />
            다시 섞기
          </button>
        </aside>

        <section className="mix-stage" aria-live="polite">
          <div
            className={`mixture-orb ${mode}`}
            style={{
              backgroundColor: mixed.hex,
              boxShadow:
                mode === 'light'
                  ? `0 0 70px ${mixed.hex}`
                  : `inset 0 -24px 50px rgba(15, 23, 42, 0.2), 0 24px 60px rgba(15, 23, 42, 0.18)`
            }}
          >
            <span>{mixed.name}</span>
          </div>
          <div className="result-card">
            <p className="result-label">현재 혼합 결과</p>
            <h2>{mixed.name}</h2>
            <p>{mixed.feelingHint}</p>
            <dl>
              <div>
                <dt>색상값</dt>
                <dd>{mixed.hex.toUpperCase()}</dd>
              </div>
              <div>
                <dt>방울 수</dt>
                <dd>{mixed.totalDrops}</dd>
              </div>
            </dl>
            <p className="ratio">{ratioText}</p>
          </div>
        </section>

        <aside className="learning-panel" aria-label="관찰 기록과 도전 과제">
          <label className="note-label" htmlFor="color-note">
            이 색의 이름이나 느낌
          </label>
          <textarea
            id="color-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="예: 해 질 무렵 하늘색 같아요."
            rows={5}
          />

          <div className="challenge-box">
            <div className="panel-title">
              <Sparkles size={20} aria-hidden="true" />
              <h2>오늘의 실험</h2>
            </div>
            <h3>{activeChallenge.title}</h3>
            <p>{activeChallenge.prompt}</p>
            <div className="challenge-actions">
              {challenges.map((challenge) => (
                <button
                  key={challenge.id}
                  type="button"
                  className={challenge.id === activeChallengeId ? 'selected' : ''}
                  onClick={() => loadChallenge(challenge.id)}
                >
                  {challenge.title}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Style the lab screen**

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.css`:

```css
:root {
  color: #172033;
  background: #f7f4ec;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(238, 246, 255, 0.78)),
    #f7f4ec;
}

button,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.lab-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0;
}

.lab-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2f6f62;
  font-size: 0.88rem;
  font-weight: 800;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  color: #152238;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.02;
  letter-spacing: 0;
}

.mode-toggle {
  display: inline-flex;
  gap: 6px;
  padding: 6px;
  border: 1px solid rgba(23, 32, 51, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
}

.mode-toggle button,
.reset-button,
.challenge-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 999px;
  color: #22304d;
  background: transparent;
  min-height: 44px;
  padding: 10px 14px;
  font-weight: 800;
}

.mode-toggle button.active {
  color: #ffffff;
  background: #172033;
}

.lab-grid {
  display: grid;
  grid-template-columns: minmax(220px, 260px) minmax(340px, 1fr) minmax(260px, 320px);
  gap: 18px;
  align-items: stretch;
}

.control-panel,
.learning-panel,
.result-card {
  border: 1px solid rgba(23, 32, 51, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 18px 45px rgba(43, 54, 78, 0.1);
}

.control-panel,
.learning-panel {
  padding: 18px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #172033;
  margin-bottom: 16px;
}

.panel-title h2 {
  margin: 0;
  font-size: 1.05rem;
}

.drop-buttons {
  display: grid;
  gap: 12px;
}

.drop-button {
  display: grid;
  grid-template-columns: 36px 1fr auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 58px;
  border: 1px solid rgba(23, 32, 51, 0.1);
  border-radius: 8px;
  padding: 10px 12px;
  color: #172033;
  background: #ffffff;
  font-weight: 800;
  text-align: left;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
}

.drop-button:hover,
.drop-button:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(23, 32, 51, 0.13);
}

.drop-button strong {
  min-width: 32px;
  border-radius: 999px;
  padding: 4px 8px;
  text-align: center;
  background: #eef2f7;
}

.drop-shape {
  width: 32px;
  height: 38px;
  border-radius: 50% 50% 55% 55%;
  transform: rotate(8deg);
  display: block;
}

.drop-button.red .drop-shape {
  background: #ef4444;
}

.drop-button.yellow .drop-shape {
  background: #facc15;
}

.drop-button.green .drop-shape {
  background: #22c55e;
}

.drop-button.blue .drop-shape {
  background: #3b82f6;
}

.reset-button {
  width: 100%;
  margin-top: 16px;
  background: #172033;
  color: #ffffff;
}

.mix-stage {
  display: grid;
  gap: 16px;
  align-content: center;
  min-height: 640px;
  padding: 18px;
  border-radius: 8px;
  background:
    linear-gradient(rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.58)),
    repeating-linear-gradient(
      90deg,
      rgba(23, 32, 51, 0.05) 0,
      rgba(23, 32, 51, 0.05) 1px,
      transparent 1px,
      transparent 42px
    );
}

.mixture-orb {
  display: grid;
  place-items: center;
  width: min(420px, 100%);
  aspect-ratio: 1;
  margin: 0 auto;
  border: 10px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  color: #152238;
  transition:
    background-color 240ms ease,
    box-shadow 240ms ease,
    transform 180ms ease;
}

.mixture-orb.light {
  color: #111827;
}

.mixture-orb span {
  max-width: 75%;
  border-radius: 999px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.72);
  font-size: clamp(1.35rem, 4vw, 2.3rem);
  font-weight: 900;
  text-align: center;
}

.result-card {
  padding: 18px;
}

.result-label {
  margin-bottom: 8px;
  color: #5b677c;
  font-size: 0.86rem;
  font-weight: 800;
}

.result-card h2 {
  margin-bottom: 8px;
  font-size: 1.8rem;
}

.result-card dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 18px 0 12px;
}

.result-card dt {
  color: #68758c;
  font-size: 0.8rem;
  font-weight: 800;
}

.result-card dd {
  margin: 4px 0 0;
  font-weight: 900;
}

.ratio {
  margin-bottom: 0;
  border-radius: 8px;
  padding: 12px;
  background: #eef2f7;
  font-weight: 800;
}

.note-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 900;
}

textarea {
  width: 100%;
  resize: vertical;
  border: 1px solid rgba(23, 32, 51, 0.16);
  border-radius: 8px;
  padding: 12px;
  color: #172033;
  background: #ffffff;
}

.challenge-box {
  margin-top: 18px;
  border-top: 1px solid rgba(23, 32, 51, 0.1);
  padding-top: 18px;
}

.challenge-box h3 {
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.challenge-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.challenge-actions button {
  min-height: 38px;
  border: 1px solid rgba(23, 32, 51, 0.12);
  border-radius: 8px;
  background: #ffffff;
  font-size: 0.86rem;
}

.challenge-actions button.selected {
  color: #ffffff;
  background: #2f6f62;
}

button:focus-visible,
textarea:focus-visible {
  outline: 3px solid #f59e0b;
  outline-offset: 3px;
}

@media (max-width: 940px) {
  .lab-header {
    align-items: start;
    flex-direction: column;
  }

  .lab-grid {
    grid-template-columns: 1fr;
  }

  .mix-stage {
    min-height: auto;
  }

  .control-panel {
    order: 1;
  }

  .mix-stage {
    order: 2;
  }

  .learning-panel {
    order: 3;
  }
}

@media (max-width: 560px) {
  .lab-shell {
    width: min(100% - 20px, 1180px);
    padding: 18px 0;
  }

  .mode-toggle {
    width: 100%;
  }

  .mode-toggle button {
    flex: 1;
  }

  .result-card dl {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build succeed.

- [ ] **Step 5: Commit the UI**

Run:

```bash
git add src/App.tsx src/App.css src/data/challenges.ts
git commit -m "feat: build interactive color mixing lab"
```

Expected: commit succeeds.

---

### Task 4: Add App-Level Interaction Tests

**Files:**
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.test.tsx`

- [ ] **Step 1: Write failing UI tests**

Write `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('updates the paint mixture when students add red and yellow drops', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '빨강 한 방울 추가' }));
    await user.click(screen.getByRole('button', { name: '노랑 한 방울 추가' }));

    expect(screen.getAllByText('주황').length).toBeGreaterThan(0);
    expect(screen.getByText('빨강 1 : 노랑 1 : 파랑 0')).toBeInTheDocument();
  });

  it('switches to light mode and shows white light when all light colors are active', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '빛' }));
    await user.click(screen.getByRole('button', { name: '빨강빛 한 방울 추가' }));
    await user.click(screen.getByRole('button', { name: '초록빛 한 방울 추가' }));
    await user.click(screen.getByRole('button', { name: '파랑빛 한 방울 추가' }));

    expect(screen.getAllByText('하얀빛').length).toBeGreaterThan(0);
    expect(screen.getByText('빨강빛 1 : 초록빛 1 : 파랑빛 1')).toBeInTheDocument();
  });

  it('lets students write and clear an observation note', async () => {
    const user = userEvent.setup();

    render(<App />);

    const note = screen.getByLabelText('이 색의 이름이나 느낌');
    await user.type(note, '해 질 무렵 하늘색 같아요.');
    expect(note).toHaveValue('해 질 무렵 하늘색 같아요.');

    await user.click(screen.getByRole('button', { name: '다시 섞기' }));
    expect(note).toHaveValue('');
  });
});
```

- [ ] **Step 2: Run tests**

Run:

```bash
npm test
```

Expected: PASS for color-mixing and app interaction tests.

- [ ] **Step 3: Fix any accessible-name mismatch**

If a test fails because a button or label name changed, update the UI copy in `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.tsx` to preserve these accessible names:

```tsx
aria-label={`${control.label} 한 방울 추가`}
```

and:

```tsx
<label className="note-label" htmlFor="color-note">
  이 색의 이름이나 느낌
</label>
```

- [ ] **Step 4: Commit interaction tests**

Run:

```bash
git add src/App.test.tsx src/App.tsx
git commit -m "test: cover core color lab interactions"
```

Expected: commit succeeds.

---

### Task 5: Browser Verification And Classroom Polish

**Files:**
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.tsx`
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.css`

- [ ] **Step 1: Start the dev server**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL such as `http://localhost:5173/`.

- [ ] **Step 2: Verify desktop interaction in a browser**

Open the local URL and check:

```text
1. Add 빨강 once and 노랑 once.
2. Confirm the large circle changes to 주황.
3. Confirm the ratio reads "빨강 1 : 노랑 1 : 파랑 0".
4. Type "따뜻한 귤색 같아요." into the note field.
5. Click 다시 섞기 and confirm drops plus note reset.
```

Expected: all controls respond without layout shift or text overlap.

- [ ] **Step 3: Verify light-mode interaction in a browser**

In the same browser session:

```text
1. Click 빛.
2. Add 빨강빛, 초록빛, 파랑빛 once each.
3. Confirm the result reads 하얀빛.
4. Confirm the large circle is bright and readable.
```

Expected: mode change resets previous paint drops and shows the light-primary controls.

- [ ] **Step 4: Verify mobile layout**

Use a mobile-sized viewport around `390x844` and check:

```text
1. Header, mode toggle, controls, circle, result card, note field, and challenges appear in a single column.
2. No text overlaps inside buttons or cards.
3. The large result circle stays within the viewport width.
4. Every button remains at least 44px tall.
```

Expected: the app is usable on a phone or tablet.

- [ ] **Step 5: Run final checks**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and production build succeeds.

- [ ] **Step 6: Commit polish**

Run:

```bash
git add src/App.tsx src/App.css
git commit -m "polish: verify classroom color lab experience"
```

Expected: commit succeeds.

---

## Self-Review

- Spec coverage: The plan covers color buttons, live central result, ratios, color names/feelings, reset, paint primary mixing, and light primary extension.
- Placeholder scan: No `TBD`, `TODO`, or undefined future tasks remain.
- Type consistency: `ColorMode`, `DropKey`, `DropCounts`, `mixColor`, and `createEmptyDrops` are defined before use.
- Scope check: The plan intentionally excludes accounts, saving to cloud storage, teacher dashboards, and lesson analytics. Those can be separate future plans.

## Execution Options

1. **Subagent-Driven (recommended)** - Dispatch a fresh worker per task, review between tasks, and integrate changes after each task.
2. **Inline Execution** - Execute these tasks in this session using the plan sequentially with checkpoints.
