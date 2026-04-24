import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the temporary lab shell', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: '디지털 팔레트: 색깔 혼합 실험실'
      })
    ).toBeVisible();
    expect(screen.getByText('색깔 실험실을 준비하고 있습니다.')).toBeVisible();
  });
});
