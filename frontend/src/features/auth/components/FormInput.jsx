import React, { forwardRef } from 'react';

/**
 * FormInput — reusable controlled input with label, error state,
 * and optional right adornment (e.g. password toggle button).
 * Styled with Tailwind v4 utility classes.
 */
const FormInput = forwardRef(function FormInput(
  {
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    disabled,
    autoComplete,
    adornment,
    inputProps = {},
  },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <label
        htmlFor={id}
        className="text-[13px] font-medium text-[#111] tracking-tight"
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative flex items-center">
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={[
            'w-full h-[52px] px-4 text-[15px] font-normal text-[#111] rounded-[11px] border outline-none transition-all duration-[180ms]',
            'placeholder:text-[#BBBBBB]',
            'focus:ring-[3px]',
            adornment ? 'pr-12' : '',
            error
              ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
              : 'border-[#E5E5E5] bg-white hover:border-[#CCCCCC] focus:border-[#111] focus:ring-black/[0.06]',
            disabled ? 'opacity-50 cursor-not-allowed bg-[#F5F5F5]' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...inputProps}
        />
        {adornment && adornment}
      </div>

      {/* Field error */}
      {error && (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1.5 text-[12px] text-red-600 mt-0.5"
          role="alert"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

export default FormInput;
