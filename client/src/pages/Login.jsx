import { Mail, Lock, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../features/auth/authSlice";

const styles = `


  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    background: #080a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 2rem 1rem;
  }

  .login-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
  }

  .blob-1 {
    position: fixed;
    top: -20%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(163,230,53,0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    animation: blobFloat 8s ease-in-out infinite;
  }

  .blob-2 {
    position: fixed;
    bottom: -20%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    animation: blobFloat 10s ease-in-out infinite reverse;
  }

  @keyframes blobFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -20px) scale(1.05); }
  }

  .login-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 980px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #0e1117;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.06);
    overflow: hidden;
    box-shadow: 0 0 0 1px rgba(163,230,53,0.04), 0 40px 80px rgba(0,0,0,0.6);
    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(40px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* LEFT PANEL */
  .login-left {
    background: #0a0c10;
    border-right: 1px solid rgba(255,255,255,0.05);
    padding: 3.5rem 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .login-left::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 200px;
    background: linear-gradient(to top, rgba(163,230,53,0.04), transparent);
    pointer-events: none;
  }

  /* Decorative grid lines */
  .login-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .logo-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 3.5rem;
    position: relative;
    z-index: 1;
  }

  .logo-icon {
    width: 38px;
    height: 38px;
    background: #a3e635;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 14px;
    color: #080a0f;
    letter-spacing: -0.5px;
  }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: white;
    letter-spacing: -0.5px;
  }

  .logo-text span { color: #a3e635; }

  .left-content { position: relative; z-index: 1; }

  .left-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(163,230,53,0.07);
    border: 1px solid rgba(163,230,53,0.15);
    border-radius: 100px;
    font-size: 0.68rem;
    font-weight: 600;
    color: #a3e635;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.2rem;
  }

  .tag-dot {
    width: 5px; height: 5px;
    background: #a3e635;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
    box-shadow: 0 0 6px #a3e635;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .left-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 3vw, 2.8rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.08;
    letter-spacing: -1.5px;
    margin-bottom: 1rem;
  }

  .left-headline .green { color: #a3e635; }
  .left-headline .purple { color: #a78bfa; }

  .left-sub {
    color: rgba(255,255,255,0.35);
    font-size: 0.875rem;
    line-height: 1.65;
    margin-bottom: 2.5rem;
    font-weight: 300;
    max-width: 280px;
  }

  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .stat-box {
    padding: 1rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px;
    transition: all 0.3s ease;
    cursor: default;
  }

  .stat-box:hover {
    background: rgba(163,230,53,0.04);
    border-color: rgba(163,230,53,0.12);
  }

  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #a3e635;
    letter-spacing: -1px;
    line-height: 1;
    margin-bottom: 3px;
  }

  .stat-label {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.3);
    font-weight: 400;
  }

  .testimonial {
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    position: relative;
    z-index: 1;
  }

  .testi-quote {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.3);
    font-style: italic;
    line-height: 1.6;
    margin-bottom: 1rem;
    font-weight: 300;
  }

  .testi-author { display: flex; align-items: center; gap: 10px; }

  .testi-avatar {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #a3e635, #a78bfa);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 11px;
    color: #080a0f;
    flex-shrink: 0;
  }

  .testi-name { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.65); }
  .testi-role { font-size: 0.72rem; color: rgba(255,255,255,0.28); margin-top: 1px; }

  /* RIGHT PANEL */
  .login-right {
    padding: 3.5rem 2.8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .form-header { margin-bottom: 2.2rem; }

  .welcome-back {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    margin-bottom: 0.6rem;
  }

  .form-title {
    font-family: 'Syne', sans-serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1.2px;
    line-height: 1.05;
    margin-bottom: 0.4rem;
  }

  .form-title .cursor {
    display: inline-block;
    width: 3px;
    height: 2rem;
    background: #a3e635;
    margin-left: 4px;
    vertical-align: middle;
    border-radius: 2px;
    animation: blink 1.1s step-end infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .form-sub { font-size: 0.85rem; color: rgba(255,255,255,0.28); font-weight: 300; }

  .field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem; }

  .field-label {
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding-left: 2px;
  }

  .field-wrap { position: relative; }

  .field-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 15px;
    height: 15px;
    color: rgba(255,255,255,0.2);
    transition: color 0.25s ease;
    pointer-events: none;
  }

  .field-input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 2.75rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    color: #fff;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: all 0.25s ease;
  }

  .field-input::placeholder { color: rgba(255,255,255,0.16); }

  .field-input:focus {
    background: rgba(163,230,53,0.04);
    border-color: rgba(163,230,53,0.3);
    box-shadow: 0 0 0 3px rgba(163,230,53,0.06);
  }

  .field-wrap:focus-within .field-icon { color: #a3e635; }

  .forgot-link {
    display: block;
    text-align: right;
    font-size: 0.75rem;
    color: rgba(167,139,250,0.7);
    text-decoration: none;
    font-weight: 500;
    margin-top: 6px;
    margin-bottom: 0.25rem;
    transition: color 0.2s;
  }

  .forgot-link:hover { color: #a78bfa; }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 1.25rem 0;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }

  .divider-text {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.2);
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .submit-btn {
    width: 100%;
    padding: 0.95rem 1.5rem;
    background: #a3e635;
    border: none;
    border-radius: 12px;
    color: #080a0f;
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: -0.3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 8px 20px rgba(163,230,53,0.2);
    position: relative;
    overflow: hidden;
    margin-bottom: 1.25rem;
  }

  .submit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.25s;
  }

  .submit-btn:hover {
    background: #bef264;
    box-shadow: 0 12px 30px rgba(163,230,53,0.35);
    transform: translateY(-2px) scale(1.01);
  }

  .submit-btn:hover::before { opacity: 1; }
  .submit-btn:active { transform: scale(0.98); }

  .btn-arrow {
    width: 16px; height: 16px;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .submit-btn:hover .btn-arrow { transform: translateX(5px); }

  .signup-link {
    text-align: center;
    font-size: 0.82rem;
    color: rgba(255,255,255,0.28);
  }

  .signup-link a {
    color: #a78bfa;
    font-weight: 700;
    text-decoration: none;
    transition: color 0.2s;
  }

  .signup-link a:hover { color: #c4b5fd; }

  .loading-screen {
    min-height: 100vh;
    background: #080a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
  }

  .loading-spinner {
    width: 40px; height: 40px;
    border: 2px solid rgba(163,230,53,0.1);
    border-top-color: #a3e635;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-text {
    color: rgba(255,255,255,0.3);
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .login-card { grid-template-columns: 1fr; }
    .login-left { display: none; }
    .login-right { padding: 2.5rem 1.75rem; }
  }
`

function Login() {
  const { user, isLoading, isError, message } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const { email, password } = formData

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(formData))
  }

  useEffect(() => {
    if (user) navigate("/")
    if (isError && message) toast.error(message)
  }, [isError, message, user])

  if (isLoading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-screen">
          <div>
            <div className="loading-spinner" />
            <p className="loading-text">Logging you in...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{styles}</style>
      <main className="login-root">
        <div className="blob-1" />
        <div className="blob-2" />

        <div className="login-card">
          {/* LEFT */}
          <div className="login-left">
            <div className="logo-wrap">
              <div className="logo-icon">KK</div>
              <span className="logo-text">Kaam<span>-Karo</span></span>
            </div>

            <div className="left-content">
              <div className="left-tag">
                <div className="tag-dot" />
                The future of freelancing
              </div>

              <h1 className="left-headline">
                Welcome<br />
                <span className="green">back</span> to<br />
                <span className="purple">the grind.</span>
              </h1>

              <p className="left-sub">
                Your next big project is one login away. Keep building.
              </p>

              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-num">50K+</div>
                  <div className="stat-label">Freelancers</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">₹2Cr+</div>
                  <div className="stat-label">Paid out</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">4.9★</div>
                  <div className="stat-label">Rating</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">24/7</div>
                  <div className="stat-label">Support</div>
                </div>
              </div>
            </div>

            <div className="testimonial">
              <p className="testi-quote">
                "Got my first ₹50k client within 3 days. Kaam-Karo is actually different."
              </p>
              <div className="testi-author">
                <div className="testi-avatar">NP</div>
                <div>
                  <p className="testi-name">Nadiya P.</p>
                  <p className="testi-role">UI Designer · Bangalore</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="login-right">
            <div className="form-header">
              <p className="welcome-back">Welcome back</p>
              <h2 className="form-title">
                Log back in.<span className="cursor" />
              </h2>
              <p className="form-sub">Enter your credentials to continue.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Email</label>
                <div className="field-wrap">
                  <Mail className="field-icon" />
                  <input
                    name="email"
                    value={email}
                    onChange={handleChange}
                    type="email"
                    placeholder="you@example.com"
                    className="field-input"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <Lock className="field-icon" />
                  <input
                    name="password"
                    value={password}
                    onChange={handleChange}
                    type="password"
                    placeholder="••••••••"
                    className="field-input"
                  />
                </div>
                <Link to="#" className="forgot-link">Forgot password?</Link>
              </div>

              <button type="submit" className="submit-btn">
                Log In
                <ArrowRight className="btn-arrow" />
              </button>
            </form>

            <p className="signup-link">
              New to Kaam-Karo?{" "}
              <Link to="/register">Create an account →</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default Login