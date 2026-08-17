import React from 'react';
import RegisterForm from '../components/RegisterForm';

/**
 * Register — two-column page layout in Tailwind v4.
 * Left: brand panel (sticky, hidden on mobile).
 * Right: white form surface.
 *
 * Monolith Luxe design system — Apple-inspired premium minimalism.
 */

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
          <svg viewBox="0 0 18 18" className="w-[18px] h-[18px] fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 2h6a7 7 0 0 1 0 14H3V2z"/>
          </svg>
        </div>
        <span className="text-[17px] font-semibold tracking-[-0.3px] text-[#111]">
          DripMeHard
        </span>
      </div>

      {/* Hero copy */}
      <div className="flex-1 flex flex-col justify-center py-12">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#6B6B6B] mb-5">
          Premium Fashion Marketplace
        </p>
        <h2 className="text-[clamp(36px,4vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em] text-[#111] mb-6">
          The art of{' '}
          <span className="text-[#6B6B6B]">modern</span>
          {' '}drip.
        </h2>
        <p className="text-[16px] text-[#6B6B6B] leading-relaxed max-w-[340px]">
          Discover, buy, and sell premium streetwear and fashion — curated for those who wear culture.
        </p>

        <ul className="flex flex-col gap-3.5 mt-12" aria-label="Platform highlights">
          {[
            'Curated drops from independent sellers',
            'Verified products, authentic style',
            'Sell your own pieces in minutes',
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-[14px] text-[#6B6B6B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111] shrink-0" aria-hidden="true"/>
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

/* ── Register Page ───────────────────────────────────── */
function Register() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] flex">
      <div className="grid lg:grid-cols-2 w-full max-w-[1280px] mx-auto min-h-screen">
        <BrandPanel />

        <main
          className="bg-white flex items-center justify-center px-6 py-14 sm:px-16 lg:px-20 lg:border-l lg:border-[#E5E5E5] min-h-screen overflow-y-auto"
        >
          <div className="w-full max-w-[420px]">
            <RegisterForm />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Register;