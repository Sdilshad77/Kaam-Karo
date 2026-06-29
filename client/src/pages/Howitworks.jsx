import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ─── How It Works — Kaam-Karo ──────────────────────────────────────────────
   Dark glass · neon lime + violet · scroll-reveal steps · spring hovers
   ─────────────────────────────────────────────────────────────────────────── */

const css = `


  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hiw-root {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e8f0;
    min-height: 100svh;
    overflow-x: hidden;
  }

  /* ── fixed bg ── */
  .hiw-bg-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(200,255,100,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,255,100,0.035) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 100%);
    animation: none;
  }
  @keyframes hiw-grid { from{background-position:0 0} to{background-position:0 0} }

  .hiw-blob {
    position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0;
  }
  .hiw-blob-1 { width:450px;height:450px; background:rgba(200,255,100,0.06); top:-120px;left:-100px; animation:hiw-float 12s ease-in-out infinite; will-change:transform; }
  .hiw-blob-2 { width:380px;height:380px; background:rgba(180,125,255,0.07); bottom:-80px;right:-80px; animation:hiw-float 15s ease-in-out infinite reverse; will-change:transform; }
  @keyframes hiw-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(18px,-22px)} }

  /* ── HERO ── */
  .hiw-hero {
    position: relative; z-index: 1;
    padding: 7rem 1.5rem 5rem;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    overflow: hidden;
  }

  /* big decorative number behind hero */
  .hiw-hero-bg-text {
    position: absolute;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(10rem, 25vw, 20rem);
    letter-spacing: -0.06em; line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(200,255,100,0.06);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap; pointer-events: none; user-select: none;
    z-index: 0;
  }

  .hiw-hero-inner { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; }

  .hiw-badge {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.28rem 0.9rem; border-radius: 999px;
    border: 1px solid rgba(200,255,100,0.22); background: rgba(200,255,100,0.07);
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.09em;
    text-transform: uppercase; color: #c8ff6e; margin-bottom: 1.4rem;
    animation: hiw-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }
  .hiw-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #c8ff6e; box-shadow: 0 0 8px #c8ff6e;
    animation: hiw-blink 1.8s ease-in-out infinite;
  }
  @keyframes hiw-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

  .hiw-h1 {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(2.5rem, 7vw, 4.5rem);
    letter-spacing: -0.04em; line-height: 1.05;
    color: #f0f0f5; margin-bottom: 1.2rem;
    animation: hiw-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.18s both;
  }
  .hiw-h1 em {
    font-style: normal;
    background: linear-gradient(90deg, #c8ff6e 0%, #b47dff 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .hiw-hero-sub {
    font-size: 1.05rem; color: rgba(200,200,220,0.52); line-height: 1.7;
    max-width: 520px; margin: 0 auto;
    animation: hiw-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.26s both;
  }

  @keyframes hiw-fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* ── SCROLL REVEAL ── */
  .hiw-reveal {
    opacity: 0; transform: translateY(28px);
    transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1);
  }
  .hiw-reveal.on { opacity: 1; transform: translateY(0); }

  /* ── ROLE TOGGLE ── */
  .hiw-toggle-section {
    position: relative; z-index: 1;
    padding: 4rem 1.5rem 2rem;
    display: flex; flex-direction: column; align-items: center;
  }

  .hiw-toggle {
    display: flex; gap: 0;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; padding: 4px;
    margin-bottom: 4rem;
  }
  .hiw-toggle-btn {
    padding: 0.5rem 1.6rem; border-radius: 9px;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.875rem;
    border: none; cursor: pointer;
    background: transparent; color: rgba(200,200,220,0.45);
    transition: background 0.28s ease, color 0.28s ease, transform 0.32s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hiw-toggle-btn.active {
    background: #c8ff6e; color: #0a0a0e;
    transform: scale(1.04);
  }

  /* ── STEPS ── */
  .hiw-steps-wrap {
    position: relative; z-index: 1;
    max-width: 900px; margin: 0 auto;
    padding: 0 1.5rem;
    display: flex; flex-direction: column; gap: 0;
  }

  /* connector line */
  .hiw-steps-wrap::before {
    content: '';
    position: absolute;
    left: calc(1.5rem + 28px); /* align with icon center */
    top: 28px; bottom: 28px;
    width: 1px;
    background: linear-gradient(to bottom, rgba(200,255,100,0.3), rgba(180,125,255,0.3), rgba(200,255,100,0.1));
    z-index: 0;
  }
  @media (max-width: 640px) { .hiw-steps-wrap::before { display: none; } }

  .hiw-step {
    position: relative; z-index: 1;
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 1.5rem;
    padding: 1.8rem 0;
    align-items: flex-start;
  }

  /* step icon column */
  .hiw-step-icon-col {
    display: flex; flex-direction: column; align-items: center;
    gap: 0; flex-shrink: 0;
  }

  .hiw-step-num-box {
    width: 56px; height: 56px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    transition:
      transform 0.38s cubic-bezier(0.34,1.56,0.64,1),
      box-shadow 0.35s ease,
      background 0.3s ease,
      border-color 0.3s ease;
    position: relative; z-index: 1;
    cursor: default;
  }

  .hiw-step:hover .hiw-step-num-box {
    transform: scale(1.12) rotate(-4deg);
  }

  /* step card */
  .hiw-step-card {
    padding: 1.6rem 1.8rem; border-radius: 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition:
      transform 0.38s cubic-bezier(0.34,1.56,0.64,1),
      border-color 0.3s ease,
      background 0.3s ease;
    overflow: hidden; position: relative;
  }
  .hiw-step-card::before {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    background: radial-gradient(circle at top left, rgba(200,255,100,0.06), transparent 60%);
    opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
  }
  .hiw-step:hover .hiw-step-card {
    transform: translateX(6px);
    border-color: rgba(200,255,100,0.2);
    background: rgba(200,255,100,0.02);
  }
  .hiw-step:hover .hiw-step-card::before { opacity: 1; }

  .hiw-step-tag {
    display: inline-block; padding: 0.18rem 0.6rem; border-radius: 6px;
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 0.7rem;
    background: rgba(200,255,100,0.08); color: #c8ff6e;
    border: 1px solid rgba(200,255,100,0.18);
  }
  .hiw-step-tag.violet {
    background: rgba(180,125,255,0.1); color: #b47dff;
    border-color: rgba(180,125,255,0.22);
  }

  .hiw-step-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.15rem; letter-spacing: -0.02em; color: #f0f0f5;
    margin-bottom: 0.55rem;
    transition: color 0.25s ease;
  }
  .hiw-step:hover .hiw-step-title { color: #c8ff6e; }

  .hiw-step-desc {
    font-size: 0.875rem; color: rgba(200,200,220,0.5); line-height: 1.65;
  }

  /* sub-points */
  .hiw-step-points {
    display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.9rem;
  }
  .hiw-step-point {
    display: flex; align-items: flex-start; gap: 0.5rem;
    font-size: 0.8rem; color: rgba(200,200,220,0.45); line-height: 1.5;
  }
  .hiw-step-point-dot {
    width: 5px; height: 5px; border-radius: 50%; background: #c8ff6e;
    flex-shrink: 0; margin-top: 0.45rem; opacity: 0.6;
  }

  /* ── FAQ SECTION ── */
  .hiw-faq-section {
    position: relative; z-index: 1;
    padding: 6rem 1.5rem;
  }
  .hiw-faq-inner { max-width: 700px; margin: 0 auto; }

  .hiw-faq-head { text-align: center; margin-bottom: 2.5rem; }
  .hiw-faq-label {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #c8ff6e; margin-bottom: 0.5rem;
  }
  .hiw-faq-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
    letter-spacing: -0.03em; color: #f0f0f5;
  }

  .hiw-faq-list { display: flex; flex-direction: column; gap: 0.6rem; }

  .hiw-faq-item {
    border-radius: 14px; overflow: hidden;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition: border-color 0.25s ease;
  }
  .hiw-faq-item.open { border-color: rgba(200,255,100,0.2); }

  .hiw-faq-q {
    width: 100%; text-align: left;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.2rem; gap: 1rem;
    background: transparent; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.9rem;
    color: rgba(200,200,220,0.75);
    transition: color 0.22s ease;
  }
  .hiw-faq-item.open .hiw-faq-q { color: #c8ff6e; }

  .hiw-faq-chevron {
    flex-shrink: 0; width: 20px; height: 20px; border-radius: 6px;
    background: rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), background 0.25s ease;
  }
  .hiw-faq-item.open .hiw-faq-chevron {
    transform: rotate(180deg); background: rgba(200,255,100,0.1);
  }

  .hiw-faq-a {
    max-height: 0; overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.22,1,0.36,1), padding 0.3s ease;
    font-size: 0.85rem; color: rgba(200,200,220,0.45); line-height: 1.7;
    padding: 0 1.2rem;
  }
  .hiw-faq-item.open .hiw-faq-a { max-height: 300px; padding: 0 1.2rem 1rem; }

  /* ── CTA ── */
  .hiw-cta {
    position: relative; z-index: 1;
    padding: 5rem 1.5rem 7rem; text-align: center; overflow: hidden;
  }
  .hiw-cta-bg {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 60% at 20% 50%, rgba(200,255,100,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 60% 60% at 80% 50%, rgba(180,125,255,0.07) 0%, transparent 60%);
  }
  .hiw-cta-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }

  .hiw-cta-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(2rem, 5vw, 3.5rem);
    letter-spacing: -0.04em; line-height: 1.08; color: #f0f0f5; margin-bottom: 1.1rem;
  }
  .hiw-cta-title em {
    font-style: normal;
    background: linear-gradient(90deg, #c8ff6e, #b47dff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .hiw-cta-sub {
    font-size: 0.95rem; color: rgba(200,200,220,0.48); line-height: 1.7; margin-bottom: 2.2rem;
  }
  .hiw-cta-btns { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }

  .hiw-btn-primary {
    padding: 0.75rem 1.8rem; border-radius: 12px;
    background: #c8ff6e; color: #0a0a0e;
    font-weight: 700; font-size: 0.9rem; text-decoration: none;
    border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem;
    transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.32s ease;
  }
  .hiw-btn-primary:hover { transform: scale(1.07) translateY(-2px); box-shadow: 0 0 28px rgba(200,255,100,0.4); }

  .hiw-btn-ghost {
    padding: 0.75rem 1.8rem; border-radius: 12px;
    background: transparent; color: rgba(200,200,220,0.75);
    font-weight: 600; font-size: 0.9rem; text-decoration: none;
    border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
    display: inline-flex; align-items: center; gap: 0.4rem;
    transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), background 0.22s, color 0.22s;
  }
  .hiw-btn-ghost:hover { transform: scale(1.04); background: rgba(255,255,255,0.06); color: #fff; }
`

