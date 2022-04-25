import { renderHook } from '@testing-library/react-hooks';
import { useThrottle } from '../src';

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers('legacy');
  });
  afterEach(() => {
    jest.clearAllTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(useThrottle).toBeDefined();
  });

  it('should return the value that the given function return', () => {
    const callback = jest.fn((props) => props);
    const hook = renderHook((props) => useThrottle(callback, 500, [props]), {
      initialProps: 100,
    });

    expect(hook.result.current).toBe(100);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should has same value if time is advanced less than the given time', () => {
    const callback = jest.fn((props) => props);
    const hook = renderHook((props) => useThrottle(callback, 100, [props]), {
      initialProps: 10,
    });

    expect(hook.result.current).toBe(10);
    expect(callback).toHaveBeenCalledTimes(1);

    hook.rerender(20);
    jest.advanceTimersByTime(50);

    expect(hook.result.current).toBe(10);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should update the value after the given time when arguments change', (done) => {
    const callback = jest.fn((props) => props);
    const hook = renderHook((props) => useThrottle(callback, 100, [props]), {
      initialProps: 10,
    });

    expect(hook.result.current).toBe(10);
    expect(callback).toHaveBeenCalledTimes(1);

    hook.rerender(20);
    hook.waitForNextUpdate().then(() => {
      expect(hook.result.current).toBe(20);
      expect(callback).toHaveBeenCalledTimes(2);
      done();
    });
    jest.advanceTimersByTime(100);
  });

  it('should use the default ms value when missing', (done) => {
    const callback = jest.fn((props) => props);
    const hook = renderHook((props) => useThrottle(callback, 100, [props]), {
      initialProps: 10,
    });

    expect(hook.result.current).toBe(10);
    expect(callback).toHaveBeenCalledTimes(1);

    hook.rerender(20);
    hook.waitForNextUpdate().then(() => {
      expect(hook.result.current).toBe(20);
      expect(callback).toHaveBeenCalledTimes(2);
      done();
    });
    jest.advanceTimersByTime(200);
  });

  it('should not exist timer when arguments did not update after the given time', () => {
    const callback = jest.fn((props) => props);
    const hook = renderHook((props) => useThrottle(callback, 100, [props]), {
      initialProps: 10,
    });

    expect(hook.result.current).toBe(10);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(2);

    jest.advanceTimersByTime(100);
  });

  it('should cancel timeout on unmount', () => {
    const callback = jest.fn((props) => props);
    const hook = renderHook((props) => useThrottle(callback, 100, [props]), {
      initialProps: 10,
    });

    expect(hook.result.current).toBe(10);
    expect(callback).toHaveBeenCalledTimes(1);

    hook.rerender(20);
    hook.unmount();

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
