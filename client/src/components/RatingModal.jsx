import { useState } from "react";
import { useDispatch } from "react-redux";
import { createRating } from "../features/freelancer/freelancerSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";

const ratingCss = `
.rm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99998;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(6px);
  cursor: pointer;
}

.rm-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
  width: min(460px, calc(100vw - 2rem));
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px;
  background: #111116;
  border: 1px solid rgba(200,255,100,0.18);
  box-shadow: 0 24px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06);
  padding: 2rem;
  font-family: 'DM Sans', sans-serif;
  cursor: default;
}

.rm-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: .3rem;
}

.rm-sub {
  color: rgba(255,255,255,.5);
  font-size: .85rem;
  margin-bottom: 1.5rem;
}

/* ── STAR RATING using label+radio (bulletproof) ── */
.rm-stars-wrap {
  display: flex;
  gap: 4px;
  margin-bottom: 0.6rem;
  align-items: center;
}

.rm-star-label {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
  user-select: none;
  -webkit-user-select: none;
}

.rm-star-label:hover {
  transform: scale(1.25);
}

.rm-star-label:active {
  transform: scale(1.1);
}

.rm-star-label input[type="radio"] {
  display: none;
  pointer-events: none;
}

.rm-star-svg {
  width: 36px;
  height: 36px;
  display: block;
  transition: fill 0.12s ease, stroke 0.12s ease;
}

.rm-rating-text {
  font-size: 0.8rem;
  color: #f59e0b;
  font-weight: 600;
  margin-bottom: 1.25rem;
  min-height: 1.3em;
}

.rm-field-lbl {
  display: block;
  margin-bottom: .5rem;
  font-size: .72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: rgba(255,255,255,.5);
}

.rm-textarea {
  width: 100%;
  min-height: 110px;
  padding: .9rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.04);
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  resize: vertical;
  outline: none;
  margin-bottom: 1.3rem;
  transition: border-color 0.2s ease;
}

.rm-textarea:focus {
  border-color: #c8ff6e;
  background: rgba(200,255,100,0.03);
}

.rm-textarea::placeholder { color: rgba(255,255,255,0.2); }

.rm-actions {
  display: flex;
  justify-content: flex-end;
  gap: .7rem;
}

.rm-cancel-btn {
  padding: .65rem 1.1rem;
  border-radius: 10px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  transition: background 0.2s;
}
.rm-cancel-btn:hover { background: rgba(255,255,255,.12); }

.rm-submit-btn {
  padding: .65rem 1.4rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #c8ff6e, #a3e635);
  color: #0a0a0e;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
}
.rm-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(163,230,53,0.35); }
.rm-submit-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; box-shadow: none; }

.rm-trigger-btn {
  padding: .6rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(180,125,255,.3);
  background: rgba(180,125,255,.15);
  color: #b47dff;
  font-weight: 700;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}
.rm-trigger-btn:hover { background: rgba(180,125,255,.28); transform: scale(1.04); }
`;

const LABELS = ['', 'Poor 😕', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Excellent! 🌟'];

export function RatingModal({ onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { id } = useParams();

  const active = hovered || rating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error("Please select a star rating"); return; }
    if (!review.trim()) { toast.error("Please write a review"); return; }

    setSubmitting(true);
    try {
      const result = await dispatch(createRating({ id, rating, review }));
      if (createRating.fulfilled.match(result)) {
        toast.success("Review submitted! ⭐");
        setIsOpen(false);
        setRating(0);
        setReview("");
        setHovered(0);
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.payload || "Failed to submit review");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setRating(0);
    setReview("");
    setHovered(0);
  };

  return (
    <>
      <style>{ratingCss}</style>

      {/* Trigger */}
      <button onClick={() => setIsOpen(true)} className="rm-trigger-btn">
        ⭐ Add Review
      </button>

      {/* Portal — escapes overflow:hidden on fp-hero */}
      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div className="rm-overlay" onClick={handleClose} />

          {/* Modal — stop clicks from bubbling to backdrop */}
          <div className="rm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rm-title">Leave a Review ⭐</div>
            <div className="rm-sub">Share your experience with this freelancer</div>

            {/* Stars — label+radio: clicks always register */}
            <div className="rm-stars-wrap">
              {[1, 2, 3, 4, 5].map((n) => (
                <label
                  key={n}
                  className="rm-star-label"
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  title={LABELS[n]}
                >
                  {/* Hidden radio — onChange fires on label click */}
                  <input
                    type="radio"
                    name="rm-star-rating"
                    value={n}
                    checked={rating === n}
                    onChange={() => setRating(n)}
                  />
                  {/* Inline SVG — no library = no pointer-event quirks */}
                  <svg
                    className="rm-star-svg"
                    viewBox="0 0 24 24"
                    fill={active >= n ? "#f59e0b" : "none"}
                    stroke={active >= n ? "#f59e0b" : "rgba(255,255,255,0.25)"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </label>
              ))}
            </div>

            {/* Feedback text */}
            <div className="rm-rating-text">
              {active > 0 ? `${LABELS[active]} — ${active}/5 stars` : "Click a star to rate"}
            </div>

            {/* Review textarea — in a plain div, NOT a form to avoid portal form issues */}
            <label className="rm-field-lbl">Your Review</label>
            <textarea
              className="rm-textarea"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your experience here..."
              rows={4}
            />

            <div className="rm-actions">
              <button type="button" onClick={handleClose} className="rm-cancel-btn">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!rating || !review.trim() || submitting}
                className="rm-submit-btn"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}