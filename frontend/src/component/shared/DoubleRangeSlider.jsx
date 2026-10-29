import { Range } from 'react-range';

export function DoubleRangeSlider({ label, min, max, values, onChange, idPrefix }) {
  return (
    <div className="flex flex-col items-start justify-between gap-2 w-full">
      <label htmlFor={`${idPrefix}Min`} className="text-lg">{label}</label>
      <div className="w-full" aria-label={label}>
        <Range
          step={1}
          min={min}
          max={max}
          values={values}
          onChange={onChange}
          renderTrack={({ props, children }) => {
            const { key, ref, style, ...rest } = props;
            return (
              <div
                key={key}
                ref={ref}
                {...rest}
                style={{
                  ...style,
                  height: '8px',
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  position: 'relative',
                }}
              >
                {children}
              </div>
            );
          }}
          renderThumb={({ index, props }) => {
            const { key, ref, style, ...rest } = props;
            return (
              <div
                key={key}
                ref={ref}
                {...rest}
                style={{
                  ...style,
                  height: '16px',
                  width: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#A8D08D',
                  transform: 'translate(-50%, -50%)',
                  position: 'absolute',
                }}
              />
            );
          }}
        />
      </div>
      <div className="flex items-center justify-between w-full gap-2">
        <input
          id={`${idPrefix}Min`}
          name={`${idPrefix}Min`}
          type="number"
          min={min}
          max={values[1]}
          value={values[0]}
          onChange={e => onChange([Math.min(Number(e.target.value), values[1]), values[1]])}
          className="w-full p-2 rounded"
        />
        <span className="text-lg">-</span>
        <input
          id={`${idPrefix}Max`}
          name={`${idPrefix}Max`}
          type="number"
          min={values[0]}
          max={max}
          value={values[1]}
          onChange={e => onChange([values[0], Math.max(Number(e.target.value), values[0])])}
          className="w-full border p-2 rounded"
        />
      </div>
    </div>
  );
}
