import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import FormInput from './FormInput';
import AccountTypeSelector from './AccountTypeSelector';
import { useAuth } from '../services/hook/useAuth';

/* ── Validation ──────────────────────────────────────── */
function validateField(name, value) {
  switch (name) {
    case 'fullname':
      if (!value.trim()) return 'Full name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    case 'email':
      if (!value.trim()) return 'Email address is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return 'Enter a valid email address.';
      return '';
    case 'contact':
      if (!value.trim()) return 'Contact number is required.';
      if (!/^\d{10}$/.test(value.trim()))
        return 'Enter a valid 10-digit contact number.';
      return '';
    case 'password':
      if (!value) return 'Password is required.';
      if (value.length < 8) return 'Password must be at least 8 characters.';
      return '';
    default:
      return '';
  }
}

function validateAll(fields) {
  return {
    fullname: validateField('fullname', fields.fullname),
    email:    validateField('email',    fields.email),
    contact:  validateField('contact',  fields.contact),
    password: validateField('password', fields.password),
  };
}

/* ── Icons ───────────────────────────────────────────── */
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ── RegisterForm ────────────────────────────────────── */
function RegisterForm() {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();

  const [fields, setFields] = useState({ fullname: '', email: '', contact: '', password: '' });
  const [errors, setErrors]   = useState({ fullname: '', email: '', contact: '', password: '' });
  const [touched, setTouched] = useState({ fullname: false, email: false, contact: false, password: false });
  const [accountType, setAccountType] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [isSuccess, setIsSuccess]   = useState(false);

  const handleChange = useCallback((name, value) => {
    setFields(prev => ({ ...prev, [name]: value }));
    setGlobalError('');
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  }, [touched]);

  const handleBlur = useCallback((name, value) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setTouched({ fullname: true, email: true, contact: true, password: true });
    const validationErrors = validateAll(fields);
    setErrors(validationErrors);
    if (Object.values(validationErrors).some(Boolean)) return;

    setIsLoading(true);
    try {
      await handleRegister({
        fullname: fields.fullname.trim(),
        email:    fields.email.trim().toLowerCase(),
        contact:  fields.contact.trim(),
        password: fields.password,
        isSeller: accountType === 'seller',
      });
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        'Something went wrong. Please try again.';
      setGlobalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Success ─────────────────────────────────────── */
  if (isSuccess) {
    return (
      <div
        className="flex flex-col items-center text-center py-10 animate-[fadeIn_0.4s_ease-out]"
        role="status"
        aria-live="polite"
      >
        <div className="w-16 h-16 rounded-full bg-[#111] flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="text-[22px] font-semibold tracking-tight text-[#111] mb-2">
          You&apos;re all set!
        </h2>
        <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
          Your account has been created. Redirecting you now…
        </p>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────── */
  return (
    <>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111] mb-2 leading-[1.15]">
          Create your account
        </h1>
        <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
          Join us and get started in just a few steps.
        </p>
      </header>

      {/* Global error banner */}
      {globalError && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 mb-5 rounded-[11px] bg-red-50 border border-red-200 text-[13.5px] text-red-700 leading-snug animate-[slideDown_0.2s_ease-out]"
          role="alert"
          aria-live="assertive"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 4.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
          </svg>
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
        <div className="flex flex-col gap-4 mb-5">
          {/* Full Name */}
          <FormInput
            id="reg-fullname"
            label="Full name"
            type="text"
            placeholder="Enter your full name"
            value={fields.fullname}
            onChange={e => handleChange('fullname', e.target.value)}
            onBlur={e  => handleBlur('fullname',  e.target.value)}
            error={touched.fullname ? errors.fullname : ''}
            disabled={isLoading}
            autoComplete="name"
            inputProps={{ name: 'fullname' }}
          />

          {/* Email */}
          <FormInput
            id="reg-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={fields.email}
            onChange={e => handleChange('email', e.target.value)}
            onBlur={e  => handleBlur('email',  e.target.value)}
            error={touched.email ? errors.email : ''}
            disabled={isLoading}
            autoComplete="email"
            inputProps={{ name: 'email', inputMode: 'email' }}
          />

          {/* Contact */}
          <FormInput
            id="reg-contact"
            label="Contact number"
            type="tel"
            placeholder="Enter your contact number"
            value={fields.contact}
            onChange={e => handleChange('contact', e.target.value)}
            onBlur={e  => handleBlur('contact',  e.target.value)}
            error={touched.contact ? errors.contact : ''}
            disabled={isLoading}
            autoComplete="tel"
            inputProps={{ name: 'contact', inputMode: 'numeric', maxLength: 10 }}
          />

          {/* Password */}
          <FormInput
            id="reg-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={fields.password}
            onChange={e => handleChange('password', e.target.value)}
            onBlur={e  => handleBlur('password',  e.target.value)}
            error={touched.password ? errors.password : ''}
            disabled={isLoading}
            autoComplete="new-password"
            inputProps={{ name: 'password' }}
            adornment={
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#6B6B6B] hover:text-[#111] hover:bg-black/[0.04] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#111] focus-visible:outline-offset-1"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />
        </div>

        {/* Account type selector */}
        <AccountTypeSelector
          value={accountType}
          onChange={setAccountType}
          disabled={isLoading}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full h-[52px] flex items-center justify-center gap-2 bg-[#111] text-white text-[15px] font-semibold tracking-tight rounded-[11px] mb-5 transition-all duration-[180ms] hover:bg-[#2A2A2A] active:scale-[0.99] disabled:opacity-55 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#111] focus-visible:outline-offset-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin w-[18px] h-[18px] text-white/60"
                viewBox="0 0 24 24" fill="none" aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
              </svg>
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </button>

        {/* Sign in */}
        <p className="text-center text-[14px] text-[#6B6B6B]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[#111] font-semibold hover:opacity-60 transition-opacity duration-150 underline-offset-2 hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </form>
    </>
  );
}

export default RegisterForm;
