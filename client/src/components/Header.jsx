
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/auth/authSlice'
 
/* ─── Gen-Z Header ──────────────────────────────────────────────────────────
   Aesthetic: dark glass navbar · neon lime accent · spring scale buttons
   scroll-shrink effect · mobile menu slide-down
   ─────────────────────────────────────────────────────────────────────────── */
 
const styles = `

 
  .hdr-root { font-family: 'DM Sans', sans-serif; }
 
  /* ── shell ── */
  .hdr-bar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(10, 10, 14, 0.78);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    box-shadow: 0 1px 0 rgba(200,255,100,0.06), 0 4px 24px rgba(0,0,0,0.35);
    transition: padding 0.35s cubic-bezier(0.22,1,0.36,1),
                background 0.35s ease;
    animation: hdr-fadeDown 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
 
  @keyframes hdr-fadeDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
 
  .hdr-bar.scrolled {
    background: rgba(8, 8, 11, 0.92);
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
 
  .hdr-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0.9rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    transition: padding 0.35s cubic-bezier(0.22,1,0.36,1);
  }
  .hdr-bar.scrolled .hdr-inner { padding-top: 0.55rem; padding-bottom: 0.55rem; }
 
  /* ── logo ── */
  .hdr-logo {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    text-decoration: none;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hdr-logo:hover { transform: scale(1.04); }
 
  .hdr-logo-mark {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #c8ff6e 0%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 0.8rem;
    color: #0a0a0e;
    letter-spacing: -0.03em;
    box-shadow: 0 0 16px rgba(200,255,100,0.25);
    transition: box-shadow 0.35s ease;
  }
  .hdr-logo:hover .hdr-logo-mark { box-shadow: 0 0 28px rgba(200,255,100,0.45); }
 
  .hdr-logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.3rem;
    letter-spacing: -0.03em;
    background: linear-gradient(90deg, #c8ff6e, #b47dff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
 
  /* ── desktop nav ── */
  .hdr-nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
 
  @media (max-width: 768px) { .hdr-nav { display: none; } }
 
  .hdr-link {
    position: relative;
    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(200,200,215,0.65);
    text-decoration: none;
    border-radius: 8px;
    transition: color 0.22s ease, background 0.22s ease;
  }
  .hdr-link::after {
    content: '';
    position: absolute;
    bottom: 2px; left: 50%; right: 50%;
    height: 2px;
    border-radius: 2px;
    background: #c8ff6e;
    transition: left 0.28s cubic-bezier(0.34,1.56,0.64,1),
                right 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hdr-link:hover {
    color: #c8ff6e;
    background: rgba(200,255,100,0.06);
  }
  .hdr-link:hover::after { left: 0.75rem; right: 0.75rem; }
 
  /* ── user name pill ── */
  .hdr-user {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.85rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: rgba(200,200,215,0.85);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 999px;
    text-decoration: none;
    transition:
      background 0.25s ease,
      transform 0.32s cubic-bezier(0.34,1.56,0.64,1),
      color 0.25s ease;
  }
  .hdr-user:hover {
    background: rgba(200,255,100,0.08);
    color: #c8ff6e;
    transform: scale(1.04);
  }
 
  /* ── cta buttons ── */
  .hdr-btn {
    padding: 0.45rem 1.1rem;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition:
      transform 0.32s cubic-bezier(0.34,1.56,0.64,1),
      box-shadow 0.32s ease;
  }
 
  .hdr-btn-signup {
    background: linear-gradient(135deg, #c8ff6e 0%, #a3e635 100%);
    color: #0a0a0e;
    box-shadow: 0 0 0 0 rgba(200,255,100,0);
  }
  .hdr-btn-signup:hover {
    transform: scale(1.07) translateY(-1px);
    box-shadow: 0 0 22px rgba(200,255,100,0.4);
  }
 
  .hdr-btn-login {
    background: rgba(255,255,255,0.05);
    color: rgba(200,200,215,0.8);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .hdr-btn-login:hover {
    transform: scale(1.05);
    background: rgba(255,255,255,0.09);
    color: #fff;
  }
 
  .hdr-btn-logout {
    background: rgba(255, 60, 80, 0.12);
    color: #ff6b7a;
    border: 1px solid rgba(255,60,80,0.22);
  }
  .hdr-btn-logout:hover {
    transform: scale(1.06) translateY(-1px);
    background: rgba(255, 60, 80, 0.22);
    box-shadow: 0 0 18px rgba(255,60,80,0.25);
    color: #ff8fa0;
  }
 
  /* ── mobile hamburger ── */
  .hdr-burger {
    display: none;
    flex-direction: column;
    gap: 5px;
    padding: 0.4rem;
    background: transparent;
    border: none;
    cursor: pointer;
  }
  @media (max-width: 768px) { .hdr-burger { display: flex; } }
 
  .hdr-burger span {
    display: block;
    width: 22px; height: 2px;
    border-radius: 2px;
    background: rgba(200,200,215,0.7);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                opacity 0.2s ease;
  }
  .hdr-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hdr-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hdr-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
 
  /* ── mobile menu ── */
  .hdr-mobile {
    display: none;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0 1.5rem 1rem;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s cubic-bezier(0.22,1,0.36,1),
                padding 0.3s ease;
  }
  @media (max-width: 768px) { .hdr-mobile { display: flex; } }
  .hdr-mobile.open { max-height: 400px; padding-bottom: 1.2rem; }
 
  .hdr-mobile .hdr-link { padding: 0.6rem 0.75rem; font-size: 0.95rem; }
  .hdr-mobile .hdr-btn  { width: 100%; justify-content: center; padding: 0.65rem; }
  .hdr-mobile .hdr-user { width: fit-content; }
`
 
