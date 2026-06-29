import { Star, ExternalLink, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getFreelancers } from "../features/freelancer/freelancerSlice";
import LoadingScreen from "../components/LoadingScreen";

/* ─── Gen-Z Talents Page ────────────────────────────────────────────────────
   Dark · lime + violet neon · spring card hovers · staggered mount · search
   ─────────────────────────────────────────────────────────────────────────── */

const css = `


  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .tl-root {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e8f0;
    min-height: 100svh;
    overflow-x: hidden;
  }

  /* ── fixed ambient blobs ── */
  .tl-blob {
    position: fixed; border-radius: 50%;
    filter: blur(90px); pointer-events: none; z-index: 0;
  }
  .tl-blob-1 {
    width: 500px; height: 500px;
    background: rgba(180,125,255,0.07);
    top: -150px; left: -150px;
    animation: tl-float 12s ease-in-out infinite;
    will-change: transform;
  }
  .tl-blob-2 {
    width: 420px; height: 420px;
    background: rgba(200,255,100,0.06);
    bottom: -100px; right: -100px;
    animation: tl-float 15s ease-in-out infinite reverse;
    will-change: transform;
  }
  @keyframes tl-float { 0%,100%{transform:translate(0,0) translateZ(0)} 50%{transform:translate(20px,-24px) translateZ(0)} }

  /* animated grid */
  .tl-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(200,255,100,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,255,100,0.03) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 100%);
    animation: none;
  }
  @keyframes tl-grid { from{background-position:0 0} to{background-position:0 0} }

  /* noise */
  .tl-noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.4;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  }

  .tl-inner {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 5rem 1.5rem 6rem;
  }

  /* ── HEADING ── */
  .tl-head {
    text-align: center; margin-bottom: 3.5rem;
    animation: tl-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes tl-fade-up { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

  .tl-badge {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.28rem 0.9rem; border-radius: 999px;
    border: 1px solid rgba(200,255,100,0.22); background: rgba(200,255,100,0.07);
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.09em;
    text-transform: uppercase; color: #c8ff6e; margin-bottom: 1.3rem;
  }
  .tl-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #c8ff6e; box-shadow: 0 0 8px #c8ff6e;
    animation: tl-blink 1.8s ease-in-out infinite;
  }
  @keyframes tl-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

  .tl-h1 {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(2.2rem, 6vw, 4rem); letter-spacing: -0.04em; line-height: 1.07;
    color: #f0f0f5; margin-bottom: 1rem;
  }
  .tl-h1 em {
    font-style: normal;
    background: linear-gradient(90deg, #c8ff6e 0%, #b47dff 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .tl-sub {
    font-size: 1rem; color: rgba(200,200,220,0.5); max-width: 480px;
    margin: 0 auto 2rem; line-height: 1.7;
  }

  /* search */
  .tl-search-wrap {
    position: relative; max-width: 420px; margin: 0 auto;
    animation: tl-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s both;
  }
  .tl-search-icon {
    position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
    color: rgba(200,200,220,0.3); pointer-events: none;
  }
  .tl-search {
    width: 100%; padding: 0.7rem 1rem 0.7rem 2.6rem;
    border-radius: 12px; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09); color: #e8e8f0;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; outline: none;
    transition: border-color 0.22s ease, background 0.22s ease;
  }
  .tl-search::placeholder { color: rgba(200,200,220,0.28); }
  .tl-search:focus {
    border-color: rgba(200,255,100,0.3); background: rgba(200,255,100,0.03);
  }

  /* result count */
  .tl-count {
    text-align: center; margin-bottom: 1.8rem;
    font-size: 0.78rem; color: rgba(200,200,220,0.35);
    animation: tl-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.25s both;
  }
  .tl-count span { color: #c8ff6e; font-weight: 700; }

  /* ── GRID ── */
  .tl-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.1rem;
  }
  @media (max-width: 1100px) { .tl-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 760px)  { .tl-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px)  { .tl-grid { grid-template-columns: 1fr; } }

  /* ── CARD ── */
  .tl-card {
    position: relative; overflow: hidden;
    border-radius: 20px; padding: 1.5rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(12px);
    transition:
      transform 0.38s cubic-bezier(0.34,1.56,0.64,1),
      border-color 0.3s ease,
      box-shadow 0.38s ease;
    animation: tl-card-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes tl-card-in { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

  /* glow on hover */
  .tl-card::before {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    background: radial-gradient(circle at top left, rgba(200,255,100,0.06), transparent 60%);
    opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
  }
  .tl-card:hover {
    transform: translateY(-8px) scale(1.015);
    border-color: rgba(200,255,100,0.22);
    box-shadow: 0 20px 50px rgba(0,0,0,0.45), 0 0 40px rgba(200,255,100,0.05);
  }
  .tl-card:hover::before { opacity: 1; }

  /* ── CARD TOP ── */
  .tl-card-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 1.1rem; position: relative; z-index: 1;
  }

  .tl-avatar {
    width: 58px; height: 58px; border-radius: 50%;
    border: 2px solid rgba(200,255,100,0.2);
    object-fit: cover; background-size: cover; background-position: center;
    box-shadow: 0 0 14px rgba(200,255,100,0.1);
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
    flex-shrink: 0;
  }
  .tl-card:hover .tl-avatar {
    border-color: rgba(200,255,100,0.4);
    box-shadow: 0 0 24px rgba(200,255,100,0.2);
  }

  .tl-rating {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.2rem 0.6rem; border-radius: 999px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    font-size: 0.72rem; font-weight: 700; color: rgba(200,200,220,0.65);
    transition: border-color 0.25s ease;
  }
  .tl-card:hover .tl-rating { border-color: rgba(245,158,11,0.3); }

  /* ── CARD INFO ── */
  .tl-card-info { margin-bottom: 0.8rem; position: relative; z-index: 1; }

  .tl-name {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.05rem; color: #f0f0f5; letter-spacing: -0.01em;
    margin-bottom: 0.25rem;
    transition: color 0.25s ease;
  }
  .tl-card:hover .tl-name { color: #c8ff6e; }

  .tl-category {
    font-size: 0.75rem; font-weight: 700; color: #c8ff6e;
    letter-spacing: 0.04em; margin-bottom: 0.2rem;
  }
  .tl-exp {
    font-size: 0.72rem; color: rgba(200,200,220,0.38);
  }

  /* desc */
  .tl-desc {
    font-size: 0.8rem; color: rgba(200,200,220,0.45); line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
    overflow: hidden; margin-bottom: 0.9rem;
    position: relative; z-index: 1;
  }

  /* skills */
  .tl-skills {
    display: flex; flex-wrap: wrap; gap: 0.35rem;
    margin-bottom: 1.1rem; position: relative; z-index: 1;
  }
  .tl-skill {
    padding: 0.18rem 0.6rem; border-radius: 6px;
    font-size: 0.66rem; font-weight: 600; letter-spacing: 0.03em;
    background: rgba(200,255,100,0.06); color: rgba(200,255,100,0.65);
    border: 1px solid rgba(200,255,100,0.14);
    transition: background 0.22s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .tl-skill:hover { background: rgba(200,255,100,0.14); transform: scale(1.08); }

  /* cta */
  .tl-card-foot {
    padding-top: 0.9rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    position: relative; z-index: 1;
  }
  .tl-cta {
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    width: 100%; padding: 0.6rem;
    border-radius: 12px;
    background: linear-gradient(135deg, #c8ff6e 0%, #b47dff 100%);
    color: #0a0a0e; font-weight: 700; font-size: 0.82rem;
    text-decoration: none;
    transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.32s ease;
  }
  .tl-cta:hover {
    transform: scale(1.05) translateY(-1px);
    box-shadow: 0 0 22px rgba(200,255,100,0.3);
  }

  /* ── EMPTY ── */
  .tl-empty {
    grid-column: 1 / -1;
    display: flex; flex-direction: column; align-items: center; gap: 0.8rem;
    padding: 5rem 1rem; text-align: center;
  }
  .tl-empty-icon { font-size: 3rem; animation: tl-float 4s ease-in-out infinite; }
  .tl-empty-title { font-family:'Syne',sans-serif; font-weight:700; font-size:1.2rem; color:#f0f0f5; }
  .tl-empty-sub   { font-size:0.85rem; color:rgba(200,200,220,0.38); }
`;

