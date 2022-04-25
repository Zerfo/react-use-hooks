import { renderHook } from '@testing-library/react-hooks';

import { useUnmount } from '../src';

describe('useUnmount', () => {
  it('should be defined', () => {
    expect(useUnmount).toBeDefined();
  });

  it('should not call provided callback on mount', () => {
    const callback = jest.fn();
    renderHook(() => useUnmount(callback));
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call provided callback on re-renders', () => {
    const callback = jest.fn();
    const hook = renderHook(() => useUnmount(callback));

    hook.rerender();
    hook.rerender();
    hook.rerender();
    hook.rerender();

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call provided callback on unmount', () => {
    const callback = jest.fn();
    const hook = renderHook(() => useUnmount(callback));

    hook.unmount();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call provided callback if is has been changed', () => {
    const callback = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    const hook = renderHook((cb) => useUnmount(cb), { initialProps: callback });

    hook.rerender(callback2);
    hook.rerender(callback3);
    hook.unmount();

    expect(callback).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
    expect(callback3).toHaveBeenCalledTimes(1);
  });
});
