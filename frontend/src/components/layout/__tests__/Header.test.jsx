import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../tests/test-utils';
import Header from '../Header';

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />);
    expect(screen.getByText('Auto Shop Demo')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /brands/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /coupons/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('renders phone number link', () => {
    render(<Header />);
    const phoneLink = screen.getByRole('link', { name: /555-123-4567/i });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute('href', 'tel:555-123-4567');
  });

  it('renders Get Quote button', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /get quote/i })).toBeInTheDocument();
  });

  it('shows mobile menu when hamburger is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const hamburger = screen.getByLabelText(/toggle menu/i);
    await user.click(hamburger);

    // Mobile menu should now be visible with navigation links
    const mobileNavLinks = screen.getAllByRole('link', { name: /home/i });
    expect(mobileNavLinks.length).toBeGreaterThan(1); // Desktop + Mobile
  });

  it('closes mobile menu when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const hamburger = screen.getByLabelText(/toggle menu/i);
    await user.click(hamburger);
    await user.click(hamburger); // Click again to close

    // Should only show desktop links
    const homeLinks = screen.getAllByRole('link', { name: /home/i });
    expect(homeLinks.length).toBe(1);
  });
});