/* ── scroll reveal hook ── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('on'); io.disconnect() } },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

const Rev = ({ children, delay = 0 }) => {
  const ref = useReveal()
  return (
    <div ref={ref} className="hiw-reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ── data ── */
const CLIENT_STEPS = [
  {
    num: '01', emoji: '📋',
    tag: 'Step 1', tagVariant: '',
    title: 'Post a Gig',
    desc: 'Describe what you need — budget, timeline, and required skills. Takes less than 2 minutes.',
    points: ['Set your budget in INR', 'Choose experience level', 'Add tech stack & category'],
    color: '#c8ff6e', glow: 'rgba(200,255,100,0.15)',
  },
  {
    num: '02', emoji: '📥',
    tag: 'Step 2', tagVariant: '',
    title: 'Receive Bids',
    desc: 'Verified freelancers review your gig and submit competitive bids with their proposals.',
    points: ['See freelancer profiles & past work', 'Compare bid amounts instantly', 'No spam — only relevant bids'],
    color: '#c8ff6e', glow: 'rgba(200,255,100,0.12)',
  },
  {
    num: '03', emoji: '✅',
    tag: 'Step 3', tagVariant: '',
    title: 'Accept & Collaborate',
    desc: 'Pick the best bid, accept it, and start collaborating. Payments are secured until work is done.',
    points: ['Escrow-protected payments', 'Direct messaging with freelancer', 'Milestone-based delivery'],
    color: '#b47dff', glow: 'rgba(180,125,255,0.15)',
  },
  {
    num: '04', emoji: '🚀',
    tag: 'Step 4', tagVariant: 'violet',
    title: 'Ship & Pay',
    desc: 'Review the delivered work, approve it, and release payment. Rate your experience.',
    points: ['Review before releasing payment', 'Request revisions if needed', 'Leave a rating for the freelancer'],
    color: '#b47dff', glow: 'rgba(180,125,255,0.12)',
  },
]

