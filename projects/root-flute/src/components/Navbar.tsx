"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Society", href: "/society" },
  {
    label: "Flutes",
    href: "/flutes",
    children: [{ label: "Custom Flutes", href: "/custom-flutes" }],
  },
  { label: "Jewelry", href: "/jewelry" },
  { label: "Instruments", href: "/instruments" },
  { label: "Materials", href: "/materials" },
  {
    label: "Videos",
    children: [
      { label: "RootFlute Live", href: "/videos/rootflute-live" },
      { label: "Instruments", href: "/videos/instruments" },
      { label: "Lucid Meditation", href: "/videos/lucid-meditation" },
    ],
  },
  { label: "Music", href: "/music" },
  { label: "Tickets", href: "/tickets" },
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [videosOpen, setVideosOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileVideosOpen, setMobileVideosOpen] = useState(false);
  // Flutes dropdown — a second, independent instance of the exact same
  // hover-dropdown mechanism used for Videos below, kept fully separate
  // (own state/ref/timer) rather than generalized, since unlike Videos the
  // "Flutes" label must also remain a working link to /flutes.
  const [flutesOpen, setFlutesOpen] = useState(false);
  const [mobileFlutesOpen, setMobileFlutesOpen] = useState(false);
  const pathname = usePathname();
  const videosRef = useRef<HTMLLIElement>(null);
  const flutesRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flutesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockedScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openVideosNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setVideosOpen(true);
  }

  function closeVideosDelayed() {
    closeTimer.current = setTimeout(() => setVideosOpen(false), 120);
  }

  function openFlutesNow() {
    if (flutesCloseTimer.current) clearTimeout(flutesCloseTimer.current);
    setFlutesOpen(true);
  }

  function closeFlutesDelayed() {
    flutesCloseTimer.current = setTimeout(() => setFlutesOpen(false), 120);
  }

  // Body scroll lock, applied/removed synchronously and imperatively (never
  // via a useEffect). This site navigates with plain <a href> tags — every
  // link click is a real, full page load, not client-side routing, and it
  // never touches history.pushState/replaceState itself (opening the menu
  // must never create a history entry). The one place browser history DOES
  // enter the picture is the back-forward cache (bfcache): mobile Safari and
  // Chrome can freeze an ENTIRE page — JS heap and DOM included — when the
  // user navigates away, and instantly restore that exact frozen snapshot on
  // Back/Forward instead of reloading. If a useEffect's cleanup is what
  // removes the scroll lock, there's a real gap between "React state says
  // closed" and "the DOM's inline style actually reflects that" (effects run
  // after commit, not synchronously with the click) — and if the page gets
  // frozen into bfcache inside that gap, it freezes with the lock still on.
  // Later, restoring that snapshot shows the closed hamburger icon (state
  // was already false) while the body is still locked/unscrollable and dead
  // to taps — exactly "the icon toggles but the page never comes back,"
  // recoverable only by leaving the page (Back button) again. Doing the
  // lock/unlock inline, in the same tick as the state update, removes that
  // gap entirely: nothing is ever mid-transition when a freeze can occur.
  const lockBody = useCallback(() => {
    lockedScrollY.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }, []);

  const unlockBody = useCallback(() => {
    const wasLocked = document.body.style.position === "fixed";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    if (wasLocked) {
      window.scrollTo(0, lockedScrollY.current);
    }
  }, []);

  // Explicit, idempotent open/close — NOT a toggle. A toggle
  // (setMobileOpen(v => !v)) is fragile against duplicate-fire events: mobile
  // WebKit can dispatch a compatibility click alongside the real touch tap,
  // and a toggle receiving two events cancels itself out (open→close→open),
  // which reads to the user as "tapping X didn't close the menu." Calling
  // closeMobileMenu() twice in a row is harmless; toggling twice is not.
  // Closing also clears the Videos accordion so no submenu state survives
  // between open/close cycles, and unlocks the body immediately (see above).
  const openMobileMenu = useCallback(() => {
    lockBody();
    setMobileOpen(true);
  }, [lockBody]);

  const closeMobileMenu = useCallback(() => {
    unlockBody();
    setMobileOpen(false);
    setMobileVideosOpen(false);
    setMobileFlutesOpen(false);
  }, [unlockBody]);

  // Belt-and-braces reset for anything outside a normal tap: Escape, and the
  // page lifecycle/history events below.
  const resetAllMenus = useCallback(() => {
    setVideosOpen(false);
    setFlutesOpen(false);
    closeMobileMenu();
  }, [closeMobileMenu]);

  // Close desktop dropdown on outside click / Escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (videosRef.current && !videosRef.current.contains(e.target as Node)) {
        setVideosOpen(false);
      }
      if (flutesRef.current && !flutesRef.current.contains(e.target as Node)) {
        setFlutesOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        resetAllMenus();
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [resetAllMenus]);

  // bfcache / history resilience. pagehide fires just before the page is
  // hidden or frozen into bfcache — reset proactively so nothing is ever
  // captured mid-transition. pageshow fires on every page load AND on a
  // bfcache restore (event.persisted) — reset again defensively the instant
  // the page becomes visible, in case a stale open/locked snapshot was ever
  // captured despite the above. popstate covers Back/Forward navigation
  // directly. All three are idempotent no-ops when the menu is already
  // closed and unlocked.
  useEffect(() => {
    window.addEventListener("pagehide", resetAllMenus);
    window.addEventListener("pageshow", resetAllMenus);
    window.addEventListener("popstate", resetAllMenus);
    return () => {
      window.removeEventListener("pagehide", resetAllMenus);
      window.removeEventListener("pageshow", resetAllMenus);
      window.removeEventListener("popstate", resetAllMenus);
    };
  }, [resetAllMenus]);

  function isActive(href?: string) {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const videosActive = pathname.startsWith("/videos");

  // RootFlute Studio (/studio) is a separate private app with its own shell —
  // never render the public marketing nav on top of it.
  if (pathname.startsWith("/studio")) return null;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-brand-dark/85 backdrop-blur-md border-b border-brand-border/60 shadow-[0_4px_30px_rgba(0,0,0,0.35)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary navigation"
        className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between"
      >
        {/* Brand */}
        <a
          href="/"
          aria-label="RootFlute — return to homepage"
          onClick={closeMobileMenu}
          className="font-display text-2xl sm:text-3xl font-normal text-brand-text [text-shadow:0_2px_10px_rgba(0,0,0,0.75)] transition-colors duration-200 hover:text-brand-text"
        >
          Root<span className="text-brand-gold">Flute</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            if (item.label === "Flutes" && item.children) {
              const open = flutesOpen;
              return (
                <li
                  key={item.label}
                  ref={flutesRef}
                  className="relative"
                  onMouseEnter={openFlutesNow}
                  onMouseLeave={closeFlutesDelayed}
                >
                  <a
                    href={item.href}
                    aria-haspopup="true"
                    aria-expanded={open}
                    className={`flex items-center gap-1.5 text-xs uppercase tracking-widest font-sans transition-colors duration-200 [text-shadow:0_1px_6px_rgba(0,0,0,0.6)] ${
                      isActive(item.href) ? "text-brand-gold" : "text-brand-text/85 hover:text-brand-gold"
                    }`}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 10 6"
                      aria-hidden="true"
                      className={`w-2.5 h-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      fill="none"
                    >
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>

                  <div
                    role="menu"
                    className={`absolute top-full right-0 pt-4 transition-all duration-200 ${
                      open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="min-w-[220px] bg-brand-surface/95 backdrop-blur-md border border-brand-border shadow-2xl py-2">
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          role="menuitem"
                          onClick={() => setFlutesOpen(false)}
                          className={`block px-5 py-3 text-sm font-sans transition-colors duration-150 ${
                            isActive(child.href)
                              ? "text-brand-gold bg-brand-dark/40"
                              : "text-brand-text/85 hover:text-brand-gold hover:bg-brand-dark/40"
                          }`}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
              );
            }

            if (item.children) {
              const open = videosOpen;
              return (
                <li
                  key={item.label}
                  ref={videosRef}
                  className="relative"
                  onMouseEnter={openVideosNow}
                  onMouseLeave={closeVideosDelayed}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={open}
                    onClick={() => setVideosOpen((v) => !v)}
                    className={`flex items-center gap-1.5 text-xs uppercase tracking-widest font-sans transition-colors duration-200 [text-shadow:0_1px_6px_rgba(0,0,0,0.6)] ${
                      videosActive ? "text-brand-gold" : "text-brand-text/85 hover:text-brand-gold"
                    }`}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 10 6"
                      aria-hidden="true"
                      className={`w-2.5 h-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      fill="none"
                    >
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div
                    role="menu"
                    className={`absolute top-full right-0 pt-4 transition-all duration-200 ${
                      open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="min-w-[220px] bg-brand-surface/95 backdrop-blur-md border border-brand-border shadow-2xl py-2">
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          role="menuitem"
                          onClick={() => setVideosOpen(false)}
                          className={`block px-5 py-3 text-sm font-sans transition-colors duration-150 ${
                            isActive(child.href)
                              ? "text-brand-gold bg-brand-dark/40"
                              : "text-brand-text/85 hover:text-brand-gold hover:bg-brand-dark/40"
                          }`}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`text-xs uppercase tracking-widest font-sans transition-colors duration-200 [text-shadow:0_1px_6px_rgba(0,0,0,0.6)] ${
                    isActive(item.href) ? "text-brand-gold" : "text-brand-text/85 hover:text-brand-gold"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger — explicit open/close (not a toggle), see closeMobileMenu above */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={mobileOpen ? closeMobileMenu : openMobileMenu}
          className="lg:hidden relative z-[70] flex flex-col items-center justify-center w-10 h-10 -mr-2 gap-[5px] focus-visible:outline-none"
        >
          <span
            className={`block w-6 h-px bg-brand-text transition-transform duration-300 ${
              mobileOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-6 h-px bg-brand-text transition-opacity duration-200 ${
              mobileOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-6 h-px bg-brand-text transition-transform duration-300 ${
              mobileOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu overlay — z-[40], strictly below the button's z-[70] so the
          hamburger/X is never obscured, and pointer-events flips synchronously
          with the class change (not tied to the opacity transition) so it can
          never stay interactive after closing. */}
      <div
        aria-hidden={!mobileOpen}
        className={`lg:hidden fixed inset-0 top-20 z-40 bg-brand-dark/98 backdrop-blur-md overflow-y-auto transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col px-6 py-8 gap-1">
          {NAV_ITEMS.map((item) => {
            if (item.label === "Flutes" && item.children) {
              return (
                <li key={item.label} className="border-b border-brand-border/50">
                  <div className="flex items-center">
                    <a
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`flex-1 py-4 text-base uppercase tracking-widest font-sans transition-colors duration-200 ${
                        isActive(item.href) ? "text-brand-gold" : "text-brand-text"
                      }`}
                    >
                      {item.label}
                    </a>
                    <button
                      type="button"
                      aria-label={mobileFlutesOpen ? "Collapse Flutes menu" : "Expand Flutes menu"}
                      aria-expanded={mobileFlutesOpen}
                      onClick={() => setMobileFlutesOpen((v) => !v)}
                      className="p-3 -mr-1"
                    >
                      <svg
                        viewBox="0 0 10 6"
                        aria-hidden="true"
                        className={`w-3 h-3 transition-transform duration-200 ${mobileFlutesOpen ? "rotate-180" : ""}`}
                        fill="none"
                      >
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      mobileFlutesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="flex flex-col pb-3 pl-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              onClick={closeMobileMenu}
                              className={`block py-3 text-sm font-sans transition-colors duration-150 ${
                                isActive(child.href) ? "text-brand-gold" : "text-brand-muted hover:text-brand-gold"
                              }`}
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            }

            if (item.children) {
              return (
                <li key={item.label} className="border-b border-brand-border/50">
                  <button
                    type="button"
                    aria-expanded={mobileVideosOpen}
                    onClick={() => setMobileVideosOpen((v) => !v)}
                    className={`w-full flex items-center justify-between py-4 text-base uppercase tracking-widest font-sans transition-colors duration-200 ${
                      videosActive ? "text-brand-gold" : "text-brand-text"
                    }`}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 10 6"
                      aria-hidden="true"
                      className={`w-3 h-3 transition-transform duration-200 ${mobileVideosOpen ? "rotate-180" : ""}`}
                      fill="none"
                    >
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      mobileVideosOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="flex flex-col pb-3 pl-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              onClick={closeMobileMenu}
                              className={`block py-3 text-sm font-sans transition-colors duration-150 ${
                                isActive(child.href) ? "text-brand-gold" : "text-brand-muted hover:text-brand-gold"
                              }`}
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.label} className="border-b border-brand-border/50">
                <a
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`block py-4 text-base uppercase tracking-widest font-sans transition-colors duration-200 ${
                    isActive(item.href) ? "text-brand-gold" : "text-brand-text"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
