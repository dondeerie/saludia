import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategoryScore from '../../components/CategoryScore';

describe('CategoryScore', () => {
  it('renders the component', () => {
    render(<CategoryScore category="Test" score={75} isDarkMode={false} />);
    expect(screen.getByText('Test')).toBeTruthy();
    expect(screen.getByText('75%')).toBeTruthy();
  });

  it('applies correct color for high score', () => {
    render(<CategoryScore category="Test" score={75} isDarkMode={false} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.className).toContain('bg-green-500');
  });

  it('applies correct color for medium score', () => {
    render(<CategoryScore category="Test" score={50} isDarkMode={false} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.className).toContain('bg-yellow-500');
  });

  it('applies correct color for low score', () => {
    render(<CategoryScore category="Test" score={30} isDarkMode={false} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.className).toContain('bg-red-500');
  });

  it('applies dark mode styles', () => {
    render(<CategoryScore category="Test" score={75} isDarkMode={true} />);
    const categoryText = screen.getByText('Test');
    expect(categoryText.className).toContain('text-gray-200');
  });

  it('sets progress bar width correctly', () => {
    render(<CategoryScore category="Test" score={60} isDarkMode={false} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.style.width).toBe('60%');
  });

  it('handles edge case of score = 0', () => {
    render(<CategoryScore category="Test" score={0} isDarkMode={false} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.style.width).toBe('0%');
    expect(progressBar.className).toContain('bg-red-500');
    expect(screen.getByText('0%')).toBeTruthy();
  });

  it('handles edge case of score = 100', () => {
    render(<CategoryScore category="Test" score={100} isDarkMode={false} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.style.width).toBe('100%');
    expect(progressBar.className).toContain('bg-green-500');
    expect(screen.getByText('100%')).toBeTruthy();
  });
});