const services = [
  {
    icon: '▣',
    title: 'Website Design & Build',
    desc: 'High-performance sites engineered for conversion. No templates. No compromise.',
  },
  {
    icon: '⚡',
    title: 'Automation Systems',
    desc: 'Remove manual bottlenecks. We build workflows that run without you.',
  },
  {
    icon: '◎',
    title: 'Funnel & Lead Capture',
    desc: 'End-to-end funnel architecture designed to turn visitors into qualified leads.',
  },
  {
    icon: '◈',
    title: 'AI Integrations',
    desc: 'Add intelligence to your stack — from smart intake to AI-assisted operations.',
  },
  {
    icon: '↗',
    title: 'Ongoing Optimization',
    desc: 'Performance monitoring, iterative improvements, and A/B testing post-launch.',
  },
  {
    icon: '⬡',
    title: 'Infrastructure & DevOps',
    desc: 'Scalable hosting, CI/CD pipelines, and deployment built for reliability.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Strategy',
    desc: 'We audit your position, define clear goals, and map exactly what to build — and why.',
  },
  {
    number: '02',
    title: 'Build',
    desc: 'Rapid, focused execution. Clean code, clean design. No scope creep. No bloat.',
  },
  {
    number: '03',
    title: 'Launch',
    desc: 'Full deployment, QA, and go-live support. We stay on until everything runs clean.',
  },
  {
    number: '04',
    title: 'Optimize',
    desc: 'Continuous improvement based on real performance data — not assumptions.',
  },
]

const stats = [
  { stat: '< 14 days', label: 'Average time from brief to live site' },
  { stat: '100%', label: 'Projects shipped on spec and on schedule' },
  { stat: '3×', label: 'Average improvement in lead conversion after rebuild' },
]

const outcomes = [
  'Sites that load fast, rank well, and convert consistently',
  'Automation that eliminates manual work across your entire funnel',
  'Clean, maintainable code you own — no vendor lock-in',
  'Direct access to the team building your project from day one',
  'Transparent pricing, fixed scope, zero surprises',
]

