import React from 'react';

/**
 * AccountTypeSelector — segmented card-style radio group.
 * Styled with Tailwind v4 utility classes.
 */
const ACCOUNT_TYPES = [
  { value: 'user',   label: 'User',   description: 'Personal account' },
  { value: 'seller', label: 'Seller', description: 'Business account' },
];

function AccountTypeSelector({ value, onChange, disabled }) {
  return (
    <div className="mb-6">
      <span
        id="account-type-label"
        className="block text-[13px] font-medium text-[#111] tracking-tight mb-2"
      >
        I am a
      </span>

      <div
        className="grid grid-cols-2 gap-2.5"
        role="radiogroup"
        aria-labelledby="account-type-label"
      >
        {ACCOUNT_TYPES.map((option) => {
          const isSelected = value === option.value;

          return (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="accountType"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                disabled={disabled}
                aria-label={`${option.label} — ${option.description}`}
                className="sr-only"
              />
              <div
                className={[
                  'flex flex-col gap-0.5 px-4 py-3.5 rounded-[11px] border-[1.5px] transition-all duration-[180ms] select-none',
                  'focus-within:outline-2 focus-within:outline-[#111] focus-within:outline-offset-2',
                  isSelected
                    ? 'border-[#111] bg-[#F5F5F5]'
                    : 'border-[#E5E5E5] bg-white hover:border-[#CCCCCC] hover:bg-[#FAFAFA]',
                  disabled ? 'opacity-50 cursor-not-allowed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="text-[14px] font-semibold text-[#111] tracking-tight">
                  {option.label}
                </span>
                <span className="text-[12px] font-normal text-[#6B6B6B]">
                  {option.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default AccountTypeSelector;
