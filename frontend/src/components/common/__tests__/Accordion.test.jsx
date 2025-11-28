import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../tests/test-utils';
import Accordion from '../Accordion';

describe('Accordion', () => {
  const mockItems = [
    {
      question: 'What are your hours?',
      answer: 'We are open Monday-Friday 8AM-6PM'
    },
    {
      question: 'Do you offer warranties?',
      answer: 'Yes, we offer a 12-month warranty on all repairs'
    }
  ];

  it('renders all questions', () => {
    render(<Accordion items={mockItems} />);

    expect(screen.getByText('What are your hours?')).toBeInTheDocument();
    expect(screen.getByText('Do you offer warranties?')).toBeInTheDocument();
  });

  it('answers are hidden by default', () => {
    render(<Accordion items={mockItems} />);

    expect(screen.queryByText('We are open Monday-Friday 8AM-6PM')).not.toBeVisible();
    expect(screen.queryByText('Yes, we offer a 12-month warranty on all repairs')).not.toBeVisible();
  });

  it('shows answer when question is clicked', async () => {
    const user = userEvent.setup();
    render(<Accordion items={mockItems} />);

    const question = screen.getByText('What are your hours?');
    await user.click(question);

    expect(screen.getByText('We are open Monday-Friday 8AM-6PM')).toBeVisible();
  });

  it('hides answer when clicked again (single mode)', async () => {
    const user = userEvent.setup();
    render(<Accordion items={mockItems} allowMultiple={false} />);

    const question = screen.getByText('What are your hours?');
    await user.click(question);
    expect(screen.getByText('We are open Monday-Friday 8AM-6PM')).toBeVisible();

    await user.click(question);
    expect(screen.queryByText('We are open Monday-Friday 8AM-6PM')).not.toBeVisible();
  });

  it('closes other items when opening new one in single mode', async () => {
    const user = userEvent.setup();
    render(<Accordion items={mockItems} allowMultiple={false} />);

    const question1 = screen.getByText('What are your hours?');
    const question2 = screen.getByText('Do you offer warranties?');

    await user.click(question1);
    expect(screen.getByText('We are open Monday-Friday 8AM-6PM')).toBeVisible();

    await user.click(question2);
    expect(screen.queryByText('We are open Monday-Friday 8AM-6PM')).not.toBeVisible();
    expect(screen.getByText('Yes, we offer a 12-month warranty on all repairs')).toBeVisible();
  });

  it('allows multiple items open in allowMultiple mode', async () => {
    const user = userEvent.setup();
    render(<Accordion items={mockItems} allowMultiple={true} />);

    const question1 = screen.getByText('What are your hours?');
    const question2 = screen.getByText('Do you offer warranties?');

    await user.click(question1);
    await user.click(question2);

    expect(screen.getByText('We are open Monday-Friday 8AM-6PM')).toBeVisible();
    expect(screen.getByText('Yes, we offer a 12-month warranty on all repairs')).toBeVisible();
  });
});
