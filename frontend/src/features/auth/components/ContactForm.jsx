import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import FormInput from "./FormInput";
import { useAuth } from "../services/hook/useAuth";

/* ── Validation ──────────────────────────────────────── */
function validateContact(value) {
  if (!value.trim()) return "Contact number is required.";
  if (!/^\d{10}$/.test(value.trim()))
    return "Enter a valid 10-digit contact number.";
  return "";
}

/* ── ContactForm Component ───────────────────────────── */
function ContactForm({ initialUser }) {
  const navigate = useNavigate();
  const { handleUpdateContact } = useAuth();

  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = useCallback(
    (value) => {
      setContact(value);
      setGlobalError("");
      if (touched) {
        setError(validateContact(value));
      }
    },
    [touched],
  );

  const handleBlur = useCallback((value) => {
    setTouched(true);
    setError(validateContact(value));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setTouched(true);
    const validationError = validateContact(contact);
    setError(validationError);
    if (validationError) return;

    setIsLoading(true);
    try {
      await handleUpdateContact({
        contact: contact.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Failed to update contact number. Please try again.";
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
          Profile complete!
        </h2>
        <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
          Your contact number has been saved. Redirecting to your dashboard…
        </p>
      </div>
    );
  }

  /* ── Form View ─────────────────────────────────────── */
  return (
    <>
      {/* Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F0EE] text-[12px] font-medium text-[#555] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#111]"></span>
          <span>One Last Step</span>
        </div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111] mb-2 leading-[1.15]">
          Add your contact number
        </h1>
        <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
          {initialUser?.fullname
            ? `Welcome, ${initialUser.fullname}! `
            : "Welcome! "}
          Please provide your contact number for order updates and shipping alerts.
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

      <form onSubmit={handleSubmit} noValidate aria-label="Contact setup form">
        <div className="flex flex-col gap-4 mb-6">
          <FormInput
            id="contact-input"
            label="Phone / Mobile Number"
            type="tel"
            placeholder="10-digit mobile number"
            value={contact}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={(e) => handleBlur(e.target.value)}
            error={touched ? error : ""}
            disabled={isLoading}
            autoComplete="tel"
            inputProps={{
              name: "contact",
              inputMode: "numeric",
              maxLength: 10,
            }}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full h-[52px] flex items-center justify-center gap-2 bg-[#111] text-white text-[15px] font-semibold tracking-tight rounded-[11px] mb-4 transition-all duration-[180ms] hover:bg-[#2A2A2A] active:scale-[0.99] disabled:opacity-55 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#111] focus-visible:outline-offset-2 cursor-pointer"
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
              Saving…
            </>
          ) : (
            "Complete Profile"
          )}
        </button>

        <p className="text-center text-[13px] text-[#888] leading-relaxed">
          We respect your privacy. Your contact will only be used for necessary transaction notifications.
        </p>
      </form>
    </>
  );
}

export default ContactForm;
