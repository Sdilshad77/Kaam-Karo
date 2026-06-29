import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ─── Gen-Z Home Page ───────────────────────────────────────────────────────
   Aesthetic: deep dark · neon lime (#c8ff6e) + electric violet (#b47dff)
   Fonts: Syne 800 (display) + DM Sans (body)
   Motion: staggered mount · spring hovers · scroll-reveal · ticker tape
   ─────────────────────────────────────────────────────────────────────────── */

const css = `


  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hm-root {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e8f0;
    overflow-x: hidden;
  }

  /* ── shared helpers ── */
  .hm-lime   { color: #c8ff6e; }
  .hm-violet { color: #b47dff; }

  .hm-section {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* ─────────────── HERO ─────────────── */
  .hm-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 7rem 0 5rem;
  }

  /* animated grid bg */
  .hm-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(200,255,110,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,255,110,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%);
    animation: none;
  }
  @keyframes hm-grid-drift {
    from { background-position: 0 0; }
    to   { background-position: 0 0; }
  }

  /* noise grain */
  .hm-hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  .hm-hero-inner {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }
  @media (max-width: 900px) {
    .hm-hero-inner { grid-template-columns: 1fr; }
    .hm-hero-visual { display: none; }
  }

  /* badge */
  .hm-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0.9rem;
    border-radius: 999px;
    border: 1px solid rgba(200,255,110,0.25);
    background: rgba(200,255,110,0.06);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #c8ff6e;
    margin-bottom: 1.6rem;
    animation: hm-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }
  .hm-badge-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #c8ff6e;
    box-shadow: 0 0 8px #c8ff6e;
    animation: hm-blink 1.8s ease-in-out infinite;
  }
  @keyframes hm-blink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.3; }
  }

  /* hero heading */
  .hm-h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(2.6rem, 6vw, 5rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
    color: #f0f0f5;
    margin-bottom: 1.4rem;
    animation: hm-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  }
  .hm-h1 em {
    font-style: normal;
    background: linear-gradient(90deg, #c8ff6e 0%, #b47dff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hm-hero-sub {
    font-size: 1.05rem;
    color: rgba(220,220,240,0.6);
    line-height: 1.7;
    max-width: 480px;
    margin-bottom: 2.4rem;
    animation: hm-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.32s both;
  }

  /* cta row */
  .hm-cta-row {
    display: flex;
    gap: 0.85rem;
    flex-wrap: wrap;
    margin-bottom: 3.5rem;
    animation: hm-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.42s both;
  }

  .hm-btn-primary {
    padding: 0.75rem 1.8rem;
    border-radius: 12px;
    background: #c8ff6e;
    color: #0a0a0e;
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    box-shadow: 0 0 0 0 rgba(200,255,110,0);
    transition:
      transform 0.32s cubic-bezier(0.34,1.56,0.64,1),
      box-shadow 0.32s ease;
  }
  .hm-btn-primary:hover {
    transform: scale(1.07) translateY(-2px);
    box-shadow: 0 0 28px rgba(200,255,110,0.45);
  }

  .hm-btn-ghost {
    padding: 0.75rem 1.8rem;
    border-radius: 12px;
    background: transparent;
    color: rgba(220,220,240,0.8);
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.12);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition:
      transform 0.32s cubic-bezier(0.34,1.56,0.64,1),
      background 0.22s ease,
      color 0.22s ease;
  }
  .hm-btn-ghost:hover {
    transform: scale(1.04);
    background: rgba(255,255,255,0.06);
    color: #fff;
  }

  /* stats */
  .hm-stats {
    display: flex;
    align-items: center;
    gap: 2rem;
    animation: hm-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.52s both;
  }
  .hm-stat-num {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.8rem;
    color: #f0f0f5;
    letter-spacing: -0.03em;
  }
  .hm-stat-label { font-size: 0.75rem; color: rgba(200,200,220,0.5); margin-top: 0.1rem; }
  .hm-stat-div   { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }

  /* hero visual */
  .hm-hero-visual {
    position: relative;
    animation: hm-fade-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both;
  }

  .hm-hero-card {
    position: relative;
    border-radius: 24px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(200,255,110,0.3), rgba(180,125,255,0.3), transparent);
  }
  .hm-hero-card-inner {
    border-radius: 22px;
    background: rgba(18,18,26,0.9);
    backdrop-filter: blur(16px);
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .hm-card-tag {
    display: inline-block;
    padding: 0.2rem 0.65rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: rgba(200,255,110,0.1);
    color: #c8ff6e;
    border: 1px solid rgba(200,255,110,0.2);
    margin-bottom: 1rem;
  }

  .hm-card-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.15rem;
    color: #f0f0f5;
    margin-bottom: 0.6rem;
  }

  .hm-card-meta {
    font-size: 0.8rem;
    color: rgba(200,200,220,0.5);
    margin-bottom: 1.4rem;
  }

  .hm-card-bar {
    height: 6px;
    border-radius: 6px;
    background: rgba(255,255,255,0.07);
    margin-bottom: 0.5rem;
    overflow: hidden;
  }
  .hm-card-bar-fill {
    height: 100%;
    border-radius: 6px;
    background: linear-gradient(90deg, #c8ff6e, #b47dff);
    animation: hm-bar-grow 1.4s cubic-bezier(0.22,1,0.36,1) 0.8s both;
    transform-origin: left;
  }
  @keyframes hm-bar-grow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .hm-card-price {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.5rem;
    color: #c8ff6e;
    margin-top: 1rem;
  }
  .hm-card-price span { font-size: 0.85rem; color: rgba(200,200,220,0.45); font-family: 'DM Sans', sans-serif; font-weight: 400; }

  /* floating blobs */
  .hm-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
  }
  .hm-blob-1 {
    width: 280px; height: 280px;
    background: rgba(200,255,110,0.08);
    top: -80px; right: -80px;
    animation: hm-float 8s ease-in-out infinite;
  }
  .hm-blob-2 {
    width: 200px; height: 200px;
    background: rgba(180,125,255,0.1);
    bottom: -60px; left: -40px;
    animation: hm-float 10s ease-in-out infinite reverse;
  }
  @keyframes hm-float {
    0%,100% { transform: translate(0,0); }
    33%     { transform: translate(12px,-18px); }
    66%     { transform: translate(-8px,10px); }
  }

  /* ── TICKER ── */
  .hm-ticker {
    background: #c8ff6e;
    color: #0a0a0e;
    padding: 0.55rem 0;
    overflow: hidden;
    white-space: nowrap;
  }
  .hm-ticker-track {
    display: inline-flex;
    gap: 3rem;
    animation: hm-ticker 22s linear infinite;
  }
  .hm-ticker-item {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.82rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .hm-ticker-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(10,10,14,0.4); }
  @keyframes hm-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ─────────────── HOW IT WORKS ─────────────── */
  .hm-hiw {
    padding: 7rem 0;
    position: relative;
  }

  .hm-section-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #c8ff6e;
    margin-bottom: 0.75rem;
  }

  .hm-section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(1.9rem, 4vw, 3rem);
    color: #f0f0f5;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 0.75rem;
  }

  .hm-section-sub {
    font-size: 1rem;
    color: rgba(200,200,220,0.5);
    line-height: 1.6;
    max-width: 440px;
  }

  .hm-hiw-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 4rem;
  }
  @media (max-width: 768px) { .hm-hiw-grid { grid-template-columns: 1fr; } }

  .hm-step {
    position: relative;
    padding: 2rem;
    border-radius: 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition:
      transform 0.38s cubic-bezier(0.34,1.56,0.64,1),
      border-color 0.3s ease,
      background 0.3s ease;
    overflow: hidden;
  }
  .hm-step::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at top left, rgba(200,255,110,0.06), transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .hm-step:hover { transform: translateY(-8px) scale(1.01); border-color: rgba(200,255,110,0.2); }
  .hm-step:hover::before { opacity: 1; }

  .hm-step-num {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 4rem;
    line-height: 1;
    color: rgba(200,255,110,0.08);
    margin-bottom: 1.2rem;
    transition: color 0.3s ease;
  }
  .hm-step:hover .hm-step-num { color: rgba(200,255,110,0.18); }

  .hm-step-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    background: rgba(200,255,110,0.08);
    border: 1px solid rgba(200,255,110,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    margin-bottom: 1.2rem;
    transition: transform 0.38s cubic-bezier(0.34,1.56,0.64,1), background 0.3s;
  }
  .hm-step:hover .hm-step-icon { transform: scale(1.12) rotate(-4deg); background: rgba(200,255,110,0.14); }

  .hm-step-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: #f0f0f5;
    margin-bottom: 0.6rem;
  }
  .hm-step-desc { font-size: 0.875rem; color: rgba(200,200,220,0.5); line-height: 1.65; }

  /* ─────────────── CATEGORIES ─────────────── */
  .hm-cats { padding: 7rem 0; background: rgba(255,255,255,0.015); }

  .hm-cats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-top: 4rem;
  }
  @media (max-width: 1024px) { .hm-cats-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 540px)  { .hm-cats-grid { grid-template-columns: 1fr; } }

  .hm-cat {
    padding: 1.5rem;
    border-radius: 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    transition:
      transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
      border-color 0.28s ease,
      background 0.28s ease;
    text-decoration: none;
  }
  .hm-cat:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: rgba(200,255,110,0.25);
    background: rgba(200,255,110,0.04);
  }

  .hm-cat-icon {
    font-size: 1.8rem;
    margin-bottom: 0.9rem;
    display: block;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hm-cat:hover .hm-cat-icon { transform: scale(1.15) rotate(-5deg); }

  .hm-cat-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    color: #f0f0f5;
    margin-bottom: 0.3rem;
  }
  .hm-cat-desc { font-size: 0.78rem; color: rgba(200,200,220,0.42); line-height: 1.5; margin-bottom: 0.8rem; }
  .hm-cat-count { font-size: 0.72rem; font-weight: 700; color: #c8ff6e; letter-spacing: 0.04em; }

  /* ─────────────── WHY US ─────────────── */
  .hm-why { padding: 7rem 0; }

  .hm-why-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 4rem;
  }
  @media (max-width: 900px) { .hm-why-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 540px) { .hm-why-grid { grid-template-columns: 1fr; } }

  .hm-why-card {
    padding: 1.8rem;
    border-radius: 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    transition:
      transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
      border-color 0.3s ease;
  }
  .hm-why-card:hover {
    transform: translateY(-6px);
    border-color: rgba(180,125,255,0.25);
  }

  .hm-why-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    margin-bottom: 1.1rem;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hm-why-card:hover .hm-why-icon { transform: scale(1.12) rotate(-4deg); }

  .hm-why-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: #f0f0f5;
    margin-bottom: 0.5rem;
  }
  .hm-why-desc { font-size: 0.82rem; color: rgba(200,200,220,0.48); line-height: 1.65; }

  /* ─────────────── CTA ─────────────── */
  .hm-cta-section {
    padding: 7rem 0;
    position: relative;
    overflow: hidden;
  }

  .hm-cta-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 20% 50%, rgba(200,255,110,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 60% at 80% 50%, rgba(180,125,255,0.09) 0%, transparent 60%);
  }

  .hm-cta-box {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 680px;
    margin: 0 auto;
  }

  .hm-cta-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(2rem, 5vw, 3.5rem);
    letter-spacing: -0.04em;
    line-height: 1.08;
    color: #f0f0f5;
    margin-bottom: 1.2rem;
  }
  .hm-cta-title em {
    font-style: normal;
    background: linear-gradient(90deg, #c8ff6e, #b47dff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hm-cta-sub {
    font-size: 1rem;
    color: rgba(200,200,220,0.55);
    margin-bottom: 2.4rem;
    line-height: 1.7;
  }

  /* ─────────────── FOOTER ─────────────── */
  .hm-footer {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 5rem 0 2rem;
    background: rgba(5,5,8,0.6);
  }

  .hm-footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 4rem;
  }
  @media (max-width: 900px) { .hm-footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; } }
  @media (max-width: 540px) { .hm-footer-grid { grid-template-columns: 1fr; } }

  .hm-footer-brand {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-bottom: 1rem;
    text-decoration: none;
  }
  .hm-footer-mark {
    width: 34px; height: 34px;
    border-radius: 8px;
    background: linear-gradient(135deg, #c8ff6e, #7c3aed);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 0.72rem;
    color: #0a0a0e;
  }
  .hm-footer-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    background: linear-gradient(90deg, #c8ff6e, #b47dff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hm-footer-tagline { font-size: 0.82rem; color: rgba(200,200,220,0.38); line-height: 1.6; }

  .hm-footer-col-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    color: #f0f0f5;
    letter-spacing: 0.04em;
    margin-bottom: 1.1rem;
  }

  .hm-footer-links { display: flex; flex-direction: column; gap: 0.55rem; }
  .hm-footer-link {
    font-size: 0.82rem;
    color: rgba(200,200,220,0.42);
    text-decoration: none;
    transition: color 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
    display: inline-block;
  }
  .hm-footer-link:hover { color: #c8ff6e; transform: translateX(4px); }

  .hm-footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding-top: 1.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .hm-footer-copy { font-size: 0.78rem; color: rgba(200,200,220,0.28); }

  .hm-footer-socials { display: flex; gap: 1.2rem; }
  .hm-footer-social {
    font-size: 0.78rem;
    color: rgba(200,200,220,0.38);
    text-decoration: none;
    transition: color 0.22s ease;
  }
  .hm-footer-social:hover { color: #c8ff6e; }

  /* ── scroll reveal ── */
  .hm-reveal {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity 0.65s cubic-bezier(0.22,1,0.36,1),
      transform 0.65s cubic-bezier(0.22,1,0.36,1);
  }
  .hm-reveal.visible { opacity: 1; transform: translateY(0); }

  /* ── keyframes shared ── */
  @keyframes hm-fade-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`

/* ── data ──────────────────────────────────────────────────────────────────── */
const STEPS = [
  { icon: '👤', title: 'Create Your Profile', desc: 'Sign up and showcase your skills or describe your project needs in minutes.' },
  { icon: '🔍', title: 'Browse & Connect',    desc: 'Explore opportunities or find the perfect freelancer for your project.' },
  { icon: '💸', title: 'Work & Get Paid',     desc: 'Collaborate seamlessly and receive secure payments upon project completion.' },
]

const CATS = [
  { icon: '💻', name: 'Web Development',   desc: 'Stunning websites & apps',    count: '2,500+ gigs' },
  { icon: '🎨', name: 'UI/UX Design',      desc: 'Beautiful user experiences',  count: '1,800+ gigs' },
  { icon: '🤖', name: 'AI & ML',           desc: 'Intelligent solutions',       count: '950+ gigs'  },
  { icon: '📱', name: 'Mobile Dev',        desc: 'iOS and Android apps',        count: '1,200+ gigs' },
  { icon: '📊', name: 'Digital Marketing', desc: 'Grow your brand online',      count: '1,600+ gigs' },
  { icon: '✍️', name: 'Content Writing',  desc: 'Engaging content for you',    count: '2,100+ gigs' },
  { icon: '🎥', name: 'Video Production', desc: 'Pro video editing',           count: '880+ gigs'  },
  { icon: '📈', name: 'Biz Consulting',   desc: 'Strategic business advice',   count: '750+ gigs'  },
]

const WHY = [
  { icon: '🔒', bg: 'rgba(200,255,110,0.08)',  title: 'Secure Payments',        desc: 'Escrow-protected funds released only when you approve.' },
  { icon: '✅', bg: 'rgba(180,125,255,0.09)',  title: 'Verified Professionals', desc: 'Every freelancer is vetted before they join our platform.' },
  { icon: '💬', bg: 'rgba(59,220,180,0.08)',   title: '24/7 Support',           desc: 'Our team is always here to help you succeed.' },
  { icon: '🌍', bg: 'rgba(200,255,110,0.08)',  title: 'Global Opportunities',   desc: 'Connect with clients and talent from across the world.' },
  { icon: '🧠', bg: 'rgba(180,125,255,0.09)',  title: 'Smart Matching',         desc: 'AI-powered algorithm connects you with the perfect fit.' },
  { icon: '💰', bg: 'rgba(255,190,70,0.08)',   title: 'Low Fees',               desc: 'Transparent, competitive pricing — keep more of what you earn.' },
]

const TICKER_ITEMS = [
  '50K+ Freelancers', 'Secure Payments', '10K+ Projects', 'Global Talent',
  'AI Matching', '98% Satisfaction', 'Fast Payouts', 'Verified Pros',
]

/* ── scroll reveal hook ──────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); io.disconnect() } },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

/* ── subcomponents ──────────────────────────────────────────────────────── */
const RevealSection = ({ children, delay = 0, style = {} }) => {
  const ref = useReveal()
  return (
    <div ref={ref} className="hm-reveal" style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

/* ── Home ──────────────────────────────────────────────────────────────── */
const Home = () => {
  return (
    <div className="hm-root">
      <style>{css}</style>

      {/* ────── HERO ────── */}
      <section className="hm-hero">
        <div className="hm-hero-grid" />
        <div className="hm-section hm-hero-inner">
          {/* left */}
          <div>
            <div className="hm-badge">
              <span className="hm-badge-dot" />
              The Future of Freelancing
            </div>
            <h1 className="hm-h1">
              Connect With<br />
              Top <em>Freelance</em><br />
              Talent
            </h1>
            <p className="hm-hero-sub">
              Whether you're a client seeking expert freelancers or a professional
              chasing exciting projects — we bring opportunities to your fingertips.
            </p>
            <div className="hm-cta-row">
              <Link to="/auth/profile" className="hm-btn-primary">Post a Gig →</Link>
              <Link to="/work"        className="hm-btn-ghost">Find Work</Link>
            </div>
            <div className="hm-stats">
              <div>
                <div className="hm-stat-num">50K+</div>
                <div className="hm-stat-label">Active Freelancers</div>
              </div>
              <div className="hm-stat-div" />
              <div>
                <div className="hm-stat-num">10K+</div>
                <div className="hm-stat-label">Projects Completed</div>
              </div>
              <div className="hm-stat-div" />
              <div>
                <div className="hm-stat-num">98%</div>
                <div className="hm-stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* right — fake project card */}
          <div className="hm-hero-visual">
            <div className="hm-blob hm-blob-1" />
            <div className="hm-blob hm-blob-2" />
            <div className="hm-hero-card">
              <div className="hm-hero-card-inner">
                <span className="hm-card-tag">Web Development</span>
                <div className="hm-card-title">Build a Full-Stack SaaS Dashboard</div>
                <div className="hm-card-meta">Posted by Arjun M. · 2h ago</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(200,200,220,0.45)', marginBottom: '0.5rem' }}>
                  React · Node.js · Postgres
                </div>
                <div className="hm-card-bar">
                  <div className="hm-card-bar-fill" style={{ width: '72%' }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(200,200,220,0.35)', marginBottom: '0.4rem' }}>
                  8 bids · 72% match
                </div>
                <div className="hm-card-price">
                  ₹45,000 <span>/ fixed price</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────── TICKER ────── */}
      <div className="hm-ticker" aria-hidden="true">
        <div className="hm-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="hm-ticker-item">
              {item}
              <span className="hm-ticker-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ────── HOW IT WORKS ────── */}
      <section className="hm-hiw">
        <div className="hm-section">
          <RevealSection>
            <div className="hm-section-label">Process</div>
            <div className="hm-section-title">How It Works</div>
            <p className="hm-section-sub">Get started in three simple steps — no fluff, just results.</p>
          </RevealSection>
          <div className="hm-hiw-grid">
            {STEPS.map((s, i) => (
              <RevealSection key={i} delay={i * 90}>
                <div className="hm-step">
                  <div className="hm-step-num">0{i + 1}</div>
                  <div className="hm-step-icon">{s.icon}</div>
                  <div className="hm-step-title">{s.title}</div>
                  <div className="hm-step-desc">{s.desc}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────── CATEGORIES ────── */}
      <section className="hm-cats">
        <div className="hm-section">
          <RevealSection>
            <div className="hm-section-label">Explore</div>
            <div className="hm-section-title">Top Categories</div>
            <p className="hm-section-sub">Opportunities across every field you can think of.</p>
          </RevealSection>
          <div className="hm-cats-grid">
            {CATS.map((c, i) => (
              <RevealSection key={i} delay={i * 55}>
                <Link to={`/work`} className="hm-cat">
                  <span className="hm-cat-icon">{c.icon}</span>
                  <div className="hm-cat-name">{c.name}</div>
                  <div className="hm-cat-desc">{c.desc}</div>
                  <div className="hm-cat-count">{c.count}</div>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────── WHY US ────── */}
      <section className="hm-why">
        <div className="hm-section">
          <RevealSection>
            <div className="hm-section-label">Why Kaam-Karo</div>
            <div className="hm-section-title">Built Different</div>
            <p className="hm-section-sub">The platform crafted for modern freelancers and serious clients.</p>
          </RevealSection>
          <div className="hm-why-grid">
            {WHY.map((w, i) => (
              <RevealSection key={i} delay={i * 70}>
                <div className="hm-why-card">
                  <div className="hm-why-icon" style={{ background: w.bg }}>{w.icon}</div>
                  <div className="hm-why-title">{w.title}</div>
                  <div className="hm-why-desc">{w.desc}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ────── CTA BANNER ────── */}
      <section className="hm-cta-section">
        <div className="hm-cta-bg" />
        <div className="hm-section">
          <RevealSection>
            <div className="hm-cta-box">
              <div className="hm-cta-title">
                Ready to <em>Ship</em><br />Something Real?
              </div>
              <p className="hm-cta-sub">
                Thousands of freelancers and clients are already building their stories here.
                Your turn.
              </p>
              <div className="hm-cta-row" style={{ justifyContent: 'center' }}>
                <Link to="/register" className="hm-btn-primary">Start Freelancing →</Link>
                <Link to="/auth/profile" className="hm-btn-ghost">Post a Project</Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ────── FOOTER ────── */}
      <footer className="hm-footer">
        <div className="hm-section">
          <div className="hm-footer-grid">
            <div>
              <Link to="/" className="hm-footer-brand">
                <div className="hm-footer-mark">KK</div>
                <span className="hm-footer-name">Kaam-Karo</span>
              </Link>
              <p className="hm-footer-tagline">
                Connecting talented freelancers with exciting opportunities, worldwide.
              </p>
            </div>
            {[
              {
                title: 'For Freelancers',
                links: [
                  { label: 'Find Work',      to: '/work' },
                  { label: 'How It Works',   to: '/how-it-works' },
                  { label: 'Browse Talent',  to: '/talents' },
                ],
              },
              {
                title: 'For Clients',
                links: [
                  { label: 'Post a Project', to: '/auth/profile' },
                  { label: 'Browse Talent',  to: '/talents' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { label: 'Login',    to: '/login' },
                  { label: 'Register', to: '/register' },
                ],
              },
            ].map((col, i) => (
              <div key={i}>
                <div className="hm-footer-col-title">{col.title}</div>
                <div className="hm-footer-links">
                  {col.links.map((l, j) => (
                    <Link key={j} to={l.to} className="hm-footer-link">{l.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="hm-footer-bottom">
            <span className="hm-footer-copy">© 2025 Kaam-Karo. All rights reserved.</span>
            <div className="hm-footer-socials">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hm-footer-social">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hm-footer-social">LinkedIn</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hm-footer-social">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home