const FREELANCER_STEPS = [
  {
    num: '01', emoji: '👤',
    tag: 'Step 1', tagVariant: '',
    title: 'Build Your Profile',
    desc: 'Create a profile that showcases your skills, portfolio, and experience level.',
    points: ['Add portfolio projects with links', 'List your tech stack & skills', 'Set your experience level'],
    color: '#c8ff6e', glow: 'rgba(200,255,100,0.15)',
  },
  {
    num: '02', emoji: '🔍',
    tag: 'Step 2', tagVariant: '',
    title: 'Browse & Bid',
    desc: 'Browse active gigs that match your skills and submit a competitive bid with your proposal.',
    points: ['Filter by category & budget', 'Write a personalized bid', 'Highlight relevant past work'],
    color: '#c8ff6e', glow: 'rgba(200,255,100,0.12)',
  },
  {
    num: '03', emoji: '💬',
    tag: 'Step 3', tagVariant: '',
    title: 'Get Hired & Deliver',
    desc: 'Once your bid is accepted, collaborate directly with the client and deliver quality work.',
    points: ['Agree on milestones upfront', 'Communicate progress regularly', 'Deliver before the deadline'],
    color: '#b47dff', glow: 'rgba(180,125,255,0.15)',
  },
  {
    num: '04', emoji: '💸',
    tag: 'Step 4', tagVariant: 'violet',
    title: 'Get Paid',
    desc: 'Client reviews and approves your work — payment is released instantly to your account.',
    points: ['Funds secured via escrow', 'INR payout to your account', 'Build reputation with ratings'],
    color: '#b47dff', glow: 'rgba(180,125,255,0.12)',
  },
]