const Header = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
 
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
 
  const handleLogout = () => {
    dispatch(logoutUser())
    setMenuOpen(false)
    navigate('/')
  }
 
  const navLinks = (
    <>
      <Link to="/work"    className="hdr-link" onClick={() => setMenuOpen(false)}>Find Work</Link>
      <Link to="/talent"  className="hdr-link" onClick={() => setMenuOpen(false)}>Browse Talent</Link>
      <a                  className="hdr-link">How It Works</a>
    </>
  )
 
  const authLinks = user ? (
    <>
      <Link
        to={user?.isAdmin ? '/admin/dashboard' : '/auth/profile'}
        className="hdr-user"
        onClick={() => setMenuOpen(false)}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {user?.name}
      </Link>
      <button className="hdr-btn hdr-btn-logout" onClick={handleLogout}>Logout</button>
    </>
  ) : (
    <>
      <Link to="/login"    className="hdr-btn hdr-btn-login"  onClick={() => setMenuOpen(false)}>Login</Link>
      <Link to="/register" className="hdr-btn hdr-btn-signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
    </>
  )
 
  return (
   <div className="hdr-root">
  <style>{styles}</style>

  <header className={`hdr-bar${scrolled ? ' scrolled' : ''}`}>
    
    <div className="hdr-inner">

      {/* Logo */}
      <Link
        to="/"
        className="hdr-logo"
        onClick={() => setMenuOpen(false)}
      >
        <div className="hdr-logo-mark">KK</div>
        <span className="hdr-logo-text">Kaam-Karo</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hdr-nav">

        {/* Find Work */}
        <Link
          to="/work"
          className="hdr-link"
          onClick={() => setMenuOpen(false)}
        >
          Find Work
        </Link>

        {/* Browse Talent */}
        <Link
          to="/talents"
          className="hdr-link"
          onClick={() => setMenuOpen(false)}
        >
          Browse Talent
        </Link>

        {/* How It Works */}
        <Link
          to="/how-it-works"
          className="hdr-link"
          onClick={() => setMenuOpen(false)}
        >
          How It Works
        </Link>

        {/* Auth Section */}
        {user ? (
          <>
            <Link
              to={user?.isAdmin ? '/admin/dashboard' : '/auth/profile'}
              className="hdr-user"
              onClick={() => setMenuOpen(false)}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>

              {user?.name}
            </Link>

            <button
              className="hdr-btn hdr-btn-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hdr-btn hdr-btn-login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="hdr-btn hdr-btn-signup"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>

      {/* Mobile Burger */}
      <button
        className={`hdr-burger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>
    </div>

    {/* Mobile Menu */}
    <nav className={`hdr-mobile${menuOpen ? ' open' : ''}`}>

      <Link
        to="/work"
        className="hdr-link"
        onClick={() => setMenuOpen(false)}
      >
        Find Work
      </Link>

      <Link
        to="/talents"
        className="hdr-link"
        onClick={() => setMenuOpen(false)}
      >
        Browse Talent
      </Link>

      <Link
        to="/how-it-works"
        className="hdr-link"
        onClick={() => setMenuOpen(false)}
      >
        How It Works
      </Link>

      {user ? (
        <>
          <Link
            to={user?.isAdmin ? '/admin/dashboard' : '/auth/profile'}
            className="hdr-user"
            onClick={() => setMenuOpen(false)}
          >
            {user?.name}
          </Link>

          <button
            className="hdr-btn hdr-btn-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="hdr-btn hdr-btn-login"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>

          <Link
            to="/register"
            className="hdr-btn hdr-btn-signup"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
        </>
      )}
    </nav>
  </header>
</div>
  )
}
 
export default Header