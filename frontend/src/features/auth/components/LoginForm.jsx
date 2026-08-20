import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import FormInput from "./FormInput";
import { useAuth } from "../services/hook/useAuth";
/* ── Validation ──────────────────────────────────────── */
function validateField(name, value) {
  switch (name) {
    case "email":
      if (!value.trim()) return "Email address is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return "Enter a valid email address.";
      return "";
    case "password":
      if (!value) return "Password is required.";
      if (value.length < 8) return "Password must be at least 8 characters.";
      return "";
    default:
      return "";
  }
}

function validateAll(fields) {
  return {
    email: validateField("email", fields.email),
    password: validateField("password", fields.password),
  };
}

/* ── Icons ───────────────────────────────────────────── */
const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ── LoginForm ───────────────────────────────────────── */
function LoginForm() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const [fields, setFields] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = useCallback(
    (name, value) => {
      setFields((prev) => ({ ...prev, [name]: value }));
      setGlobalError("");
      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
      }
    },
    [touched],
  );

  const handleBlur = useCallback((name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setTouched({ email: true, password: true });
    const validationErrors = validateAll(fields);
    setErrors(validationErrors);
    if (Object.values(validationErrors).some(Boolean)) return;

    setIsLoading(true);
    try {
      await handleLogin({
        email: fields.email.trim().toLowerCase(),
        password: fields.password,
      });
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Invalid credentials. Please try again.";
      setGlobalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Success State ─────────────────────────────────── */
  if (isSuccess) {
    return (
      <div
        className="flex flex-col items-center text-center py-10 animate-[fadeIn_0.4s_ease-out]"
        role="status"
        aria-live="polite"
      >
        <div className="w-16 h-16 rounded-full bg-[#111] flex items-center justify-center mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-[22px] font-semibold tracking-tight text-[#111] mb-2">
          Welcome back!
        </h2>
        <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
          Signed in successfully. Redirecting you now…
        </p>
      </div>
    );
  }

  /* ── Form View ─────────────────────────────────────── */
  return (
    <>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111] mb-2 leading-[1.15]">
          Welcome back
        </h1>
        <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
          Enter your details to access your account.
        </p>
      </header>

      {/* Global error banner */}
      {globalError && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 mb-5 rounded-[11px] bg-red-50 border border-red-200 text-[13.5px] text-red-700 leading-snug animate-[slideDown_0.2s_ease-out]"
          role="alert"
          aria-live="assertive"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="shrink-0 mt-0.5"
          >
            <circle
              cx="8"
              cy="8"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 4.5v4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
          </svg>
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-label="Login form">
        <div className="flex flex-col gap-4 mb-5">
          {/* Email */}
          <FormInput
            id="login-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={fields.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={(e) => handleBlur("email", e.target.value)}
            error={touched.email ? errors.email : ""}
            disabled={isLoading}
            autoComplete="email"
            inputProps={{ name: "email", inputMode: "email" }}
          />

          {/* Password */}
          <FormInput
            id="login-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={fields.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={(e) => handleBlur("password", e.target.value)}
            error={touched.password ? errors.password : ""}
            disabled={isLoading}
            autoComplete="current-password"
            inputProps={{ name: "password" }}
            adornment={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#6B6B6B] hover:text-[#111] hover:bg-black/[0.04] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#111] focus-visible:outline-offset-1"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full h-[52px] flex items-center justify-center gap-2 bg-[#111] text-white text-[15px] font-semibold tracking-tight rounded-[11px] mb-5 transition-all duration-[180ms] hover:bg-[#2A2A2A] active:scale-[0.99] disabled:opacity-55 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#111] focus-visible:outline-offset-2 cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin w-[18px] h-[18px] text-white/60"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="40"
                  strokeDashoffset="10"
                />
              </svg>
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>

        {/* Continue with Google */}
        <div className="text-center mb-4 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-300">
          <a
            href="/api/auth/google"
            className="inline-flex items-center justify-center gap-2 text-[#111] font-semibold hover:opacity-60 transition-opacity duration-150 underline-offset-2 hover:underline cursor-pointer"
          >
            <span>Continue with Google</span>

            <img className="h-5 w-5" src="/google.svg" alt="Google" />
          </a>
        </div>

        {/* Sign up link */}
        <p className="text-center text-[14px] text-[#6B6B6B]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-[#111] font-semibold hover:opacity-60 transition-opacity duration-150 underline-offset-2 hover:underline cursor-pointer"
          >
            Create account
          </button>
        </p>
      </form>
    </>
  );
}

export default LoginForm;