export default function Home() {
  return (
    <>
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #ffffff;
          color: #0f0f0f;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ── NAV ── */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2.5rem;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid #f0f0f0;
        }

        .nav-logo {
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #0f0f0f;
          text-decoration: none;
        }

        .nav-btn {
          background: #0f0f0f;
          color: #fff;
          border: none;
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.01em;
          transition: opacity 0.15s ease;
        }
        .nav-btn:hover { opacity: 0.75; }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 9rem 1.5rem 6rem;
        }

        .eyebrow {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6b7280;
          padding: 0.375rem 0.875rem;
          border: 1px solid #e5e7eb;
          border-radius: 999px;
          margin-bottom: 1.75rem;
        }

        .hero h1 {
          font-size: clamp(2.6rem, 6.5vw, 4.75rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.04;
          color: #0f0f0f;
          max-width: 860px;
          margin-bottom: 1.5rem;
        }

        .hero-sub {
          font-size: clamp(1rem, 2vw, 1.175rem);
          color: #6b7280;
          max-width: 520px;
          margin-bottom: 2.75rem;
          line-height: 1.75;
          font-weight: 400;
        }

        .hero-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .btn-primary {
          background: #0f0f0f;
          color: #fff;
          border: none;
          padding: 0.9rem 2.1rem;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.15s ease;
          letter-spacing: -0.01em;
        }
        .btn-primary:hover { opacity: 0.78; }

        .btn-secondary {
          background: transparent;
          color: #0f0f0f;
          border: 1.5px solid #d1d5db;
          padding: 0.9rem 2.1rem;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: border-color 0.15s ease;
          letter-spacing: -0.01em;
        }
        .btn-secondary:hover { border-color: #9ca3af; }

        .trust-line {
          font-size: 0.78rem;
          color: #9ca3af;
          letter-spacing: 0.02em;
        }

        /* ── SHARED SECTION LAYOUT ── */
        .section-light {
          padding: 6rem 1.5rem;
        }

        .section-dark {
          background: #0f0f0f;
          padding: 6rem 1.5rem;
        }

        .section-inner {
          max-width: 1060px;
          margin: 0 auto;
        }

        .section-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 0.75rem;
        }

        .section-label-inv {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 0.75rem;
        }

        .section-heading {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.12;
          margin-bottom: 0.875rem;
          color: #0f0f0f;
        }

        .section-heading-inv {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.12;
          margin-bottom: 0.875rem;
          color: #f5f5f5;
        }

        .section-sub {
          font-size: 0.975rem;
          color: #6b7280;
          max-width: 460px;
          line-height: 1.75;
          margin-bottom: 3rem;
        }

        .section-sub-inv {
          font-size: 0.975rem;
          color: #9ca3af;
          max-width: 460px;
          line-height: 1.75;
          margin-bottom: 3rem;
        }

        /* ── SERVICES GRID ── */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .service-card {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 1.75rem;
          background: #fff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .service-card:hover {
          border-color: #c7cacf;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .service-icon {
          font-size: 1.1rem;
          margin-bottom: 1.1rem;
          color: #374151;
          display: block;
        }

        .service-card h3 {
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: -0.015em;
          color: #0f0f0f;
          margin-bottom: 0.5rem;
        }

        .service-card p {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.65;
        }

        /* ── PROCESS ── */
        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .process-step {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .step-number {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .step-number::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 1px;
          background: #374151;
          flex-shrink: 0;
        }

        .process-step h3 {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #f5f5f5;
        }

        .process-step p {
          font-size: 0.85rem;
          color: #9ca3af;
          line-height: 1.7;
        }

        /* ── PROOF ── */
        .divider-dark {
          border: none;
          border-top: 1px solid #1f2937;
          margin: 0 0 4rem;
        }

        .proof-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 3.5rem;
        }

        .proof-card {
          border: 1px solid #1f2937;
          border-radius: 10px;
          padding: 2rem 1.75rem;
        }

        .proof-stat {
          font-size: 2.4rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #f5f5f5;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .proof-label {
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.55;
        }

        .outcomes-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .outcome-item {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          font-size: 0.925rem;
          color: #d1d5db;
          line-height: 1.65;
        }

        .outcome-check {
          width: 16px;
          height: 16px;
          border: 1.5px solid #374151;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 3px;
          font-size: 0.6rem;
          color: #6b7280;
        }

        /* ── FINAL CTA ── */
        .cta-section {
          padding: 8rem 1.5rem;
          text-align: center;
          background: #fafafa;
          border-top: 1px solid #f0f0f0;
        }

        .cta-section h2 {
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.08;
          color: #0f0f0f;
          max-width: 600px;
          margin: 0 auto 1rem;
        }

        .cta-section p {
          font-size: 1rem;
          color: #6b7280;
          max-width: 380px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }

        .btn-primary-lg {
          background: #0f0f0f;
          color: #fff;
          border: none;
          padding: 1.05rem 2.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.15s ease;
          letter-spacing: -0.01em;
        }
        .btn-primary-lg:hover { opacity: 0.78; }

        /* ── FOOTER ── */
        .footer {
          padding: 1.75rem 2.5rem;
          border-top: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          max-width: 1060px;
          margin: 0 auto;
        }

        .footer-brand {
          font-size: 0.875rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #0f0f0f;
        }

        .footer-copy {
          font-size: 0.775rem;
          color: #9ca3af;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .process-grid { grid-template-columns: repeat(2, 1fr); }
          .proof-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 580px) {
          .nav { padding: 1rem 1.25rem; }
          .hero { padding: 7.5rem 1.25rem 5rem; }
          .section-light { padding: 4.5rem 1.25rem; }
          .section-dark { padding: 4.5rem 1.25rem; }
          .cta-section { padding: 5rem 1.25rem; }
          .services-grid { grid-template-columns: 1fr; }
          .process-grid { grid-template-columns: 1fr; }
          .proof-grid { grid-template-columns: 1fr; }
          .footer { padding: 1.5rem 1.25rem; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">SHOX</a>
        <a href="#contact" className="nav-btn">Get Started</a>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <span className="eyebrow">AI-Powered Web Infrastructure</span>
        <h1>Websites that work.<br />Systems that scale.</h1>
        <p className="hero-sub">
          We design, build, and automate web infrastructure for operators
          who move fast and demand results.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn-primary">Start a Project</a>
          <a href="#services" className="btn-secondary">See What We Build</a>
        </div>
        <p className="trust-line">No retainers. No bloat. Just execution.</p>
      </section>

      {/* ── SERVICES ── */}
      <section className="section-light" id="services">
        <div className="section-inner">
          <div className="section-label">What We Build</div>
          <h2 className="section-heading">Everything your digital presence needs.</h2>
          <p className="section-sub">
            From conversion-focused websites to end-to-end automation —
            we build it and make it run.
          </p>
          <div className="services-grid">
            {services.map((s) => (
              <div key={s.title} className="service-card">
                <span className="service-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <div className="section-dark" id="process">
        <div className="section-inner">
          <div className="section-label-inv">How It Works</div>
          <h2 className="section-heading-inv">Four steps from brief to live.</h2>
          <p className="section-sub-inv">
            A focused process that eliminates back-and-forth and gets you live fast.
          </p>
          <div className="process-grid">
            {steps.map((step) => (
              <div key={step.number} className="process-step">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROOF / OUTCOMES ── */}
      <div className="section-dark" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <hr className="divider-dark" />
          <div className="section-label-inv">Results</div>
          <h2 className="section-heading-inv">
            Built for operators who measure outcomes.
          </h2>
          <div className="proof-grid" style={{ marginTop: '2.5rem' }}>
            {stats.map((s) => (
              <div key={s.stat} className="proof-card">
                <div className="proof-stat">{s.stat}</div>
                <div className="proof-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="outcomes-list">
            {outcomes.map((o) => (
              <div key={o} className="outcome-item">
                <div className="outcome-check">✓</div>
                <span>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <section className="cta-section" id="contact">
        <h2>Ready to build something that performs?</h2>
        <p>Tell us about your project. We scope it, price it, and execute.</p>
        <a href="mailto:hello@shox.co" className="btn-primary-lg">
          Start a Project
        </a>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span className="footer-brand">SHOX</span>
        <span className="footer-copy">© {new Date().getFullYear()} SHOX. All rights reserved.</span>
      </footer>
    </>
  )
}
