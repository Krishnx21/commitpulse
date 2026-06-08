import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SocialsSection } from './SocialsSection';

const defaultProps = {
  selected: [],
  socialLinks: {},
  onSelectedChange: vi.fn(),
  onLinkChange: vi.fn(),
};

describe('SocialsSection Accessibility', () => {
  it('renders accessible tab buttons', () => {
    render(<SocialsSection {...defaultProps} />);

    expect(screen.getByRole('button', { name: /① pick platforms/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /② add links/i })).toBeInTheDocument();
  });

  it('allows keyboard navigation through primary controls', async () => {
    const user = userEvent.setup();

    render(<SocialsSection {...defaultProps} />);

    const sectionToggle = screen.getByRole('button', {
      name: /socials/i,
    });

    const pickPlatforms = screen.getByRole('button', {
      name: /① pick platforms/i,
    });

    const addLinks = screen.getByRole('button', {
      name: /② add links/i,
    });

    await user.tab();
    expect(sectionToggle).toHaveFocus();

    await user.tab();
    expect(pickPlatforms).toHaveFocus();

    await user.tab();
    expect(addLinks).toHaveFocus();
  });

  it('provides accessible search textbox with placeholder', () => {
    render(<SocialsSection {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/search platforms/i);

    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('ensures social icons expose accessible names through alt text', () => {
    render(<SocialsSection {...defaultProps} />);

    const images = screen.getAllByRole('img');

    images.forEach((img) => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('maintains logical heading and content structure', () => {
    render(<SocialsSection {...defaultProps} />);

    expect(screen.getByText(/socials/i)).toBeInTheDocument();
    expect(screen.getByText(/add links to your profiles/i)).toBeInTheDocument();
  });
});
