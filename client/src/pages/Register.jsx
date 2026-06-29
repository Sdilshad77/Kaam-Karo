import { useDispatch, useSelector } from 'react-redux'
import { toast } from "react-toastify"
import { User, Mail, Lock, ArrowRight, Phone, User2Icon, Zap } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { registerUser } from '../features/auth/authSlice'
 
const styles = `

 
  * { box-sizing: border-box; margin: 0; padding: 0; }
 
  .reg-root {
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
 
  /* Noise texture overlay */
  .reg-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
  }
 
  /* Glow blobs */
  .blob-1 {
    position: fixed;
    top: -20%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(163,230,53,0.12) 0%, transparent 70%);
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
    background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    animation: blobFloat 10s ease-in-out infinite reverse;
  }
 
  @keyframes blobFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -20px) scale(1.05); }
  }
 
  .reg-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 980px;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    background: #0e1117;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.06);
    overflow: hidden;
    box-shadow: 0 0 0 1px rgba(163,230,53,0.05), 0 40px 80px rgba(0,0,0,0.6);
    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
 
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(40px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
 
  /* LEFT PANEL */
  .reg-left {
    background: #0a0c10;
    border-right: 1px solid rgba(255,255,255,0.05);
    padding: 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
 
  .reg-left::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(to top, rgba(163,230,53,0.04), transparent);
    pointer-events: none;
  }
 
  .logo-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 3rem;
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
 
  .left-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 3vw, 2.8rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -1.5px;
    margin-bottom: 1rem;
  }
 
  .left-headline .accent { color: #a3e635; }
  .left-headline .accent2 { color: #a78bfa; }
 
  .left-sub {
    color: rgba(255,255,255,0.4);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    font-weight: 300;
  }
 
  .feat-list { display: flex; flex-direction: column; gap: 0.9rem; }
 
  .feat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.75rem 1rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: default;
  }
 
  .feat-item:hover {
    background: rgba(163,230,53,0.05);
    border-color: rgba(163,230,53,0.15);
    transform: translateX(4px);
  }
 
  .feat-dot {
    width: 6px;
    height: 6px;
    background: #a3e635;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 8px #a3e635;
  }
 
  .feat-text {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.6);
    font-weight: 400;
  }
 
  .testimonial {
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
 
  .testi-quote {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.35);
    font-style: italic;
    line-height: 1.6;
    margin-bottom: 1rem;
    font-weight: 300;
  }
 
  .testi-author {
    display: flex;
    align-items: center;
    gap: 10px;
  }
 
  .testi-avatar {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #a3e635, #a78bfa);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 11px;
    color: #080a0f;
  }
 
  .testi-name {
    font-size: 0.82rem;
    font-weight: 600;
    color: rgba(255,255,255,0.7);
  }
 
  .testi-role {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.3);
    margin-top: 1px;
  }
 
  /* RIGHT PANEL - FORM */
  .reg-right {
    padding: 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
 
  .form-header { margin-bottom: 2rem; }
 
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: rgba(163,230,53,0.08);
    border: 1px solid rgba(163,230,53,0.2);
    border-radius: 100px;
    font-size: 0.7rem;
    font-weight: 600;
    color: #a3e635;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }
 
  .badge-dot {
    width: 5px;
    height: 5px;
    background: #a3e635;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
    box-shadow: 0 0 6px #a3e635;
  }
 
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
 
  .form-title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
    line-height: 1.1;
    margin-bottom: 0.4rem;
  }
 
  .form-sub { font-size: 0.85rem; color: rgba(255,255,255,0.3); font-weight: 300; }
 
  .fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
 
  .field-group { display: flex; flex-direction: column; gap: 6px; }
  .field-group.full { grid-column: 1 / -1; }
 
  .field-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding-left: 2px;
  }
 
  .field-wrap {
    position: relative;
  }
 
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
    padding: 0.8rem 1rem 0.8rem 2.75rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    color: #fff;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: all 0.25s ease;
  }
 
  .field-input::placeholder { color: rgba(255,255,255,0.18); }
 
  .field-input:focus {
    background: rgba(163,230,53,0.04);
    border-color: rgba(163,230,53,0.3);
    box-shadow: 0 0 0 3px rgba(163,230,53,0.06);
  }
 
  .field-wrap:focus-within .field-icon { color: #a3e635; }
 
  .terms-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.25rem;
    padding: 0 2px;
  }
 
  .terms-check {
    width: 16px;
    height: 16px;
    border-radius: 5px;
    border: 1px solid rgba(255,255,255,0.15);
    background: transparent;
    cursor: pointer;
    accent-color: #a3e635;
    flex-shrink: 0;
  }
 
  .terms-text { font-size: 0.78rem; color: rgba(255,255,255,0.3); }
 
  .terms-text a {
    color: #a3e635;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }
 
  .terms-text a:hover { color: #bef264; }
 
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
    box-shadow: 0 8px 20px rgba(163,230,53,0.25);
    position: relative;
    overflow: hidden;
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
    box-shadow: 0 12px 30px rgba(163,230,53,0.4);
    transform: translateY(-2px) scale(1.01);
  }
 
  .submit-btn:hover::before { opacity: 1; }
  .submit-btn:active { transform: scale(0.98); }
 
  .btn-arrow {
    width: 16px;
    height: 16px;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
 
  .submit-btn:hover .btn-arrow { transform: translateX(5px); }
 
  .login-link {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.82rem;
    color: rgba(255,255,255,0.3);
  }
 
  .login-link a {
    color: #a78bfa;
    font-weight: 700;
    text-decoration: none;
    transition: color 0.2s;
  }
 
  .login-link a:hover { color: #c4b5fd; }
 
  /* Loading state */
  .loading-screen {
    min-height: 100vh;
    background: #080a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
  }
 
  .loading-inner {
    text-align: center;
  }
 
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 2px solid rgba(163,230,53,0.1);
    border-top-color: #a3e635;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }
 
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
 
  .loading-text {
    color: rgba(255,255,255,0.3);
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
  }
 
  @media (max-width: 768px) {
    .reg-card { grid-template-columns: 1fr; }
    .reg-left { display: none; }
    .fields-grid { grid-template-columns: 1fr; }
    .field-group.full { grid-column: 1; }
  }
`
 
