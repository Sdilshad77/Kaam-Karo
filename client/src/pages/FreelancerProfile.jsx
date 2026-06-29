import { Star, ExternalLink, ArrowLeft } from "lucide-react"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { getFreelancer, getRatings, clearFreelancerError } from "../features/freelancer/freelancerSlice"
import { Link, useParams } from "react-router-dom"
import { RatingModal } from "../components/RatingModal"
import LoadingScreen from "../components/LoadingScreen"

/* ─── Gen-Z FreelancerProfile ───────────────────────────────────────────────
   Dark glass · neon lime + violet · consistent with Kaam-Karo theme
   ─────────────────────────────────────────────────────────────────────────── */

const css = `


  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fp-root {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e8f0;
    min-height: 100svh;
    overflow-x: hidden;
  }

  .fp-bg-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(200,255,100,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,255,100,0.03) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black 20%, transparent 100%);
    animation: none;
  }
  @keyframes fp-grid { from { background-position: 0 0 } to { background-position: 0 0 } }

  .fp-blob {
    position: fixed; border-radius: 50%; filter: blur(100px);
    pointer-events: none; z-index: 0;
  }
  .fp-blob-1 {
    width: 450px; height: 450px;
    background: rgba(200,255,100,0.06);
    top: -120px; left: -100px;
    animation: fp-float 12s ease-in-out infinite;
    will-change: transform;
  }
  .fp-blob-2 {
    width: 380px; height: 380px;
    background: rgba(180,125,255,0.07);
    bottom: -80px; right: -80px;
    animation: fp-float 15s ease-in-out infinite reverse;
    will-change: transform;
  }
  @keyframes fp-float {
    0%, 100% { transform: translate(0, 0) }
    50%       { transform: translate(16px, -20px) }
  }

  .fp-inner {
    position: relative; z-index: 1;
    max-width: 1000px; margin: 0 auto;
    padding: 2.5rem 1.5rem 6rem;
  }

  .fp-back {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.8rem; font-weight: 600;
    color: rgba(200,200,220,0.42);
    text-decoration: none; margin-bottom: 2rem;
    transition: color 0.22s ease, gap 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .fp-back:hover { color: #c8ff6e; gap: 0.65rem; }

  /* ── HERO ── */
  .fp-hero {
    position: relative; overflow: hidden;
    border-radius: 22px; padding: 2rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
    margin-bottom: 1.5rem;
    animation: fp-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s both;
  }
  .fp-hero::after {
    content: ''; position: absolute;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(180,125,255,0.1) 0%, transparent 70%);
    top: -80px; right: -60px; pointer-events: none;
    animation: fp-float 9s ease-in-out infinite;
  }
  @keyframes fp-fade-up {
    from { opacity: 0; transform: translateY(20px) }
    to   { opacity: 1; transform: translateY(0) }
  }

  .fp-hero-inner {
    position: relative; z-index: 1;
    display: flex; flex-wrap: wrap; gap: 1.8rem; align-items: flex-start;
  }

  .fp-avatar-wrap { position: relative; flex-shrink: 0; }
  .fp-avatar {
    width: 110px; height: 110px; border-radius: 22px;
    object-fit: cover;
    border: 2px solid rgba(200,255,100,0.25);
    box-shadow: 0 0 28px rgba(200,255,100,0.12);
    display: block;
    transition: box-shadow 0.35s ease;
  }
  .fp-avatar:hover { box-shadow: 0 0 40px rgba(200,255,100,0.25); }

  .fp-avail {
    position: absolute; bottom: 6px; right: 6px;
    width: 14px; height: 14px; border-radius: 50%;
    background: #c8ff6e; border: 2px solid #09090d;
    box-shadow: 0 0 8px rgba(200,255,100,0.6);
    animation: fp-blink 2s ease-in-out infinite;
  }
  @keyframes fp-blink { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }

  .fp-hero-text { flex: 1; min-width: 0; }

  .fp-role-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.2rem 0.65rem; border-radius: 999px;
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase;
    background: rgba(180,125,255,0.12); color: #b47dff;
    border: 1px solid rgba(180,125,255,0.25); margin-bottom: 0.7rem;
  }

  .fp-name {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.7rem, 4vw, 2.6rem); letter-spacing: -0.03em;
    color: #f0f0f5; line-height: 1.08; margin-bottom: 0.35rem;
  }
  .fp-category {
    font-size: 0.9rem; font-weight: 700; color: #c8ff6e;
    letter-spacing: 0.03em; margin-bottom: 0.2rem;
  }
  .fp-exp { font-size: 0.8rem; color: rgba(200,200,220,0.42); margin-bottom: 0.9rem; }

  .fp-meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; }

  .fp-rating-pill {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.25rem 0.75rem; border-radius: 999px;
    background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.22);
    font-size: 0.78rem; font-weight: 700; color: #f59e0b;
  }
  .fp-review-count { font-size: 0.75rem; color: rgba(200,200,220,0.38); }

  .fp-hero-actions {
    display: flex; align-items: flex-start;
    flex-shrink: 0; padding-top: 0.2rem;
  }

  /* ── LAYOUT ── */
  .fp-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 1.5rem;
    align-items: start;
  }
  @media (max-width: 768px) {
    .fp-layout { grid-template-columns: 1fr; }
    .fp-right { position: static !important; }
  }

  /* ── SECTION CARD ── */
  .fp-section {
    border-radius: 18px; overflow: hidden;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition: border-color 0.28s ease;
    animation: fp-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  .fp-section:hover { border-color: rgba(200,255,100,0.12); }

  .fp-sec-head {
    padding: 1.1rem 1.4rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center;
    justify-content: space-between; gap: 0.75rem;
  }
  .fp-sec-title {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 0.95rem; color: #f0f0f5; letter-spacing: -0.01em;
  }
  .fp-sec-label {
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #c8ff6e;
  }
  .fp-sec-body { padding: 1.3rem 1.4rem; }

  .fp-left { display: flex; flex-direction: column; gap: 1.5rem; }

  .fp-about-text {
    font-size: 0.88rem; color: rgba(200,200,220,0.55); line-height: 1.75;
  }

  .fp-skills { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .fp-skill {
    padding: 0.25rem 0.7rem; border-radius: 8px;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em;
    background: rgba(200,255,100,0.07); color: #c8ff6e;
    border: 1px solid rgba(200,255,100,0.18);
    transition: background 0.22s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .fp-skill:hover { background: rgba(200,255,100,0.16); transform: scale(1.07); }

  .fp-portfolio-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
  }
  @media (max-width: 600px) { .fp-portfolio-grid { grid-template-columns: 1fr; } }

  .fp-proj-card {
    border-radius: 14px; overflow: hidden;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.28s ease;
  }
  .fp-proj-card:hover {
    transform: translateY(-5px) scale(1.01);
    border-color: rgba(200,255,100,0.2);
  }
  .fp-proj-img-wrap { aspect-ratio: 16/9; overflow: hidden; background: rgba(255,255,255,0.03); }
  .fp-proj-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; }
  .fp-proj-card:hover .fp-proj-img { transform: scale(1.07); }
  .fp-proj-body { padding: 0.9rem; }
  .fp-proj-title {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 0.9rem; color: #f0f0f5; margin-bottom: 0.35rem;
    transition: color 0.22s ease;
  }
  .fp-proj-card:hover .fp-proj-title { color: #c8ff6e; }
  .fp-proj-desc {
    font-size: 0.75rem; color: rgba(200,200,220,0.4); line-height: 1.55;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 0.7rem;
  }
  .fp-proj-link {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.72rem; font-weight: 700; color: #c8ff6e; text-decoration: none;
    transition: gap 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .fp-proj-link:hover { gap: 0.5rem; }

  .fp-right {
    display: flex; flex-direction: column; gap: 1.5rem;
    position: sticky; top: 5.5rem;
  }

  .fp-stat-list { display: flex; flex-direction: column; gap: 0.6rem; }
  .fp-stat-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.65rem 0.9rem; border-radius: 10px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    transition: border-color 0.22s ease;
  }
  .fp-stat-row:hover { border-color: rgba(200,255,100,0.15); }
  .fp-stat-key { font-size: 0.75rem; color: rgba(200,200,220,0.38); }
  .fp-stat-val {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 0.85rem; color: #f0f0f5;
  }
  .fp-stat-val.lime { color: #c8ff6e; }

  .fp-reviews-grid { display: flex; flex-direction: column; gap: 0.9rem; }

  .fp-review-card {
    padding: 1.1rem 1.3rem; border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition: border-color 0.28s ease, transform 0.32s cubic-bezier(0.34,1.56,0.64,1);
  }
  .fp-review-card:hover { border-color: rgba(200,255,100,0.15); transform: translateX(4px); }

  .fp-review-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;
  }
  .fp-review-rating-label {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: rgba(200,200,220,0.35);
  }
  .fp-stars { display: flex; align-items: center; gap: 0.18rem; }

  .fp-review-text {
    font-size: 0.82rem; color: rgba(200,200,220,0.5); line-height: 1.65; font-style: italic;
  }
  .fp-review-text::before { content: '"'; color: #c8ff6e; font-style: normal; font-weight: 700; margin-right: 1px; }
  .fp-review-text::after  { content: '"'; color: #c8ff6e; font-style: normal; font-weight: 700; margin-left: 1px; }

  .fp-no-reviews {
    padding: 2rem 1rem; text-align: center;
    font-size: 0.82rem; color: rgba(200,200,220,0.3);
  }

  /* ── Rating modal button override ── */
  .fp-rate-btn {
    padding: 0.5rem 1.1rem; border-radius: 10px;
    background: linear-gradient(135deg, #c8ff6e 0%, #a3e635 100%);
    color: #0a0a0e; font-weight: 700; font-size: 0.8rem;
    border: none; cursor: pointer;
    transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
    white-space: nowrap;
  }
  .fp-rate-btn:hover { transform: scale(1.06) translateY(-1px); box-shadow: 0 0 18px rgba(200,255,100,0.35); }
`

