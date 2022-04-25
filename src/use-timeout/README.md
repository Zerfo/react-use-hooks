# `useTimeout`

Calls given function after specified amount of milliseconds.

Several thing about it's work:
- does not re-render component;
- automatically reset timeout on delay change;
- timeout will NOT be reset on function change. It will be called within the timeout.

## Usage

```jsx
import * as React from 'react';

import { useTimeout } from 'react-use-hooks';

const Demo = () => {
  const [state, setState] = React.useState('Not called yet');
  const func = () => {
    setState(`called at ${Date.now()}`);
  }

  useTimeout(func, 5000);

  return (
    <div>
      <div>{state}</div>
    </div>
  );
};
```

## Reference

- **`func`**_`: Function`_ - function that will be called;
- **`ms`**_`: number`_ - delay in milliseconds;
