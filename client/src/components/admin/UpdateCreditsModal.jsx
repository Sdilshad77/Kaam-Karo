import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { grantCredits } from '../../features/admin/adminSlice'

/* ─── Gen-Z UpdateCreditsModal ──────────────────────────────────────────────
   Dark glass · neon lime + violet · spring animations · backdrop blur
   ─────────────────────────────────────────────────────────────────────────── */

const css = `
  

  .ucm-overlay {
    position: fixed; inset: 0; z-index: 50;
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    background: rgba(5, 5, 8, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    animation: ucm-overlay-in 0.25s ease both;
  }
  @keyframes ucm-overlay-in { from{opacity:0} to{opacity:1} }

  .ucm-modal {
    width: 100%; max-width: 440px;
    border-radius: 22px;
    background: rgba(14, 14, 20, 0.92);
    border: 1px solid rgba(255,255,255,0.09);
    box-shadow:
      0 0 0 1px rgba(200,255,100,0.07),
      0 24px 64px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.06);
    overflow: hidden;
    animation: ucm-modal-in 0.38s cubic-bezier(0.34,1.56,0.64,1) both;
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }
  @keyframes ucm-modal-in {
    from { opacity:0; transform: scale(0.88) translateY(20px); }
    to   { opacity:1; transform: scale(1)    translateY(0);    }
  }

  /* noise overlay */
  .ucm-modal::before {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0; opacity: 0.5;
  }

  /* glow blob */
  .ucm-modal::after {
    content: ''; position: absolute;
    width: 260px; height: 260px; border-radius: 50%;
    background: radial-gradient(circle, rgba(200,255,100,0.07) 0%, transparent 70%);
    top: -80px; right: -60px; pointer-events: none; z-index: 0;
  }

  .ucm-inner { position: relative; z-index: 1; }

  /* ── HEAD ── */
  .ucm-head {
    padding: 1.6rem 1.8rem 1.2rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
  }

  .ucm-head-label {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #c8ff6e; margin-bottom: 0.35rem;
  }
  .ucm-head-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.15rem; letter-spacing: -0.02em; color: #f0f0f5;
    margin-bottom: 0.2rem;
  }
  .ucm-head-sub { font-size: 0.78rem; color: rgba(200,200,220,0.4); }

  .ucm-close {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: rgba(200,200,220,0.45);
    transition: background 0.22s ease, color 0.22s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ucm-close:hover { background: rgba(255,60,80,0.12); color: #ff6b7a; transform: scale(1.1) rotate(90deg); }

  /* ── BODY ── */
  .ucm-body { padding: 1.4rem 1.8rem; display: flex; flex-direction: column; gap: 1.1rem; }

  .ucm-field { display: flex; flex-direction: column; gap: 0.4rem; }

  .ucm-label {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: rgba(200,200,220,0.38);
  }

  .ucm-static {
    padding: 0.6rem 0.9rem; border-radius: 10px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    font-size: 0.875rem; color: rgba(200,200,220,0.55);
  }

  /* current credits display */
  .ucm-credits-display {
    padding: 0.6rem 0.9rem; border-radius: 10px;
    background: rgba(200,255,100,0.05); border: 1px solid rgba(200,255,100,0.15);
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1rem; color: #c8ff6e; letter-spacing: -0.01em;
  }

  .ucm-input {
    padding: 0.65rem 0.9rem; border-radius: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    color: #f0f0f5; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; width: 100%;
    transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  }
  .ucm-input::placeholder { color: rgba(200,200,220,0.25); }
  .ucm-input:focus {
    border-color: rgba(200,255,100,0.35);
    background: rgba(200,255,100,0.04);
    box-shadow: 0 0 0 3px rgba(200,255,100,0.08);
  }
  /* hide number spinners */
  .ucm-input[type=number]::-webkit-inner-spin-button,
  .ucm-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  .ucm-input[type=number] { -moz-appearance: textfield; }

  /* arrow hint row */
  .ucm-arrow-hint {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 0.75rem; color: rgba(200,200,220,0.3);
    margin-top: 0.1rem;
  }
  .ucm-arrow { color: #c8ff6e; font-size: 0.85rem; }
  .ucm-new-val {
    font-family: 'Syne', sans-serif; font-weight: 700; color: #c8ff6e;
  }

  /* ── FOOTER ── */
  .ucm-footer {
    padding: 1.1rem 1.8rem 1.6rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: flex-end; gap: 0.6rem;
  }

  .ucm-btn-cancel {
    padding: 0.5rem 1.1rem; border-radius: 10px;
    background: transparent; border: 1px solid rgba(255,255,255,0.09);
    color: rgba(200,200,220,0.5); font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: 0.85rem; cursor: pointer;
    transition: background 0.22s ease, color 0.22s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ucm-btn-cancel:hover { background: rgba(255,255,255,0.06); color: #e8e8f0; transform: scale(1.04); }

  .ucm-btn-submit {
    padding: 0.5rem 1.4rem; border-radius: 10px;
    background: #c8ff6e; color: #0a0a0e;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.85rem;
    border: none; cursor: pointer;
    transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.32s ease;
  }
  .ucm-btn-submit:hover {
    transform: scale(1.07) translateY(-1px);
    box-shadow: 0 0 20px rgba(200,255,100,0.35);
  }
  .ucm-btn-submit:disabled {
    background: rgba(255,255,255,0.08); color: rgba(200,200,220,0.3);
    cursor: not-allowed; transform: none; box-shadow: none;
  }
`

