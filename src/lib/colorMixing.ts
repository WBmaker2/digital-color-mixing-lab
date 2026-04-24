export type ColorMode = 'paint' | 'light';

export type DropKey = 'red' | 'yellow' | 'green' | 'blue';

export type DropCounts = Partial<Record<DropKey, number>>;

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type PaintDropKey = 'red' | 'yellow' | 'blue';
type LightDropKey = 'red' | 'green' | 'blue';

export type MixedColor = {
  hex: string;
  rgb: Rgb;
  name: string;
  feelingHint: string;
  totalDrops: number;
};

const EMPTY_COLOR: MixedColor = {
  hex: '#f8fafc',
  rgb: { r: 248, g: 250, b: 252 },
  name: '아직 비어 있어요',
  feelingHint: '색 물방울을 한 방울씩 더해 보세요.',
  totalDrops: 0
};

const PAINT_ORDER = ['red', 'yellow', 'blue'] as const satisfies readonly PaintDropKey[];
const LIGHT_ORDER = ['red', 'green', 'blue'] as const satisfies readonly LightDropKey[];

const PAINT_PRIMARY: Record<PaintDropKey, { rgb: Rgb; name: string; feelingHint: string }> = {
  red: {
    rgb: { r: 239, g: 68, b: 68 },
    name: '빨강',
    feelingHint: '힘이 있고 따뜻한 느낌이 납니다.'
  },
  yellow: {
    rgb: { r: 250, g: 204, b: 21 },
    name: '노랑',
    feelingHint: '밝고 명랑한 느낌이 납니다.'
  },
  blue: {
    rgb: { r: 59, g: 130, b: 246 },
    name: '파랑',
    feelingHint: '시원하고 차분한 느낌이 납니다.'
  }
};

const PAINT_SECONDARY = {
  orange: {
    keys: ['red', 'yellow'],
    rgb: { r: 249, g: 115, b: 22 },
    name: '주황',
    feelingHint: '따뜻하고 활기찬 느낌이 납니다.'
  },
  green: {
    keys: ['yellow', 'blue'],
    rgb: { r: 34, g: 197, b: 94 },
    name: '초록',
    feelingHint: '풀잎처럼 싱그럽고 편안한 느낌이 납니다.'
  },
  purple: {
    keys: ['red', 'blue'],
    rgb: { r: 168, g: 85, b: 247 },
    name: '보라',
    feelingHint: '신비롭고 차분한 느낌이 납니다.'
  }
} as const satisfies Record<
  string,
  {
    keys: readonly [PaintDropKey, PaintDropKey];
    rgb: Rgb;
    name: string;
    feelingHint: string;
  }
>;

const BROWNISH_PAINT: Omit<MixedColor, 'totalDrops'> = {
  hex: '#8b5e34',
  rgb: { r: 139, g: 94, b: 52 },
  name: '갈색에 가까운 혼합색',
  feelingHint: '세 가지 물감이 섞여 차분하고 깊은 색이 됩니다.'
};

const LIGHT_RESULTS: Record<
  LightResultKey,
  {
    rgb: Rgb;
    name: string;
    feelingHint: string;
  }
> = {
  red: {
    rgb: { r: 255, g: 0, b: 0 },
    name: '빨간빛',
    feelingHint: '빨간빛만 켜져 있습니다.'
  },
  green: {
    rgb: { r: 0, g: 255, b: 0 },
    name: '초록빛',
    feelingHint: '초록빛만 켜져 있습니다.'
  },
  blue: {
    rgb: { r: 0, g: 0, b: 255 },
    name: '파란빛',
    feelingHint: '파란빛만 켜져 있습니다.'
  },
  'red+green': {
    rgb: { r: 255, g: 255, b: 0 },
    name: '노란빛',
    feelingHint: '빨간빛과 초록빛이 만나 밝은 노란빛으로 보입니다.'
  },
  'green+blue': {
    rgb: { r: 0, g: 255, b: 255 },
    name: '청록빛',
    feelingHint: '초록빛과 파란빛이 만나 시원한 청록빛으로 보입니다.'
  },
  'red+blue': {
    rgb: { r: 255, g: 0, b: 255 },
    name: '자홍빛',
    feelingHint: '빨간빛과 파란빛이 만나 선명한 자홍빛으로 보입니다.'
  },
  'red+green+blue': {
    rgb: { r: 255, g: 255, b: 255 },
    name: '하얀빛',
    feelingHint: '빛의 삼원색이 모두 모여 밝은 하얀빛이 됩니다.'
  }
};

type LightResultKey =
  | 'red'
  | 'green'
  | 'blue'
  | 'red+green'
  | 'green+blue'
  | 'red+blue'
  | 'red+green+blue';

export function createEmptyDrops(mode: ColorMode): DropCounts {
  return mode === 'paint' ? { red: 0, yellow: 0, blue: 0 } : { red: 0, green: 0, blue: 0 };
}

export function mixColor(mode: ColorMode, drops: DropCounts): MixedColor {
  const totalDrops = getTotalDrops(mode === 'paint' ? PAINT_ORDER : LIGHT_ORDER, drops);

  if (totalDrops === 0) {
    return EMPTY_COLOR;
  }

  return mode === 'paint'
    ? mixPaint(getActivePaintKeys(drops), drops, totalDrops)
    : mixLight(getActiveLightKeys(drops), totalDrops);
}