export default function FreelancerProfile() {
  const { user }     = useSelector(state => state.auth)
  const {
    freelancer,
    ratings,
    freelancerLoading,
    freelancerError,
    freelancerErrorMessage,
  } = useSelector(state => state.freelancer)

  const { id }   = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getFreelancer(id))
    dispatch(getRatings(id))
  }, [id, dispatch])

  useEffect(() => {
    if (freelancerError && freelancerErrorMessage) {
      toast.error(freelancerErrorMessage)
      dispatch(clearFreelancerError())
    }
  }, [freelancerError, freelancerErrorMessage, dispatch])

  if (freelancerLoading || !freelancer) return <LoadingScreen />

  const profile    = freelancer?.profile
  const prevWorks  = freelancer?.previousWorks ?? []
  const ratingsArr = ratings ?? []
  const avgRating  = ratingsArr.length
    ? (ratingsArr.reduce((a, r) => a + r.rating, 0) / ratingsArr.length).toFixed(1)
    : '—'

  const skills = profile?.skills
    ?.split(',')
    .map(s => s.trim())
    .filter(Boolean) ?? []

  return (
    <div className="fp-root">
      <style>{css}</style>
      <div className="fp-bg-grid" />
      <div className="fp-blob fp-blob-1" />
      <div className="fp-blob fp-blob-2" />

      <main className="fp-inner">

        {/* back */}
        <Link to="/talents" className="fp-back">
          <ArrowLeft size={14} /> Browse Talent
        </Link>

        {/* HERO */}
        <div className="fp-hero">
          <div className="fp-hero-inner">

            <div className="fp-avatar-wrap">
              <img
                src={profile?.user?.profilePic || 'https://i.pravatar.cc/150?u=' + id}
                alt={profile?.user?.name}
                className="fp-avatar"
              />
              <span className="fp-avail" title="Available for work" />
            </div>

            <div className="fp-hero-text">
              <div className="fp-role-badge">🛠 Freelancer</div>
              <div className="fp-name">{profile?.user?.name}</div>
              <div className="fp-category">{profile?.category}</div>
              <div className="fp-exp">{profile?.experience}+ years of experience</div>
              <div className="fp-meta-row">
                {ratingsArr.length > 0 ? (
                  <>
                    <div className="fp-rating-pill">
                      <Star size={12} fill="#f59e0b" color="#f59e0b" />
                      {avgRating}
                    </div>
                    <span className="fp-review-count">
                      {ratingsArr.length} review{ratingsArr.length !== 1 ? 's' : ''}
                    </span>
                  </>
                ) : (
                  <span className="fp-review-count">No reviews yet</span>
                )}
              </div>
            </div>

            {user && (
              <div className="fp-hero-actions">
                <RatingModal onSuccess={() => dispatch(getRatings(id))} />
              </div>
            )}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="fp-layout">

          {/* LEFT */}
          <div className="fp-left">

            {/* About */}
            <div className="fp-section" style={{ animationDelay: '0.10s' }}>
              <div className="fp-sec-head">
                <div className="fp-sec-title">About Me</div>
                <div className="fp-sec-label">Bio</div>
              </div>
              <div className="fp-sec-body">
                <p className="fp-about-text">
                  {profile?.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="fp-section" style={{ animationDelay: '0.16s' }}>
                <div className="fp-sec-head">
                  <div className="fp-sec-title">Expertise</div>
                  <div className="fp-sec-label">{skills.length} skills</div>
                </div>
                <div className="fp-sec-body">
                  <div className="fp-skills">
                    {skills.map((s, i) => (
                      <span key={i} className="fp-skill">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio */}
            {prevWorks.length > 0 && (
              <div className="fp-section" style={{ animationDelay: '0.22s' }}>
                <div className="fp-sec-head">
                  <div className="fp-sec-title">Portfolio</div>
                  <div className="fp-sec-label">{prevWorks.length} projects</div>
                </div>
                <div className="fp-sec-body">
                  <div className="fp-portfolio-grid">
                    {prevWorks.map(project => (
                      <div key={project._id} className="fp-proj-card">
                        <div className="fp-proj-img-wrap">
                          <img
                            src={project.projectImage || '/placeholder.svg'}
                            alt={project.projectLink}
                            className="fp-proj-img"
                          />
                        </div>
                        <div className="fp-proj-body">
                          <div className="fp-proj-title">
                            {project.projectLink}
                          </div>
                          {project.projectDescription && (
                            <div className="fp-proj-desc">
                              {project.projectDescription}
                            </div>
                          )}
                          <a
                            href={project.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fp-proj-link"
                          >
                            View Project <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="fp-section" style={{ animationDelay: '0.28s' }}>
              <div className="fp-sec-head">
                <div className="fp-sec-title">Client Reviews</div>
                <div className="fp-sec-label">{ratingsArr.length} reviews</div>
              </div>
              <div className="fp-sec-body">
                {ratingsArr.length > 0 ? (
                  <div className="fp-reviews-grid">
                    {ratingsArr.map(review => (
                      <div key={review._id} className="fp-review-card">
                        <div className="fp-review-top">
                          <div className="fp-review-rating-label">
                            Rating {review.rating}/5
                          </div>
                          <div className="fp-stars">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={i < review.rating ? '#f59e0b' : 'none'}
                                color={i < review.rating ? '#f59e0b' : 'rgba(200,200,220,0.2)'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="fp-review-text">{review.review}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="fp-no-reviews">
                    No reviews yet — be the first!
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT (sticky sidebar) */}
          <div className="fp-right">
            <div className="fp-section" style={{ animationDelay: '0.12s' }}>
              <div className="fp-sec-head">
                <div className="fp-sec-title">Quick Info</div>
              </div>
              <div className="fp-sec-body">
                <div className="fp-stat-list">
                  <div className="fp-stat-row">
                    <span className="fp-stat-key">Avg Rating</span>
                    <span className="fp-stat-val lime">⭐ {avgRating}</span>
                  </div>
                  <div className="fp-stat-row">
                    <span className="fp-stat-key">Reviews</span>
                    <span className="fp-stat-val">{ratingsArr.length}</span>
                  </div>
                  <div className="fp-stat-row">
                    <span className="fp-stat-key">Experience</span>
                    <span className="fp-stat-val">{profile?.experience}+ yrs</span>
                  </div>
                  <div className="fp-stat-row">
                    <span className="fp-stat-key">Projects</span>
                    <span className="fp-stat-val">{prevWorks.length}</span>
                  </div>
                  <div className="fp-stat-row">
                    <span className="fp-stat-key">Category</span>
                    <span className="fp-stat-val lime">{profile?.category}</span>
                  </div>
                  <div className="fp-stat-row">
                    <span className="fp-stat-key">Availability</span>
                    <span className="fp-stat-val lime">● Open</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
