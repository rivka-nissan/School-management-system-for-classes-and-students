import { describe, it, expect } from 'vitest';

function getQueryWrapperState(isLoading: boolean, isError: boolean): 'loading' | 'error' | 'content' {
  if (isLoading) return 'loading';
  if (isError) return 'error';
  return 'content';
}

describe('QueryWrapper logic', () => {
  it('returns loading state when isLoading is true', () => {
    expect(getQueryWrapperState(true, false)).toBe('loading');
  });

  it('returns error state when isError is true', () => {
    expect(getQueryWrapperState(false, true)).toBe('error');
  });

  it('returns content state when not loading and no error', () => {
    expect(getQueryWrapperState(false, false)).toBe('content');
  });

  it('loading takes priority over error', () => {
    expect(getQueryWrapperState(true, true)).toBe('loading');
  });
});