export function getDominantRatioText(mode: ColorMode, drops: DropCounts): string {
  const labels =
    mode === 'paint'
      ? ([
          ['red', '빨강'],
          ['yellow', '노랑'],
          ['blue', '파랑']
        ] as const)
      : ([
          ['red', '빨강빛'],
          ['green', '초록빛'],
          ['blue', '파랑빛']
        ] as const);

  return labels.map(([key, label]) => `${label} ${getDropCount(drops, key)}`).join(' : ');
}

function mixPaint(activeKeys: PaintDropKey[], drops: DropCounts, totalDrops: number): MixedColor {
  if (activeKeys.length === 1) {
    const primary = PAINT_PRIMARY[activeKeys[0]];

    return {
      hex: rgbToHex(primary.rgb),
      rgb: primary.rgb,
      name: primary.name,
      feelingHint: primary.feelingHint,
      totalDrops
    };
  }

  if (activeKeys.length === 2) {
    const [firstKey, secondKey] = activeKeys;

    return mixPaintPair(firstKey, secondKey, drops, totalDrops);
  }

  return {
    ...BROWNISH_PAINT,
    totalDrops
  };
}

function mixPaintPair(
  firstKey: PaintDropKey,
  secondKey: PaintDropKey,
  drops: DropCounts,
  totalDrops: number
): MixedColor {
  const secondary = getPaintSecondary(firstKey, secondKey);
  const firstCount = getDropCount(drops, firstKey);
  const secondCount = getDropCount(drops, secondKey);

  if (firstCount === secondCount) {
    return {
      hex: rgbToHex(secondary.rgb),
      rgb: secondary.rgb,
      name: secondary.name,
      feelingHint: secondary.feelingHint,
      totalDrops
    };
  }

  const dominantKey = firstCount > secondCount ? firstKey : secondKey;
  const dominant = PAINT_PRIMARY[dominantKey];
  const dominance = Math.abs(firstCount - secondCount) / totalDrops;
  const rgb = mixRgb(secondary.rgb, dominant.rgb, Math.min(dominance, 0.65));

  return {
    hex: rgbToHex(rgb),
    rgb,
    name: `${dominant.name}이 더 많은 ${secondary.name}`,
    feelingHint: secondary.feelingHint,
    totalDrops
  };
}

function mixLight(activeKeys: LightDropKey[], totalDrops: number): MixedColor {
  const key = getLightResultKey(activeKeys);
  const result = LIGHT_RESULTS[key];

  return {
    hex: rgbToHex(result.rgb),
    rgb: result.rgb,
    name: result.name,
    feelingHint: result.feelingHint,
    totalDrops
  };
}

function getActivePaintKeys(drops: DropCounts): PaintDropKey[] {
  return PAINT_ORDER.filter((key) => getDropCount(drops, key) > 0);
}

function getActiveLightKeys(drops: DropCounts): LightDropKey[] {
  return LIGHT_ORDER.filter((key) => getDropCount(drops, key) > 0);
}

function getTotalDrops(order: readonly DropKey[], drops: DropCounts): number {
  return order.reduce((total, key) => total + getDropCount(drops, key), 0);
}

function getDropCount(drops: DropCounts, key: DropKey): number {
  return Math.max(0, drops[key] ?? 0);
}

function getPaintSecondary(firstKey: PaintDropKey, secondKey: PaintDropKey) {
  if (isPaintPair(firstKey, secondKey, PAINT_SECONDARY.orange.keys)) {
    return PAINT_SECONDARY.orange;
  }

  if (isPaintPair(firstKey, secondKey, PAINT_SECONDARY.green.keys)) {
    return PAINT_SECONDARY.green;
  }

  if (isPaintPair(firstKey, secondKey, PAINT_SECONDARY.purple.keys)) {
    return PAINT_SECONDARY.purple;
  }

  throw new Error(`Unsupported paint pair: ${firstKey}, ${secondKey}`);
}

function getLightResultKey(activeKeys: LightDropKey[]): LightResultKey {
  if (activeKeys.length === 3) {
    return 'red+green+blue';
  }

  if (activeKeys.length === 1) {
    return activeKeys[0];
  }

  if (activeKeys.includes('red') && activeKeys.includes('green')) {
    return 'red+green';
  }

  if (activeKeys.includes('green') && activeKeys.includes('blue')) {
    return 'green+blue';
  }

  if (activeKeys.includes('red') && activeKeys.includes('blue')) {
    return 'red+blue';
  }

  throw new Error(`Unsupported light mix: ${activeKeys.join(', ')}`);
}

function isPaintPair(
  firstKey: PaintDropKey,
  secondKey: PaintDropKey,
  [expectedFirst, expectedSecond]: readonly [PaintDropKey, PaintDropKey]
): boolean {
  return (
    (firstKey === expectedFirst && secondKey === expectedSecond) ||
    (firstKey === expectedSecond && secondKey === expectedFirst)
  );
}

function mixRgb(from: Rgb, to: Rgb, amount: number): Rgb {
  return {
    r: Math.round(from.r + (to.r - from.r) * amount),
    g: Math.round(from.g + (to.g - from.g) * amount),
    b: Math.round(from.b + (to.b - from.b) * amount)
  };
}

function rgbToHex(rgb: Rgb): string {
  return `#${[rgb.r, rgb.g, rgb.b].map((channel) => toHexChannel(channel)).join('')}`;
}

function toHexChannel(channel: number): string {
  const clamped = Math.max(0, Math.min(255, channel));

  return clamped.toString(16).padStart(2, '0');
}
