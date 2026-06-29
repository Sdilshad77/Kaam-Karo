import React from 'react'
import { BidModal } from './BidModal'

const STATUS_STYLES = {
  pending:     { bg: 'rgba(200,255,100,0.08)', color: '#c8ff6e',  border: 'rgba(200,255,100,0.2)' },
  'in-progress':{ bg: 'rgba(251,191,36,0.08)', color: '#fbbf24',  border: 'rgba(251,191,36,0.2)' },
  completed:   { bg: 'rgba(52,211,153,0.08)',  color: '#34d399',  border: 'rgba(52,211,153,0.2)' },
  rejected:    { bg: 'rgba(248,113,113,0.08)', color: '#f87171',  border: 'rgba(248,113,113,0.2)' },
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return 'N/A'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const cardCss = `


  .wc-card {
    position: relative; overflow: hidden;
    border-radius: 18px; padding: 1.5rem 1.6rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.28s ease, transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
  }
  .wc-card::before {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    background: radial-gradient(circle at top right, rgba(200,255,100,0.04), transparent 55%);
    opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
  }
  .wc-card:hover {
    border-color: rgba(200,255,100,0.18);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  }
  .wc-card:hover::before { opacity: 1; }

  .wc-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 1rem; margin-bottom: 0.9rem;
  }

  .wc-title-area { flex: 1; min-width: 0; }

  .wc-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.1rem; color: #f0f0f5; letter-spacing: -0.02em;
    margin-bottom: 0.3rem;
    transition: color 0.22s ease;
  }
  .wc-card:hover .wc-title { color: #c8ff6e; }

  .wc-meta {
    display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem 1.2rem;
    font-size: 0.75rem; color: rgba(200,200,220,0.38);
  }
  .wc-meta-item { display: flex; align-items: center; gap: 0.3rem; }

  .wc-cat-badge {
    display: inline-flex; align-items: center;
    padding: 0.22rem 0.65rem; border-radius: 999px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em;
    background: rgba(180,125,255,0.1); color: #b47dff;
    border: 1px solid rgba(180,125,255,0.22);
    white-space: nowrap; flex-shrink: 0;
  }

  .wc-desc {
    font-size: 0.85rem; color: rgba(200,200,220,0.45); line-height: 1.65;
    margin-bottom: 1rem;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  .wc-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1.1rem; }
  .wc-tag {
    padding: 0.2rem 0.6rem; border-radius: 6px;
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.03em;
    background: rgba(255,255,255,0.04); color: rgba(200,200,220,0.5);
    border: 1px solid rgba(255,255,255,0.07);
  }

  .wc-footer {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .wc-stats { display: flex; align-items: center; gap: 1.2rem; }
  .wc-stat { display: flex; align-items: center; gap: 0.4rem; }
  .wc-stat-icon { color: rgba(200,200,220,0.3); }
  .wc-budget {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1rem; color: #c8ff6e;
  }
  .wc-duration {
    font-size: 0.8rem; font-weight: 600; color: rgba(200,200,220,0.5);
  }
`

// Inject styles only once at module load time
if (typeof document !== 'undefined' && !document.getElementById('wc-styles')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'wc-styles'
  styleEl.textContent = cardCss
  document.head.appendChild(styleEl)
}

const WorkCard = ({ work }) => {
  const status = work.status || 'pending'
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.pending

  const tags = work.technology
    ? work.technology.split(',').map(t => t.trim()).filter(Boolean)
    : []

  return (
    <div className="wc-card">

        {/* top row */}
        <div className="wc-top">
          <div className="wc-title-area">
            <div className="wc-title">{work.title}</div>
            <div className="wc-meta">
              <span className="wc-meta-item">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Listed By &nbsp;<strong style={{ color: 'rgba(200,200,220,0.6)' }}>{work?.user?.name || 'Unknown'}</strong>
              </span>
              <span className="wc-meta-item">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(work.createdAt)}
              </span>
            </div>
          </div>
          <div className="wc-cat-badge">{work.category}</div>
        </div>

        {/* description */}
        <p className="wc-desc">{work.description}</p>

        {/* tech tags */}
        {tags.length > 0 && (
          <div className="wc-tags">
            {tags.map((t, i) => (
              <span key={i} className="wc-tag">{t}</span>
            ))}
          </div>
        )}

        {/* footer */}
        <div className="wc-footer">
          <div className="wc-stats">
            <div className="wc-stat">
              <svg className="wc-stat-icon" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="wc-budget">₹{work.budget?.toLocaleString('en-IN')} INR</span>
            </div>
            <div className="wc-stat">
              <svg className="wc-stat-icon" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="wc-duration">{work.duration} Days</span>
            </div>
            {/* status badge */}
            <span style={{
              padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.68rem',
              fontWeight: 700, letterSpacing: '0.04em',
              background: statusStyle.bg, color: statusStyle.color,
              border: `1px solid ${statusStyle.border}`,
              textTransform: 'capitalize'
            }}>
              {status}
            </span>
          </div>

          {(!work.freelancer && work.status === 'pending') && <BidModal work={work} />}
        </div>
    </div>
  )
}

export default WorkCard
