# Learning Missions, Export, And Teacher Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the completed Digital Color Mixing Lab with guided mission feedback, an observation-card export workflow, and a compact teacher-use guide.

**Architecture:** Keep the existing single-screen React app and color-mixing engine. Add small typed data modules for missions and teacher content, then wire them into `App.tsx` with local state and focused tests. Avoid persistence, accounts, server APIs, and new dependencies.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, plain CSS.

---

## Project Context

- Project root: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab`
- Current branch for this work: `codex/learning-missions-export-teacher-guide`
- Production app: `https://wbmaker2.github.io/digital-color-mixing-lab/`
- Current app files:
  - `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.tsx`
  - `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.css`
  - `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.test.tsx`
  - `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/data/challenges.ts`
  - `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/lib/colorMixing.ts`

## Recommended Order

1. Add mission mode feedback.
2. Add observation record export.
3. Add a teacher-use guide card.

---

## File Structure

- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/data/challenges.ts`
  - Rename challenge copy into explicit missions and add success feedback.
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/data/teacherGuide.ts`
  - Store achievement standards, lesson flow, and question prompts.
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.tsx`
  - Track active mission, mission completion, export text, and teacher guide rendering.
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.css`
  - Add mission success, export preview, and teacher guide styles using existing palette and radius.
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.test.tsx`
  - Add tests for mission success, export text generation, and teacher guide visibility.

---

### Task 1: Guided Mission Mode

**Files:**
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/data/challenges.ts`
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.tsx`
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.css`
- Test: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.test.tsx`

- [ ] **Step 1: Add a failing mission success test**

Add this test to `src/App.test.tsx`:

```tsx
it('shows mission feedback when the current mix matches the selected mission', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole('button', { name: /따뜻한 주황 만들기/ }));

  expect(screen.getByText('미션 성공')).toBeVisible();
  expect(screen.getByText(/빨강과 노랑이 만나 주황이 되었어요/)).toBeVisible();
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
/Users/kimhongnyeon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/vitest/vitest.mjs run src/App.test.tsx
```

Expected: FAIL because mission feedback does not exist yet.

- [ ] **Step 3: Extend challenge data**

Change `src/data/challenges.ts` so each mission has `successMessage` and `description`:

```ts
export type Challenge = {
  id: 'warm-orange' | 'forest-green' | 'white-light';
  prompt: string;
  description: string;
  successMessage: string;
  mode: ColorMode;
  targetDrops: DropCounts;
};
```

Use:

```ts
successMessage: '빨강과 노랑이 만나 주황이 되었어요. 따뜻한 느낌을 관찰해 보세요.'
```

for warm orange.

- [ ] **Step 4: Implement active mission feedback in `App.tsx`**

Add state:

```ts
const [activeChallengeId, setActiveChallengeId] = useState<Challenge['id']>('warm-orange');
```

Derive:

```ts
const activeChallenge = challenges.find((challenge) => challenge.id === activeChallengeId) ?? challenges[0];
const missionComplete =
  mode === activeChallenge.mode &&
  getDominantRatioText(mode, drops) === getDominantRatioText(activeChallenge.mode, activeChallenge.targetDrops);
```

Update `handleChallengeSelect` to set `activeChallengeId`.

Render a mission feedback block in the challenge panel:

```tsx
<div className={missionComplete ? 'mission-feedback success' : 'mission-feedback'}>
  <strong>{missionComplete ? '미션 성공' : '미션 진행 중'}</strong>
  <p>{missionComplete ? activeChallenge.successMessage : activeChallenge.description}</p>
</div>
```

- [ ] **Step 5: Style mission feedback**

Add compact CSS classes with 8px radius:

```css
.mission-feedback {
  margin-bottom: 14px;
  padding: 12px;
  border: 1px solid #c9dfd5;
  border-radius: 8px;
  background: #f7fcf9;
}

.mission-feedback.success {
  border-color: #f4c54d;
  background: #fff8dc;
}
```

- [ ] **Step 6: Verify**

Run:

```bash
/Users/kimhongnyeon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/vitest/vitest.mjs run src/App.test.tsx
```

Expected: PASS.

---

### Task 2: Observation Record Export

**Files:**
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.tsx`
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.css`
- Test: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.test.tsx`

- [ ] **Step 1: Add a failing export test**

Add this test:

```tsx
it('generates an observation card text from the current mix and note', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole('button', { name: /빨강 한 방울 추가/ }));
  await user.click(screen.getByRole('button', { name: /노랑 한 방울 추가/ }));
  await user.type(screen.getByRole('textbox', { name: /이 색의 이름이나 느낌/ }), '따뜻한 귤색 같아요.');
  await user.click(screen.getByRole('button', { name: '관찰 카드 만들기' }));

  expect(screen.getByText(/색 이름: 주황/)).toBeVisible();
  expect(screen.getByText(/비율: 빨강 1 : 노랑 1 : 파랑 0/)).toBeVisible();
  expect(screen.getByText(/내 느낌: 따뜻한 귤색 같아요./)).toBeVisible();
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run the App test command. Expected: FAIL because the export button does not exist.

- [ ] **Step 3: Add export state and text builder**

In `App.tsx`, add:

```ts
const [observationCard, setObservationCard] = useState('');

