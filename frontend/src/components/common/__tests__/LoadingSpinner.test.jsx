import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../tests/test-utils';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('displays loading text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('has aria-label for accessibility', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByLabelText(/loading/i);
    expect(spinner).toBeInTheDocument();
  });
});
