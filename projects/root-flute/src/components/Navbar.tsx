"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface NavChild {
  label: string;
  /** Absent for a pure group label with no destination of its own (e.g. "All Other Flute Designs"). */
  href?: string;
  children?: NavChild[];
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

// "All Other Flute Designs" — the nine design choices reachable once a
// visitor is already looking at Flutes. Mammoth appears here TOO (first,
// pointing at the same authoritative /flutes experience as "Woolly Mammoth
// Tusk Flutes" above it) — this is deliberate, not a mistake: both entries
// route to the same page. The remaining eight are each a standalone,
// directly shareable page at /custom-flutes/<slug> (see the STYLES map in
// src/app/custom-flutes/[style]/page.tsx); order matches that route. Every
// URL/slug is preserved as-is regardless of label wording (existing shared
// links keep working). "Double Harmony Flutes" and "Triple Chord Flutes"
// are the canonical customer-facing names as of 2026-09-23 and now match
// their page headings exactly. "Four Chamber Chord Flutes" remains a
// display-only shorthand — its page heading still reads "Four Chamber
// Mayan Chord Flutes" (out of scope for this update).
//
// The weaker legacy page at /custom-flutes/mammoth-tusk-flutes (price
// upon request, no commerce) is intentionally NOT linked from here or
// anywhere in navigation — it still exists and is still publicly
// reachable by direct URL, just not exposed as a second, competing
// Mammoth purchase path (2026-09-23 navigation restructure).
const ALL_OTHER_FLUTE_DESIGNS: NavChild[] = [
  { label: "Mammoth Tusk Flute", href: "/flutes" },
  { label: "Bell Flutes", href: "/custom-flutes/bell-flutes" },
  { label: "Point Flutes", href: "/custom-flutes/point-flutes" },
  { label: "Drone Flutes", href: "/custom-flutes/drone-flutes" },
  { label: "Double Harmony Flutes", href: "/custom-flutes/mayan-harmony-flutes" },
  { label: "Triple Chord Flutes", href: "/custom-flutes/triple-mayan-chord-flutes" },
  { label: "Four Chamber Chord Flutes", href: "/custom-flutes/four-chamber-mayan-chord-flutes" },
  { label: "Rack Flutes", href: "/custom-flutes/rack-flutes" },
  { label: "Snake Flutes", href: "/custom-flutes/snake-flutes" },
];

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Society", href: "/society" },
  {
    label: "Flutes",
    href: "/flutes",
    children: [
      { label: "Woolly Mammoth Tusk Flutes", href: "/flutes" },
      // No `href`: a pure group label/toggle, same as the top-level "Videos"
      // item. /custom-flutes (the nine-design index) is deliberately no
      // longer linked from navigation at all — the 2026-09-23 read-only
      // audit found it fully redundant with these individual pages (same
      // components, same content). The route, its code and its content are
      // untouched and still publicly reachable by direct URL/bookmark/search
      // result; it is only removed from normal navigation.
      { label: "All Other Flute Designs", children: ALL_OTHER_FLUTE_DESIGNS },
    ],
  },
  { label: "Music", href: "/music" },
  { label: "Talismans", href: "/jewelry" },
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
  { label: "Tickets", href: "/tickets" },
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  // Promoter mirror: /promoter/* renders the same pages as the public site
  // (see src/middleware.ts). Needed here, ahead of the `scrolled` state
  // below, to identify the home page regardless of which mirror it's
  // viewed through.
  const isPromoterPath = pathname === "/promoter" || pathname.startsWith("/promoter/");
  const promoterPrefix = isPromoterPath ? "/promoter" : "";
  const logicalPathname = isPromoterPath ? pathname.slice("/promoter".length) || "/" : pathname;
  const isHomePage = logicalPathname === "/";

  // The home hero now renders in its final "scrolled" dark-header state
  // from first paint (see HomepageHero.tsx) — the header must match
  // immediately, not transition into it. Every other page keeps starting
  // transparent, exactly as before; the scroll listener below still drives
  // ordinary scroll-linked toggling on all pages, including home.
  const [scrolled, setScrolled] = useState(isHomePage);
  const [videosOpen, setVideosOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileVideosOpen, setMobileVideosOpen] = useState(false);
  // Flutes dropdown — a second, independent instance of the exact same
  // hover-dropdown mechanism used for Videos below, kept fully separate
  // (own state/ref/timer) rather than generalized, since unlike Videos the
  // "Flutes" label must also remain a working link to /flutes.
  const [flutesOpen, setFlutesOpen] = useState(false);
  const [mobileFlutesOpen, setMobileFlutesOpen] = useState(false);
  // Third level: the "All Designs" list nested under "Custom Flute Styles",
  // one instance per surface (desktop flyout / mobile accordion).
  const [flutesDesignsOpen, setFlutesDesignsOpen] = useState(false);
  const [mobileFlutesDesignsOpen, setMobileFlutesDesignsOpen] = useState(false);
  // Instruments dropdown — same hover-dropdown mechanism as Flutes (own
  // state/ref/timer; the "Instruments" label also stays a working link). Its
  // entries are the live public instrument designs, fetched once from
  // /api/instruments-nav (see `instrumentLinks` below).
  const [instrumentsOpen, setInstrumentsOpen] = useState(false);
  const [mobileInstrumentsOpen, setMobileInstrumentsOpen] = useState(false);
  const [instrumentLinks, setInstrumentLinks] = useState<NavChild[]>([]);
  const videosRef = useRef<HTMLLIElement>(null);
  const flutesRef = useRef<HTMLLIElement>(null);
  const instrumentsRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flutesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const instrumentsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockedScrollY = useRef(0);

  // One small fetch for the Instruments submenu. Skipped inside Studio (which
  // renders no public nav). On any failure the submenu simply shows "All
  // Instruments" — it never blocks or breaks the rest of the navigation.
  useEffect(() => {
    if (pathname.startsWith("/studio")) return;
    let cancelled = false;
    fetch("/api/instruments-nav")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { items?: { name: string; slug: string }[] } | null) => {
        if (cancelled || !data?.items) return;
        setInstrumentLinks(data.items.map((i) => ({ label: i.name, href: `/instruments/${i.slug}` })));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navItems: NavItem[] = NAV_ITEMS.map((item) =>
    item.label === "Instruments"
      ? { ...item, children: [{ label: "All Instruments", href: "/instruments" }, ...instrumentLinks] }
      : item
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    // Home starts forced-dark (see the `scrolled` initializer above) — skip
    // this one recalculation-on-mount so that forced value survives until a
    // real scroll event fires, instead of being immediately overwritten by
    // the actual (zero) scroll position. Every other page still recalculates
    // on mount exactly as before.
    if (!isHomePage) onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

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
    flutesCloseTimer.current = setTimeout(() => {
      setFlutesOpen(false);
      setFlutesDesignsOpen(false);
    }, 120);
  }

  function openInstrumentsNow() {
    if (instrumentsCloseTimer.current) clearTimeout(instrumentsCloseTimer.current);
    setInstrumentsOpen(true);
  }

  function closeInstrumentsDelayed() {
    instrumentsCloseTimer.current = setTimeout(() => setInstrumentsOpen(false), 120);
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
    setMobileFlutesDesignsOpen(false);
    setMobileInstrumentsOpen(false);
  }, [unlockBody]);

  // Belt-and-braces reset for anything outside a normal tap: Escape, and the
  // page lifecycle/history events below.
  const resetAllMenus = useCallback(() => {
    setVideosOpen(false);
    setFlutesOpen(false);
    setFlutesDesignsOpen(false);
    setInstrumentsOpen(false);
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
        setFlutesDesignsOpen(false);
      }
      if (instrumentsRef.current && !instrumentsRef.current.contains(e.target as Node)) {
        setInstrumentsOpen(false);
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
  // captured mid-transition. popstate covers Back/Forward navigation
  // directly. Both are idempotent no-ops when the menu is already closed.
  //
  // pageshow must be handled far more narrowly. It fires on a bfcache restore
  // (`persisted: true`) — the case this guard actually exists for — but it
  // ALSO fires after the window `load` event on every ordinary navigation,
  // and `load` waits for every subresource on the page. On a hero page
  // carrying multi-megabyte video that lands *seconds* after the nav is
  // already hydrated and interactive, so an unconditional reset here would
  // silently close a menu the user had deliberately opened moments earlier —
  // and, worse, run unlockBody()'s window.scrollTo() and yank them back up to
  // the hero. Gating on `persisted` keeps the real bfcache protection while
  // making a normal page load incapable of touching menu state, so the menu
  // can only ever close from a genuine user action.
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) resetAllMenus();
    }
    window.addEventListener("pagehide", resetAllMenus);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", resetAllMenus);
    return () => {
      window.removeEventListener("pagehide", resetAllMenus);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", resetAllMenus);
    };
  }, [resetAllMenus]);

  function isActive(href?: string) {
    if (!href) return false;
    if (href === "/") return logicalPathname === "/";
    return logicalPathname === href || logicalPathname.startsWith(href + "/");
  }

  const videosActive = logicalPathname.startsWith("/videos");

  // RootFlute Studio (/studio) is a separate private app with its own shell —
  // never render the public marketing nav on top of it.
  if (pathname.startsWith("/studio")) return null;

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Decorative background layer, separate from `header` itself: a
          `backdrop-filter` (from `backdrop-blur-md` below) makes the element
          it's set on the CSS containing block for any `position: fixed`
          descendants — which used to be `header` directly, silently
          collapsing the fixed-position mobile menu overlay (also a
          descendant of `header`) to `header`'s own ~80px height instead of
          the viewport. Isolating the blur on this inset-0 sibling layer
          keeps the identical visual look while leaving `header` filter-free,
          so its fixed children size against the viewport as intended. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 pointer-events-none transition-all duration-500 ${
          scrolled
            ? "bg-brand-dark/85 backdrop-blur-md border-b border-brand-border/60 shadow-[0_4px_30px_rgba(0,0,0,0.35)]"
            : "bg-transparent border-b border-transparent"
        }`}
      />
      <nav
        aria-label="Primary navigation"
        className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between"
      >
        {/* Brand */}
        <a
          href={`${promoterPrefix}/`}
          aria-label="RootFlute — return to homepage"
          onClick={closeMobileMenu}
          className="font-display text-2xl sm:text-3xl font-normal text-brand-text [text-shadow:0_2px_10px_rgba(0,0,0,0.75)] transition-colors duration-200 hover:text-brand-text"
        >
          Root<span className="text-brand-gold">Flute</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => {
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
                    href={`${promoterPrefix}${item.href}`}
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
                      {item.children.map((child) =>
                        child.children ? (
                          <div key={child.label}>
                            {/* No `href` on this node (see ALL_OTHER_FLUTE_DESIGNS above) — the
                                group label itself is the toggle, same pattern as the top-level
                                "Videos" item. There is no longer a separate link row here. */}
                            <button
                              type="button"
                              role="menuitem"
                              aria-expanded={flutesDesignsOpen}
                              onClick={() => setFlutesDesignsOpen((v) => !v)}
                              className="w-full flex items-center justify-between gap-2 px-5 py-3 text-sm font-sans text-brand-gold transition-colors duration-150 hover:bg-brand-dark/40"
                            >
                              {child.label}
                              <svg
                                viewBox="0 0 10 6"
                                aria-hidden="true"
                                className={`w-2.5 h-2.5 transition-transform duration-200 ${flutesDesignsOpen ? "rotate-180" : ""}`}
                                fill="none"
                              >
                                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <div
                              className={`grid transition-all duration-200 ease-out ${
                                flutesDesignsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                              }`}
                            >
                              <div className="overflow-hidden">
                                {child.children.map((design) => (
                                  <a
                                    key={design.href}
                                    href={`${promoterPrefix}${design.href}`}
                                    role="menuitem"
                                    onClick={() => setFlutesOpen(false)}
                                    className={`block whitespace-nowrap pl-12 pr-5 py-2.5 text-sm font-sans text-brand-gold transition-colors duration-150 hover:bg-brand-dark/40 ${
                                      isActive(design.href) ? "bg-brand-dark/40" : ""
                                    }`}
                                  >
                                    {design.label}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <a
                            key={child.href}
                            href={`${promoterPrefix}${child.href}`}
                            role="menuitem"
                            onClick={() => setFlutesOpen(false)}
                            className={`block px-5 py-3 text-sm font-sans text-brand-gold transition-colors duration-150 hover:bg-brand-dark/40 ${
                              isActive(child.href) ? "bg-brand-dark/40" : ""
                            }`}
                          >
                            {child.label}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </li>
              );
            }

            if (item.label === "Instruments" && item.children) {
              const open = instrumentsOpen;
              return (
                <li
                  key={item.label}
                  ref={instrumentsRef}
                  className="relative"
                  onMouseEnter={openInstrumentsNow}
                  onMouseLeave={closeInstrumentsDelayed}
                  onFocus={openInstrumentsNow}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeInstrumentsDelayed();
                  }}
                >
                  <a
                    href={`${promoterPrefix}${item.href}`}
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
                          href={`${promoterPrefix}${child.href}`}
                          role="menuitem"
                          onClick={() => setInstrumentsOpen(false)}
                          className={`block whitespace-nowrap px-5 py-3 text-sm font-sans text-brand-gold transition-colors duration-150 hover:bg-brand-dark/40 ${
                            (child.href === "/instruments" ? logicalPathname === "/instruments" : isActive(child.href))
                              ? "bg-brand-dark/40"
                              : ""
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
                          href={`${promoterPrefix}${child.href}`}
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
                  href={`${promoterPrefix}${item.href}`}
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
          {navItems.map((item) => {
            if (item.label === "Flutes" && item.children) {
              return (
                <li key={item.label} className="border-b border-brand-border/50">
                  {/* Whole row is one toggle target — same interaction as the
                      Videos row below. The label itself no longer links to
                      /flutes; that destination is reached through "Available
                      Now" in the submenu this row opens. */}
                  <button
                    type="button"
                    aria-expanded={mobileFlutesOpen}
                    onClick={() => setMobileFlutesOpen((v) => !v)}
                    className={`w-full flex items-center justify-between py-4 text-base uppercase tracking-widest font-sans transition-colors duration-200 ${
                      isActive(item.href) ? "text-brand-gold" : "text-brand-text"
                    }`}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 10 6"
                      aria-hidden="true"
                      className={`w-3 h-3 transition-transform duration-200 ${mobileFlutesOpen ? "rotate-180" : ""}`}
                      fill="none"
                    >
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      mobileFlutesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="flex flex-col pb-3 pl-4">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            {child.children ? (
                              // No `href` on this node (see ALL_OTHER_FLUTE_DESIGNS above) —
                              // the group label itself is the toggle; there is no separate
                              // link row here.
                              <button
                                type="button"
                                aria-expanded={mobileFlutesDesignsOpen}
                                onClick={() => setMobileFlutesDesignsOpen((v) => !v)}
                                className="w-full flex items-center justify-between py-3 text-sm font-sans text-brand-gold transition-colors duration-150"
                              >
                                {child.label}
                                <svg
                                  viewBox="0 0 10 6"
                                  aria-hidden="true"
                                  className={`w-3 h-3 transition-transform duration-200 ${mobileFlutesDesignsOpen ? "rotate-180" : ""}`}
                                  fill="none"
                                >
                                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            ) : (
                              <a
                                href={`${promoterPrefix}${child.href}`}
                                onClick={closeMobileMenu}
                                className="block py-3 text-sm font-sans text-brand-gold transition-colors duration-150"
                              >
                                {child.label}
                              </a>
                            )}
                            {child.children && (
                              <div
                                className={`grid transition-all duration-300 ease-out ${
                                  mobileFlutesDesignsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                }`}
                              >
                                <div className="overflow-hidden">
                                  <ul className="flex flex-col pb-2 pl-8">
                                    {child.children.map((design) => (
                                      <li key={design.href}>
                                        <a
                                          href={`${promoterPrefix}${design.href}`}
                                          onClick={closeMobileMenu}
                                          className="block py-2.5 text-sm font-sans text-brand-gold transition-colors duration-150"
                                        >
                                          {design.label}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            }

            if (item.label === "Instruments" && item.children) {
              return (
                <li key={item.label} className="border-b border-brand-border/50">
                  {/* Same accordion interaction as the Flutes row above: the row
                      is one toggle target; /instruments itself is reached via
                      "All Instruments" inside the submenu it opens. */}
                  <button
                    type="button"
                    aria-expanded={mobileInstrumentsOpen}
                    onClick={() => setMobileInstrumentsOpen((v) => !v)}
                    className={`w-full flex items-center justify-between py-4 text-base uppercase tracking-widest font-sans transition-colors duration-200 ${
                      isActive(item.href) ? "text-brand-gold" : "text-brand-text"
                    }`}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 10 6"
                      aria-hidden="true"
                      className={`w-3 h-3 transition-transform duration-200 ${mobileInstrumentsOpen ? "rotate-180" : ""}`}
                      fill="none"
                    >
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      mobileInstrumentsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="flex flex-col pb-3 pl-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <a
                              href={`${promoterPrefix}${child.href}`}
                              onClick={closeMobileMenu}
                              className="block py-3 text-sm font-sans text-brand-gold transition-colors duration-150"
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
                              href={`${promoterPrefix}${child.href}`}
                              onClick={closeMobileMenu}
                              className="block py-3 text-sm font-sans text-brand-gold transition-colors duration-150"
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
                  href={`${promoterPrefix}${item.href}`}
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
