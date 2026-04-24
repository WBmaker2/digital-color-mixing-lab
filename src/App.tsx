import { type CSSProperties, useMemo, useState } from 'react';
import { Droplet, Eraser, Lightbulb, Palette, RotateCcw, Sparkles, Target } from 'lucide-react';
import { challenges, type Challenge } from './data/challenges';
import {
  createEmptyDrops,
  getDominantRatioText,
  mixColor,
  type ColorMode,
  type DropCounts,
  type DropKey
} from './lib/colorMixing';

type ColorButton = {
  key: DropKey;
  label: string;
  swatch: string;
};

const MODE_OPTIONS: Array<{
  mode: ColorMode;
  label: string;
  Icon: typeof Palette;
}> = [
  { mode: 'paint', label: '물감', Icon: Palette },
  { mode: 'light', label: '빛', Icon: Lightbulb }
];

const PAINT_BUTTONS: ColorButton[] = [
  { key: 'red', label: '빨강', swatch: '#ef4444' },
  { key: 'yellow', label: '노랑', swatch: '#facc15' },
  { key: 'blue', label: '파랑', swatch: '#3b82f6' }
];

const LIGHT_BUTTONS: ColorButton[] = [
  { key: 'red', label: '빨강빛', swatch: '#ff3131' },
  { key: 'green', label: '초록빛', swatch: '#16a34a' },
  { key: 'blue', label: '파랑빛', swatch: '#2563eb' }
];

function App() {
  const [mode, setMode] = useState<ColorMode>('paint');
  const [drops, setDrops] = useState<DropCounts>(() => createEmptyDrops('paint'));
  const [note, setNote] = useState('');

  const mixed = useMemo(() => mixColor(mode, drops), [mode, drops]);
  const ratioText = useMemo(() => getDominantRatioText(mode, drops), [mode, drops]);
  const mixStatusText = `현재 결과: ${mixed.name}. 총 ${mixed.totalDrops}방울, 비율: ${ratioText}.`;
  const colorButtons = mode === 'paint' ? PAINT_BUTTONS : LIGHT_BUTTONS;

  function handleModeChange(nextMode: ColorMode) {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    setDrops(createEmptyDrops(nextMode));
    setNote('');
  }

  function handleAddDrop(key: DropKey) {
    setDrops((currentDrops) => ({
      ...currentDrops,
      [key]: getDropCount(currentDrops, key) + 1
    }));
  }

  function handleReset() {
    setDrops(createEmptyDrops(mode));
    setNote('');
  }

  function handleChallengeSelect(challenge: Challenge) {
    setMode(challenge.mode);
    setDrops({
      ...createEmptyDrops(challenge.mode),
      ...challenge.targetDrops
    });
    setNote('');
  }

  return (
    <main className="app">
      <header className="lab-header">
        <div>
          <p className="eyebrow">디지털 팔레트</p>
          <h1>색깔 혼합 실험실</h1>
          <p className="intro">방울을 더하며 물감과 빛이 어떻게 다른 색으로 변하는지 살펴보세요.</p>
        </div>
        <div className="drop-counter" aria-label={`현재 총 ${mixed.totalDrops}방울`}>
          <Droplet aria-hidden="true" size={18} />
          <span>{mixed.totalDrops}방울</span>
        </div>
      </header>

      <div className="lab-grid">
        <section className="panel tools-panel" aria-labelledby="tools-title">
          <div className="panel-heading">
            <Eraser aria-hidden="true" size={20} />
            <h2 id="tools-title">실험 도구</h2>
          </div>

          <fieldset className="mode-field">
            <legend>혼합 방식</legend>
            <div className="mode-toggle" role="group" aria-label="혼합 방식 선택">
              {MODE_OPTIONS.map(({ mode: optionMode, label, Icon }) => (
                <button
                  aria-pressed={mode === optionMode}
                  className="mode-button"
                  key={optionMode}
                  onClick={() => handleModeChange(optionMode)}
                  type="button"
                >
                  <Icon aria-hidden="true" size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="drop-section">
            <h3>{mode === 'paint' ? '물감 방울' : '빛 방울'}</h3>
            <div className="drop-grid">
              {colorButtons.map((button) => {
                const count = getDropCount(drops, button.key);
                const countDescriptionId = `${mode}-${button.key}-drop-count`;

                return (
                  <button
                    aria-describedby={countDescriptionId}
                    aria-label={`${button.label} 한 방울 추가`}
                    className="drop-button"
                    key={button.key}
                    onClick={() => handleAddDrop(button.key)}
                    style={{ '--drop-color': button.swatch } as CSSProperties}
                    type="button"
                  >
                    <span className="drop-swatch" aria-hidden="true" />
                    <span>{button.label}</span>
                    <strong>{count}</strong>
                    <span className="sr-only" id={countDescriptionId}>
                      현재 {count}방울
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button className="reset-button" onClick={handleReset} type="button">
            <RotateCcw aria-hidden="true" size={18} />
            <span>다시 섞기</span>
          </button>
        </section>

        <section className="panel result-panel" aria-labelledby="result-title">
          <div className="panel-heading result-heading">
            <Sparkles aria-hidden="true" size={20} />
            <h2 id="result-title">현재 섞인 색</h2>
          </div>

          <div
            aria-label={`${mixed.name} 결과 색상 ${mixed.hex}`}
            className="result-circle"
            role="img"
            style={{ backgroundColor: mixed.hex }}
          />
          <p aria-atomic="true" aria-live="polite" className="sr-only" role="status">
            {mixStatusText}
          </p>

          <dl className="result-details">
            <div>
              <dt>색 이름</dt>
              <dd>{mixed.name}</dd>
            </div>
            <div>
              <dt>느낌</dt>
              <dd>{mixed.feelingHint}</dd>
            </div>
            <div>
              <dt>HEX</dt>
              <dd>
                <code>{mixed.hex}</code>
              </dd>
            </div>
            <div>
              <dt>총 방울</dt>
              <dd>{mixed.totalDrops}방울</dd>
            </div>
            <div>
              <dt>정확한 비율</dt>
              <dd>{ratioText}</dd>
            </div>
          </dl>

          <div className="note-field">
            <label htmlFor="color-note">이 색의 이름이나 느낌</label>
            <textarea
              id="color-note"
              onChange={(event) => setNote(event.target.value)}
              placeholder="예: 노을 주황, 따뜻하고 신나는 느낌"
              rows={4}
              value={note}
            />
          </div>
        </section>

        <section className="panel challenges-panel" aria-labelledby="challenges-title">
          <div className="panel-heading">
            <Target aria-hidden="true" size={20} />
            <h2 id="challenges-title">도전 과제</h2>
          </div>

          <div className="challenge-list">
            {challenges.map((challenge) => (
              <button
                className="challenge-button"
                key={challenge.id}
                onClick={() => handleChallengeSelect(challenge)}
                type="button"
              >
                <span className="challenge-prompt">{challenge.prompt}</span>
                <span className="challenge-mode">{challenge.mode === 'paint' ? '물감' : '빛'}</span>
                <span className="challenge-ratio">
                  {getDominantRatioText(challenge.mode, challenge.targetDrops)}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function getDropCount(drops: DropCounts, key: DropKey): number {
  const value = drops[key];

  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.floor(value);
}

export default App;