function Register() {
  const { user, isLoading, isError, message } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePic: "",
    password: "",
    confirmPassword: ""
  })
 
  const { name, email, password, confirmPassword, profilePic, phone } = formData
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
 
  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords don't match bro 💀")
    } else {
      dispatch(registerUser(formData))
    }
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
          <div className="loading-inner">
            <div className="loading-spinner" />
            <p className="loading-text">Setting you up...</p>
          </div>
        </div>
      </>
    )
  }
 
  return (
    <>
      <style>{styles}</style>
      <main className="reg-root">
        <div className="blob-1" />
        <div className="blob-2" />
 
        <div className="reg-card">
          {/* LEFT: Branding */}
          <div className="reg-left">
            <div>
              <div className="logo-wrap">
                <div className="logo-icon">KK</div>
                <span className="logo-text">Kaam<span>-Karo</span></span>
              </div>
 
              <h1 className="left-headline">
                The future of<br />
                <span className="accent">freelancing</span><br />
                is <span className="accent2">here.</span>
              </h1>
              <p className="left-sub">
                Join 50K+ freelancers & clients building real stuff together on our platform.
              </p>
 
              <div className="feat-list">
                {[
                  "Find top-tier freelance gigs",
                  "Zero platform BS, just work",
                  "Get paid fast, every time"
                ].map((f, i) => (
                  <div className="feat-item" key={i}>
                    <div className="feat-dot" />
                    <span className="feat-text">{f}</span>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="testimonial">
              <p className="testi-quote">
                "Landed ₹80k project in my first week. No cap, this platform is different."
              </p>
              <div className="testi-author">
                <div className="testi-avatar">AM</div>
                <div>
                  <p className="testi-name">Arjun M.</p>
                  <p className="testi-role">Full-Stack Dev · Mumbai</p>
                </div>
              </div>
            </div>
          </div>
 
          {/* RIGHT: Form */}
          <div className="reg-right">
            <div className="form-header">
              <div className="badge">
                <div className="badge-dot" />
                Free to join
              </div>
              <h2 className="form-title">Create account.</h2>
              <p className="form-sub">Fill in your details and let's get you in.</p>
            </div>
 
            <form onSubmit={handleSubmit}>
              <div className="fields-grid">
                <div className="field-group">
                  <label className="field-label">Full Name</label>
                  <div className="field-wrap">
                    <User className="field-icon" />
                    <input
                      name="name"
                      value={name}
                      onChange={handleChange}
                      type="text"
                      placeholder="John Doe"
                      className="field-input"
                    />
                  </div>
                </div>
 
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
                  <label className="field-label">Phone</label>
                  <div className="field-wrap">
                    <Phone className="field-icon" />
                    <input
                      name="phone"
                      value={phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="field-input"
                    />
                  </div>
                </div>
 
                <div className="field-group">
                  <label className="field-label">Profile Photo URL</label>
                  <div className="field-wrap">
                    <User2Icon className="field-icon" />
                    <input
                      name="profilePic"
                      value={profilePic}
                      onChange={handleChange}
                      type="url"
                      placeholder="https://..."
                      className="field-input"
                    />
                  </div>
                </div>
 
                <div className="field-group full">
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
                </div>
 
                <div className="field-group full">
                  <label className="field-label">Confirm Password</label>
                  <div className="field-wrap">
                    <Lock className="field-icon" />
                    <input
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      type="password"
                      placeholder="••••••••"
                      className="field-input"
                    />
                  </div>
                </div>
              </div>
 
              <div className="terms-row">
                <input type="checkbox" id="terms" className="terms-check" required />
                <label htmlFor="terms" className="terms-text">
                  I agree to the{" "}
                  <Link to="#">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="#">Privacy Policy</Link>.
                </label>
              </div>
 
              <button type="submit" className="submit-btn">
                Create Account
                <ArrowRight className="btn-arrow" />
              </button>
            </form>
 
            <p className="login-link">
              Already on Kaam-Karo?{" "}
              <Link to="/login">Log in →</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
 
export default Register