import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createBid } from "../features/freelancer/freelancerSlice"
import { toast } from "react-toastify"
import { createPortal } from "react-dom"

const modalCss = `
  .bid-overlay {
    position: fixed; inset: 0; z-index: 99998;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
    animation: bid-fade-in 0.18s ease both;
    cursor: pointer;
  }
  @keyframes bid-fade-in { from { opacity: 0 } to { opacity: 1 } }

  .bid-modal {
    position: fixed; top: 50%; left: 50%; z-index: 99999;
    transform: translate(-50%, -50%);
    cursor: default;
    width: min(440px, calc(100vw - 2rem));
    border-radius: 20px;
    background: #111116;
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow: 0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06);
    padding: 1.8rem;
    font-family: 'DM Sans', sans-serif;
    animation: bid-slide-up 0.28s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes bid-slide-up {
    from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)) }
    to   { opacity: 1; transform: translate(-50%, -50%) }
  }

  .bid-modal-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.25rem; color: #f0f0f5; letter-spacing: -0.02em;
    margin-bottom: 0.3rem;
  }
  .bid-modal-sub {
    font-size: 0.8rem; color: rgba(200,200,220,0.4);
    margin-bottom: 1.4rem;
  }

  .bid-project-info {
    padding: 0.75rem 1rem; border-radius: 12px;
    background: rgba(200,255,100,0.05);
    border: 1px solid rgba(200,255,100,0.12);
    margin-bottom: 1.3rem;
  }
  .bid-project-name {
    font-weight: 700; font-size: 0.88rem; color: #c8ff6e; margin-bottom: 0.15rem;
  }
  .bid-project-budget {
    font-size: 0.75rem; color: rgba(200,200,220,0.4);
  }

  .bid-label {
    display: block; font-size: 0.75rem; font-weight: 600;
    color: rgba(200,200,220,0.5); letter-spacing: 0.06em;
    text-transform: uppercase; margin-bottom: 0.45rem;
  }
  .bid-input {
    width: 100%; padding: 0.7rem 1rem;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.10);
    color: #e8e8f0;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none;
    transition: border-color 0.22s ease, background 0.22s ease;
    margin-bottom: 1.3rem;
  }
  .bid-input:focus { border-color: rgba(200,255,100,0.4); background: rgba(200,255,100,0.03); }
  .bid-input::placeholder { color: rgba(200,200,220,0.25); }

  .bid-actions { display: flex; gap: 0.7rem; justify-content: flex-end; }

  .bid-cancel-btn {
    padding: 0.55rem 1.1rem; border-radius: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.10);
    color: rgba(200,200,220,0.6); font-weight: 600; font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.22s ease, color 0.22s ease;
  }
  .bid-cancel-btn:hover { background: rgba(255,255,255,0.09); color: #e8e8f0; }

  .bid-submit-btn {
    padding: 0.55rem 1.3rem; border-radius: 10px;
    background: linear-gradient(135deg, #c8ff6e 0%, #a3e635 100%);
    border: none; color: #0a0a0e; font-weight: 700; font-size: 0.85rem;
    cursor: pointer;
    transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, opacity 0.22s ease;
  }
  .bid-submit-btn:hover:not(:disabled) {
    transform: scale(1.06) translateY(-1px);
    box-shadow: 0 0 20px rgba(200,255,100,0.35);
  }
  .bid-submit-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .bid-trigger-btn {
    padding: 0.5rem 1.2rem; border-radius: 10px;
    background: linear-gradient(135deg, #c8ff6e 0%, #a3e635 100%);
    border: none; color: #0a0a0e; font-weight: 700; font-size: 0.82rem;
    cursor: pointer; white-space: nowrap;
    transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
  }
  .bid-trigger-btn:hover:not(:disabled) {
    transform: scale(1.06) translateY(-1px);
    box-shadow: 0 0 18px rgba(200,255,100,0.3);
  }
  .bid-trigger-btn.not-available {
    background: rgba(255,255,255,0.07);
    color: rgba(200,200,220,0.4);
    border: 1px solid rgba(255,255,255,0.08);
    cursor: not-allowed;
  }
  .bid-trigger-btn.need-login {
    background: rgba(180,125,255,0.15);
    color: #b47dff;
    border: 1px solid rgba(180,125,255,0.25);
  }
`

export function BidModal({ work }) {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { freelancerLoading } = useSelector(state => state.freelancer)

  const [isOpen,     setIsOpen]     = useState(false)
  const [bidAmount,  setBidAmount]  = useState("")
  const [submitting, setSubmitting] = useState(false)

  const isAccepted = work.status === "accepted" || work.status === "in-progress"

  const handleOpen = () => {
    if (!user) {
      toast.info("Please login to place a bid!")
      return
    }
    if (!user.isFreelancer) {
      toast.warning("Only freelancers can place bids. Register as a freelancer first.")
      return
    }
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount!")
      return
    }
    setSubmitting(true)
    try {
      const result = await dispatch(createBid({ projectId: work._id, amount: Number(bidAmount) }))
      if (createBid.fulfilled.match(result)) {
        toast.success("Bid placed successfully! 🎉")
        setIsOpen(false)
        setBidAmount("")
      } else {
        toast.error(result.payload || "Failed to place bid. Try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setBidAmount("")
  }

  return (
    <>
      <style>{modalCss}</style>

      <button
        onClick={handleOpen}
        disabled={isAccepted}
        className={`bid-trigger-btn${isAccepted ? ' not-available' : !user ? ' need-login' : ''}`}
      >
        {isAccepted ? "Not Available" : !user ? "Login to Bid" : "Place Bid"}
      </button>

      {isOpen && createPortal(
        <>
          <div className="bid-overlay" onClick={handleCancel} />
          <div className="bid-modal" onClick={(e) => e.stopPropagation()}>
          <div className="bid-modal-title">Place Your Bid</div>
          <div className="bid-modal-sub">Enter the amount you want to charge for this project</div>

          <div className="bid-project-info">
            <div className="bid-project-name">{work.title}</div>
            <div className="bid-project-budget">Client budget: ₹{work.budget?.toLocaleString('en-IN')} INR</div>
          </div>

          <label className="bid-label">Your Bid Amount (INR)</label>
          <input
            type="number"
            value={bidAmount}
            onChange={e => setBidAmount(e.target.value)}
            placeholder={`e.g. ${work.budget || '5000'}`}
            className="bid-input"
            autoFocus
            min="1"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />

          <div className="bid-actions">
            <button onClick={handleCancel} className="bid-cancel-btn">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={!bidAmount || submitting}
              className="bid-submit-btn"
            >
              {submitting ? "Sending..." : "Send Bid ✓"}
            </button>
          </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