const FAQS = [
  { q: 'Is Kaam-Karo free to join?', a: 'Yes, signing up is completely free for both clients and freelancers. We charge a small platform fee only when a project is successfully completed.' },
  { q: 'How does payment security work?', a: 'Client funds are held in escrow when a bid is accepted. The payment is only released to the freelancer once the client approves the delivered work — protecting both parties.' },
  { q: 'Can I be both a client and a freelancer?', a: 'Absolutely. Your account supports both roles. Switch between posting gigs and bidding on them anytime from your profile.' },
  { q: 'How long does it take to get hired?', a: 'Most competitive profiles receive their first bid acceptance within 24–72 hours of bidding. Keeping your profile updated and writing personalized bids helps.' },
  { q: 'What if I\'m not satisfied with the work?', a: 'You can request revisions before approving payment. If there\'s a dispute, our support team mediates to reach a fair resolution for both parties.' },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`hiw-faq-item${open ? ' open' : ''}`}>
      <button className="hiw-faq-q" onClick={() => setOpen(o => !o)}>
        {q}
        <span className="hiw-faq-chevron">
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className="hiw-faq-a">{a}</div>
    </div>
  )
}

export default function HowItWorks() {
  const [role, setRole] = useState('client') // 'client' | 'freelancer'
  const steps = role === 'client' ? CLIENT_STEPS : FREELANCER_STEPS

  return (
    <div className="hiw-root">
      <style>{css}</style>
      <div className="hiw-bg-grid" />
      <div className="hiw-blob hiw-blob-1" />
      <div className="hiw-blob hiw-blob-2" />

      {/* ── HERO ── */}
      <section className="hiw-hero">
        <div className="hiw-hero-bg-text" aria-hidden="true">HOW</div>
        <div className="hiw-hero-inner">
          <div className="hiw-badge">
            <span className="hiw-badge-dot" /> Simple Process
          </div>
          <h1 className="hiw-h1">
            How <em>Kaam-Karo</em><br />Actually Works
          </h1>
          <p className="hiw-hero-sub">
            Four clear steps — whether you're hiring or getting hired.
            No confusion, no hidden gotchas, just results.
          </p>
        </div>
      </section>

      {/* ── ROLE TOGGLE ── */}
      <div className="hiw-toggle-section">
        <Rev>
          <div className="hiw-toggle">
            <button
              className={`hiw-toggle-btn${role === 'client' ? ' active' : ''}`}
              onClick={() => setRole('client')}
            >
              💼 I'm Hiring
            </button>
            <button
              className={`hiw-toggle-btn${role === 'freelancer' ? ' active' : ''}`}
              onClick={() => setRole('freelancer')}
            >
              🛠 I'm a Freelancer
            </button>
          </div>
        </Rev>

        {/* ── STEPS ── */}
        <div className="hiw-steps-wrap">
          {steps.map((step, i) => (
            <Rev key={`${role}-${i}`} delay={i * 80}>
              <div className="hiw-step">
                {/* icon col */}
                <div className="hiw-step-icon-col">
                  <div
                    className="hiw-step-num-box"
                    style={{
                      color: step.color,
                      borderColor: `${step.color}30`,
                      background: `${step.color}08`,
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{step.emoji}</span>
                  </div>
                </div>

                {/* card */}
                <div className="hiw-step-card">
                  <span className={`hiw-step-tag${step.tagVariant === 'violet' ? ' violet' : ''}`}>
                    {step.tag}
                  </span>
                  <div className="hiw-step-title">{step.title}</div>
                  <div className="hiw-step-desc">{step.desc}</div>
                  <div className="hiw-step-points">
                    {step.points.map((pt, j) => (
                      <div key={j} className="hiw-step-point">
                        <span className="hiw-step-point-dot" />
                        {pt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Rev>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <section className="hiw-faq-section">
        <div className="hiw-faq-inner">
          <Rev>
            <div className="hiw-faq-head">
              <div className="hiw-faq-label">Got Questions?</div>
              <div className="hiw-faq-title">Frequently Asked</div>
            </div>
          </Rev>
          <Rev delay={80}>
            <div className="hiw-faq-list">
              {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
            </div>
          </Rev>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hiw-cta">
        <div className="hiw-cta-bg" />
        <div className="hiw-cta-inner">
          <Rev>
            <div className="hiw-cta-title">
              Ready to <em>Start?</em>
            </div>
            <p className="hiw-cta-sub">
              Join thousands of clients and freelancers already building on Kaam-Karo.
              Sign up free — takes 60 seconds.
            </p>
            <div className="hiw-cta-btns">
              <Link to="/register" className="hiw-btn-primary">Get Started Free →</Link>
              <Link to="/work"     className="hiw-btn-ghost">Browse Gigs</Link>
            </div>
          </Rev>
        </div>
      </section>
    </div>
  )
}