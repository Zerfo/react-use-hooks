import { act, renderHook } from '@testing-library/react-hooks';

import { useTimeout } from '../src';

describe('useTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers('legacy');
  });
  afterEach(() => {
    jest.clearAllTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('should call passed function after given amount of time', () => {
    const callback = jest.fn();
    renderHook(() => useTimeout(callback, 1000));

    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel function call on unmount', () => {
    const callback = jest.fn();
    const hook = renderHook(() => useTimeout(callback, 1000));

    expect(callback).not.toHaveBeenCalled();
    hook.unmount();
    jest.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should reset timeout on delay change', () => {
    const callback = jest.fn();
    const { rerender } = renderHook(({ cb, delay }) => useTimeout(cb, delay), {
      initialProps: { cb: callback, delay: 1000 },
    });

    expect(callback).not.toHaveBeenCalled();
    rerender({ cb: callback, delay: 500 });

    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should NOT reset timeout on function change', () => {
    const callback = jest.fn();
    const callback2 = jest.fn();
    const { rerender } = renderHook(({ cb, delay }) => useTimeout(cb, delay), {
      initialProps: { cb: callback, delay: 1000 },
    });

    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();

    rerender({ delay: 1000, cb: callback2 });

    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
