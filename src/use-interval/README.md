# `useInterval`

A declarative interval hook. The interval can be paused by setting the delay to `null`.

## Usage

```jsx
import * as React from 'react';
import { useInterval } from 'react-use-hooks';

const Demo = () => {
  const [count, setCount] = React.useState(0);
  const [delay, setDelay] = React.useState(1000);
  const [isRunning, toggleIsRunning] = useState(true);

  useInterval(
    () => {
      setCount(count + 1);
    },
    isRunning ? delay : null
  );

  return (
    <div>
      <div>
        delay: <input value={delay} onChange={event => setDelay(Number(event.target.value))} />
      </div>
      <h1>count: {count}</h1>
      <div>
        <button onClick={() => toggleIsRunning(!isRunning)}>{isRunning ? 'stop' : 'start'}</button>
      </div>
    </div>
  );
};
```

## Reference

```ts
useInterval(callback: Function, delay?: number | null)
```