function buildObservationCard() {
  return [
    `색 이름: ${mixed.name}`,
    `색상값: ${mixed.hex}`,
    `총 방울: ${mixed.totalDrops}방울`,
    `비율: ${ratioText}`,
    `내 느낌: ${note.trim() || '아직 기록하지 않았어요.'}`
  ].join('\n');
}

function handleCreateObservationCard() {
  setObservationCard(buildObservationCard());
}
```

Clear `observationCard` in `handleReset`, `handleModeChange`, and `handleChallengeSelect`.

- [ ] **Step 4: Render export controls**

Below the note field, render:

```tsx
<div className="export-box">
  <button className="export-button" type="button" onClick={handleCreateObservationCard}>
    관찰 카드 만들기
  </button>
  {observationCard ? <pre className="observation-card">{observationCard}</pre> : null}
</div>
```

- [ ] **Step 5: Style export controls**

Use existing green/yellow palette and stable text wrapping:

```css
.export-box {
  width: 100%;
  margin-top: 12px;
}

.export-button {
  min-height: 44px;
  border: 1px solid #2f8b69;
  border-radius: 8px;
  background: #e9f6f0;
  color: #17483b;
  font-weight: 900;
}

.observation-card {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
```

- [ ] **Step 6: Verify**

Run App tests. Expected: PASS.

---

### Task 3: Teacher Use Guide Card

**Files:**
- Create: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/data/teacherGuide.ts`
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.tsx`
- Modify: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.css`
- Test: `/Users/kimhongnyeon/Dev/codex/digital-color-mixing-lab/src/App.test.tsx`

- [ ] **Step 1: Add a failing teacher guide test**

Add:

```tsx
it('shows a teacher guide with standards and lesson prompts', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: '교사용 활용 카드' })).toBeVisible();
  expect(screen.getByText('[4미01-02]')).toBeVisible();
  expect(screen.getByText('[6과08-01]')).toBeVisible();
  expect(screen.getByText(/어떤 색을 더 넣으면 느낌이 달라질까요/)).toBeVisible();
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run App tests. Expected: FAIL because teacher guide content does not exist.

- [ ] **Step 3: Create `teacherGuide.ts`**

Create:

```ts
export const teacherGuide = {
  standards: [
    '[4미01-02]',
    '[6과08-01]'
  ],
  flow: ['색 방울을 하나씩 추가하기', '결과 색과 비율 읽기', '느낌 기록하기', '물감과 빛 모드 비교하기'],
  prompts: [
    '어떤 색을 더 넣으면 느낌이 달라질까요?',
    '물감 모드와 빛 모드의 결과가 왜 다르게 보일까요?'
  ]
};
```

- [ ] **Step 4: Render the teacher guide**

Import `teacherGuide` and add a new `section.panel.teacher-panel` after the lab grid:

```tsx
<section className="panel teacher-panel" aria-labelledby="teacher-guide-title">
  <h2 id="teacher-guide-title">교사용 활용 카드</h2>
  ...
</section>
```

Render standards, flow, and prompts as lists.

- [ ] **Step 5: Style teacher panel**

Use a full-width band under the tool:

```css
.teacher-panel {
  width: min(1180px, 100%);
  margin: 18px auto 0;
}
```

- [ ] **Step 6: Verify**

Run App tests. Expected: PASS.

---

### Task 4: Final Verification And Publish Prep

**Files:**
- Modify only if verification reveals issues.

- [ ] **Step 1: Run full tests**

Run:

```bash
/Users/kimhongnyeon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/vitest/vitest.mjs run
```

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run:

```bash
/Users/kimhongnyeon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/typescript/bin/tsc -b
/Users/kimhongnyeon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/vite/bin/vite.js build
```

Expected: TypeScript and Vite production build pass.

- [ ] **Step 3: Review git diff**

Run:

```bash
git status --short
git diff --check
```

Expected: only intended source/docs files changed and whitespace check passes.

- [ ] **Step 4: Commit**

Run:

```bash
git add docs/superpowers/plans/2026-05-05-learning-missions-export-teacher-guide.md src/App.tsx src/App.css src/App.test.tsx src/data/challenges.ts src/data/teacherGuide.ts
git commit -m "feat: add guided missions and classroom exports"
```

Expected: commit succeeds.

## Self-Review

- Spec coverage: Mission mode, observation-card export, and teacher guide are each mapped to a task and a test.
- Placeholder scan: No placeholder steps remain; every behavior has exact copy or exact commands.
- Type consistency: `Challenge`, `teacherGuide`, `observationCard`, and mission state names are introduced before use.
- Scope check: This plan intentionally avoids clipboard APIs, PNG export, persistence, analytics, accounts, and new dependencies.
