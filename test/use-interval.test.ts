import { renderHook } from '@testing-library/react-hooks';

import { useInterval } from '../src';

describe('useInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers('legacy');
  });
  afterEach(() => {
    jest.clearAllTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('should init hook with default delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback));
    expect(result.current).toBeUndefined();

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 0);
    callback.mockRestore();
  });

  it('should init hook with custom delay', () => {
    jest.useFakeTimers('legacy');
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 5000));

    expect(result.current).toBeUndefined();
    jest.advanceTimersByTime(5000);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 5000);
  });

  it('should init hook without delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, null));

    expect(result.current).toBeUndefined();
    expect(setInterval).not.toHaveBeenCalled();
  });

  it('should repeatedly calls provided callback with a fixed time delay between each call', () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, 200));
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(199);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersToNextTimer();
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersToNextTimer(3);
    expect(callback).toHaveBeenCalledTimes(5);
  });

  it('should clear interval on unmount', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useInterval(callback, 200));
    const initialTimerCount = jest.getTimerCount();
    expect(clearInterval).not.toHaveBeenCalled();

    unmount();

    expect(clearInterval).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(initialTimerCount - 1);
  });

  it('should handle new interval when delay is updated', () => {
    const callback = jest.fn();
    let delay = 200;
    const { rerender } = renderHook(() => useInterval(callback, delay));
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(1);

    delay = 500;
    rerender();

    jest.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should clear pending interval when delay is updated', () => {
    const callback = jest.fn();
    let delay = 2000;
    const { rerender } = renderHook(() => useInterval(callback, delay));
    expect(clearInterval).not.toHaveBeenCalled();
    const initialTimerCount = jest.getTimerCount();

    delay = 500;
    rerender();

    expect(clearInterval).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(initialTimerCount);
  });
});
