import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Sanity checks to diagnose React instance and MemoryRouter behavior

describe('react sanity', () => {
  it('React.useRef is available', () => {
    expect(typeof React.useRef).toBe('function');
  });

  it('renders MemoryRouter without crashing', () => {
    const { unmount } = render(
      <MemoryRouter>
        <div>ok</div>
      </MemoryRouter>
    );
    unmount();
    expect(true).toBe(true);
  });
});