export default function Talents() {
  const {
    freelancers,
    freelancerLoading,
    freelancerError,
    freelancerErrorMessage,
  } = useSelector((state) => state.freelancer);

  const dispatch = useDispatch();

  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(getFreelancers());
  }, [dispatch, ]);

  useEffect(() => {
    if (freelancerError && freelancerErrorMessage)
      toast.error(freelancerErrorMessage);
  }, [freelancerError, freelancerErrorMessage]);

  if (freelancerLoading) return <LoadingScreen />;

  const filtered =
    freelancers?.filter(
      (t) =>
        !query ||
        t?.user?.name?.toLowerCase().includes(query.toLowerCase()) ||
        t?.category?.toLowerCase().includes(query.toLowerCase()) ||
        t?.skills?.toLowerCase().includes(query.toLowerCase()),
    ) ?? [];

  return (
    <div className="tl-root">
      <style>{css}</style>
      <div className="tl-blob tl-blob-1" />
      <div className="tl-blob tl-blob-2" />
      <div className="tl-grid-bg" />
      <div className="tl-noise" />

      <main className="tl-inner">
        {/* ── HEADING ── */}
        <div className="tl-head">
          <div className="tl-badge">
            <span className="tl-badge-dot" />
            Verified Talent
          </div>
          <h1 className="tl-h1">
            Browse Top
            <br />
            <em>Freelancers</em>
          </h1>
          <p className="tl-sub">
            Hire expert freelancers for your projects and grow faster with
            world-class talent — all in one place.
          </p>

          {/* search */}
          <div className="tl-search-wrap">
            <span className="tl-search-icon">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search by name, skill or category..."
              className="tl-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* count */}
        <div className="tl-count">
          Showing <span>{filtered.length}</span> freelancer
          {filtered.length !== 1 ? "s" : ""}
          {query && ` for "${query}"`}
        </div>

        {/* ── GRID ── */}
        <div className="tl-grid">
          {filtered.length > 0 ? (
            filtered.map((talent, i) => {
              const ratingValue = talent?.rating ? Number(talent.rating).toFixed(1) : null
              return (
              <div
                key={talent._id}
                className="tl-card"
                style={{ animationDelay: `${i * 55}ms` }}
              >
                {/* top */}
                <div className="tl-card-top">
                  <div
                    className="tl-avatar"
                    style={{
                      backgroundImage: `url(${talent?.user?.profilePic || "https://i.pravatar.cc/150?u=" + talent._id})`,
                    }}
                  />
                  {ratingValue && (
                    <div className="tl-rating">
                      <Star size={11} fill="#f59e0b" color="#f59e0b" />
                      {ratingValue}
                    </div>
                  )}
                </div>

                {/* info */}
                <div className="tl-card-info">
                  <div className="tl-name">{talent?.user?.name}</div>
                  <div className="tl-category">{talent?.category}</div>
                  <div className="tl-exp">
                    {talent?.experience} yrs experience
                  </div>
                </div>

                {/* desc */}
                {talent?.description && (
                  <p className="tl-desc">{talent.description}</p>
                )}

                {/* skills */}
                {talent?.skills && (
                  <div className="tl-skills">
                    {talent.skills.split(",").map((s, j) => (
                      <span key={j} className="tl-skill">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* cta */}
                <div className="tl-card-foot">
                  <Link to={`/talent/${talent?.user?._id}`} className="tl-cta">
                    View Profile <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
              )
            })
          ) : (
            <div className="tl-empty">
              <div className="tl-empty-icon">🔍</div>
              <div className="tl-empty-title">
                {query ? `No results for "${query}"` : "No Freelancers Found"}
              </div>
              <div className="tl-empty-sub">
                {query
                  ? "Try a different name, skill, or category"
                  : "Check back soon — talent is on the way!"}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
