# `useDebounce`

React hook that delays invoking a function until after wait milliseconds have elapsed since the last time the debounced function was invoked.

The third argument is the value on which the timer rollback depends.

## Usage

**Variant 1.** Use the useDebounce hook and monitor the change in the value variable in the component body through the hook.

``` jsx
import { useDebounce } from 'react-use-hooks';

function valueLogging(value) {
  console.log(`Request processed. Value: ${value}`);
}

export default function RangeSlider() {
  const classes = useStyles();
  const [value, setValue] = React.useState([20, 37]);
  const [changedByUser, setChangedByUser] = React.useState(false);

  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    if (changedByUser) {
      valueLogging(debouncedValue);
    }
  }, [debouncedValue]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (!changedByUser) {
        setChangedByUser(true);
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Temperature range
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}
```

**Variant 2.** Postpone calling valueLogging() right inside handleChange().

``` jsx
import { useDebounce } from 'react-use-hooks';

export default function RangeSlider() {
  const classes = useStyles();
  const [value, setValue] = React.useState([20, 37]);

  const debouncedValueLogging = useDebounce(valueLogging, 300);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    debouncedValueLogging(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Temperature range
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}
```