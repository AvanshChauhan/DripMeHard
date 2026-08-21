import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import ContactForm from "../components/ContactForm";
import { useAuth } from "../services/hook/useAuth";

/* ── Brand Panel ─────────────────────────────────────── */
function BrandPanel() {
  return (
    <aside
      className="hidden lg:flex flex-col justify-between px-16 py-14 bg-[#F9F9F7] sticky top-0 h-screen overflow-hidden"
      aria-label="Brand information"
    >
      {/* Wordmark */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 bg-[#111] rounded-[8px] flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 18 18"
            className="w-[18px] h-[18px] fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 2h6a7 7 0 0 1 0 14H3V2z" />
          </svg>
        </div>
        <span className="text-[17px] font-semibold tracking-[-0.3px] text-[#111]">
          DripMeHard
        </span>
      </div>

      {/* Hero copy */}
      <div className="flex-1 flex flex-col justify-center py-12">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#6B6B6B] mb-5">
          Account Setup
        </p>
        <h2 className="text-[clamp(36px,4vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em] text-[#111] mb-6">
          Almost <span className="text-[#6B6B6B]">ready</span> to roll.
        </h2>
        <p className="text-[16px] text-[#6B6B6B] leading-relaxed max-w-[340px]">
          We just need your contact number to finalize your profile and keep you updated on order dispatches and drop alerts.
        </p>

        <ul
          className="flex flex-col gap-3.5 mt-12"
          aria-label="Contact setup features"
        >
          {[
            "Instant SMS & WhatsApp delivery notifications",
            "Secure seller-buyer communication channel",
            "Quick account recovery protection",
          ].map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 text-[14px] text-[#6B6B6B]"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#111] shrink-0"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <p className="text-[12px] text-[#AAAAAA]">
        © {new Date().getFullYear()} DripMeHard. All rights reserved.
      </p>
    </aside>
  );
}

/* ── Contact Page ────────────────────────────────────── */
function Contact() {
  const navigate = useNavigate();
  const { handleGetMe } = useAuth();
  const currentUser = useSelector((state) => state.auth?.user);
  const [isVerifying, setIsVerifying] = useState(!currentUser);

  useEffect(() => {
    let isMounted = true;

    async function checkUserSession() {
      if (currentUser) {
        if (currentUser.contact) {
          navigate("/", { replace: true });
        } else {
          setIsVerifying(false);
        }
        return;
      }

      try {
        const data = await handleGetMe();
        if (isMounted) {
          if (data?.user?.contact) {
            navigate("/", { replace: true });
          } else {
            setIsVerifying(false);
          }
        }
      } catch {
        if (isMounted) {
          // If no authenticated session exists, send to login
          navigate("/login", { replace: true });
        }
      }
    }

    checkUserSession();

    return () => {
      isMounted = false;
    };
  }, [currentUser, handleGetMe, navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin w-8 h-8 text-[#111]"
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
          <p className="text-[14px] text-[#6B6B6B]">Loading your details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex">
      <div className="grid lg:grid-cols-2 w-full max-w-[1280px] mx-auto min-h-screen">
        <BrandPanel />

        <main className="bg-white flex items-center justify-center px-6 py-14 sm:px-16 lg:px-20 lg:border-l lg:border-[#E5E5E5] min-h-screen overflow-y-auto">
          <div className="w-full max-w-[420px]">
            <ContactForm initialUser={currentUser} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Contact;