const UpdateCreditsModal = ({ handleModal, currentUser }) => {
  const [credits, setCredits] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = e => {
    e.preventDefault()
    if (!credits && credits !== 0) return
    dispatch(grantCredits({ _id: currentUser._id, credits: Number(credits) }))
    handleModal()
  }

  const newVal = credits !== '' ? Number(credits) : null

  return (
    <>
      <style>{css}</style>
      {/* clicking overlay closes modal */}
      <div className="ucm-overlay" onClick={e => { if (e.target === e.currentTarget) handleModal() }}>
        <div className="ucm-modal">
          <div className="ucm-inner">
            <form onSubmit={handleSubmit}>

              {/* HEAD */}
              <div className="ucm-head">
                <div>
                  <div className="ucm-head-label">Admin Action</div>
                  <div className="ucm-head-title">Update Credits</div>
                  <div className="ucm-head-sub">Adjust the credit balance for this user</div>
                </div>
                <button type="button" className="ucm-close" onClick={handleModal}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* BODY */}
              <div className="ucm-body">
                {/* user name */}
                <div className="ucm-field">
                  <div className="ucm-label">User</div>
                  <div className="ucm-static">{currentUser?.name}</div>
                </div>

                {/* current credits */}
                <div className="ucm-field">
                  <div className="ucm-label">Current Credits</div>
                  <div className="ucm-credits-display">{currentUser?.credits ?? 0}</div>
                </div>

                {/* new credits */}
                <div className="ucm-field">
                  <div className="ucm-label">New Credits</div>
                  <input
                    type="number"
                    value={credits}
                    onChange={e => setCredits(e.target.value)}
                    placeholder="Enter amount..."
                    className="ucm-input"
                    min="0"
                    autoFocus
                  />
                  {/* live preview */}
                  {newVal !== null && (
                    <div className="ucm-arrow-hint">
                      <span>{currentUser?.credits ?? 0}</span>
                      <span className="ucm-arrow">→</span>
                      <span className="ucm-new-val">{newVal}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER */}
              <div className="ucm-footer">
                <button type="button" className="ucm-btn-cancel" onClick={handleModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ucm-btn-submit"
                  disabled={credits === ''}
                >
                  Update Credits
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateCreditsModal