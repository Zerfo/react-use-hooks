import * as React from 'react';

import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';

import { useDebounce } from '../src';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });

  it('will call callback when timeout is called', () => {
    const callback = jest.fn();

    const Component = () => {
      const debounced = useDebounce(callback, 1000);
      debounced();
      return null;
    };

    render(<Component />);

    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will call leading callback as well as next debounced call', () => {
    const callback = jest.fn();

    const Component = () => {
      const debounced = useDebounce(callback, 1000, true);
      debounced();
      debounced();
      return null;
    };
    render(<Component />);

    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will call three callbacks if no debounced callbacks are pending', () => {
    const callback = jest.fn();

    const Component = () => {
      const debounced = useDebounce(callback, 1000, true);
      debounced();
      debounced();
      setTimeout(() => debounced(), 1001);
      return null;
    };
    render(<Component />);

    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.advanceTimersByTime(1001);
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('subsequent calls to the debounced function `debounced.callback` return the result of the last func invocation', () => {
    const callback = jest.fn(() => 42);

    let callbackCache;
    const Component = () => {
      const debounced = useDebounce(callback, 1000);
      callbackCache = debounced;
      return null;
    };
    render(<Component />);

    const subsequentResult = callbackCache();
    expect(callback.mock.calls.length).toBe(0);
    expect(subsequentResult).toBeUndefined();

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(1);
    expect(callback.mock.results[0].value).toBe(42);
  });

  it("won't call both on the leading edge and on the trailing edge if leading and trailing are set up to true and function call is only once", () => {
    const callback = jest.fn();

    const Component = () => {
      const debounced = useDebounce(callback, 1000, true);
      debounced();
      return null;
    };
    render(<Component />);

    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.runAllTimers();
    });

    expect(callback.mock.calls.length).toBe(1);
  });

  it('will call callback only with the latest params', () => {
    const callback = jest.fn((param) => {
      expect(param).toBe('Right param');
    });

    const Component = () => {
      const debounced = useDebounce(callback, 1000);
      debounced('Wrong param');
      setTimeout(() => debounced('Right param'), 500);
      return null;
    };
    render(<Component />);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback.mock.calls.length).toBe(1);
  });
});
