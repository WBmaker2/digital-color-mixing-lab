import { render, screen } from '@testing-library/react';
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
    expect(screen.getByRole('button', { name: '빨강 한 방울 추가' })).toBeVisible();
    expect(screen.getByLabelText('이 색의 이름이나 느낌')).toBeVisible();
    expect(screen.getByText('따뜻한 주황 만들기')).toBeVisible();
    expect(screen.getByText('풀잎 초록 만들기')).toBeVisible();
    expect(screen.getByText('하얀빛 발견하기')).toBeVisible();
  });
});
