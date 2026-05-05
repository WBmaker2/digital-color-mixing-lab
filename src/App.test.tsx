import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the color mixing lab shell', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: '색깔 혼합 실험실'
      })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: '물감' })).toBeVisible();
    expect(screen.getByRole('button', { name: '빛' })).toBeVisible();
    expect(screen.getByRole('button', { name: /빨강 한 방울 추가/ })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /이 색의 이름이나 느낌/ })).toBeVisible();
  });

  it('updates the paint mixture when students add red and yellow drops', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /빨강 한 방울 추가/ }));
    await user.click(screen.getByRole('button', { name: /노랑 한 방울 추가/ }));

    const resultPanel = screen.getByRole('region', { name: '현재 섞인 색' });
    expect(within(resultPanel).getByText('주황')).toBeVisible();
    expect(within(resultPanel).getByText('빨강 1 : 노랑 1 : 파랑 0')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(
      '현재 결과: 주황. 총 2방울, 비율: 빨강 1 : 노랑 1 : 파랑 0.'
    );
  });

  it('switches to light mode and shows white light when all light colors are active', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '빛' }));
    await user.click(screen.getByRole('button', { name: /빨강빛 한 방울 추가/ }));
    await user.click(screen.getByRole('button', { name: /초록빛 한 방울 추가/ }));
    await user.click(screen.getByRole('button', { name: /파랑빛 한 방울 추가/ }));

    const resultPanel = screen.getByRole('region', { name: '현재 섞인 색' });
    expect(within(resultPanel).getByText('하얀빛')).toBeVisible();
    expect(within(resultPanel).getByText('빨강빛 1 : 초록빛 1 : 파랑빛 1')).toBeVisible();
  });

  it('lets students write and clear an observation note', async () => {
    const user = userEvent.setup();

    render(<App />);

    const note = screen.getByRole('textbox', { name: /이 색의 이름이나 느낌/ });
    await user.type(note, '해 질 무렵 하늘색 같아요.');
    expect(note).toHaveValue('해 질 무렵 하늘색 같아요.');

    await user.click(screen.getByRole('button', { name: /다시 섞기/ }));
    expect(note).toHaveValue('');
  });

  it('shows mission feedback when the current mix matches the selected mission', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /따뜻한 주황 만들기/ }));

    expect(screen.getByText('미션 성공')).toBeVisible();
    expect(screen.getByText(/빨강과 노랑이 만나 주황이 되었어요/)).toBeVisible();
  });

  it('generates an observation card text from the current mix and note', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /빨강 한 방울 추가/ }));
    await user.click(screen.getByRole('button', { name: /노랑 한 방울 추가/ }));
    await user.type(screen.getByRole('textbox', { name: /이 색의 이름이나 느낌/ }), '따뜻한 귤색 같아요.');
    await user.click(screen.getByRole('button', { name: '관찰 카드 만들기' }));

    const observationCard = screen.getByLabelText('관찰 카드');
    expect(observationCard).toHaveTextContent('색 이름: 주황');
    expect(observationCard).toHaveTextContent('비율: 빨강 1 : 노랑 1 : 파랑 0');
    expect(observationCard).toHaveTextContent('내 느낌: 따뜻한 귤색 같아요.');
  });

  it('shows a teacher guide with standards and lesson prompts', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '교사용 활용 카드' })).toBeVisible();
    expect(screen.getByText('[4미01-02]')).toBeVisible();
    expect(screen.getByText('[6과08-01]')).toBeVisible();
    expect(screen.getByText(/어떤 색을 더 넣으면 느낌이 달라질까요/)).toBeVisible();
  });
});
