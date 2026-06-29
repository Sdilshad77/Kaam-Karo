import { Star, Edit2, Plus, Eye, CheckCircle, AlertCircle, Mail, UserCircle, Zap, ExternalLink, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { addPreviousProject, getFreelancer, becomeFreelancer, clearFreelancerError } from "../features/freelancer/freelancerSlice"
import { getBids, getProjects, acceptBid } from "../features/project/projectSlice"
import { updateProfile } from "../features/auth/authSlice"
import PostWorkForm from "../components/PostWorkForm"
import { toast } from "react-toastify"
import LoadingScreen from "../components/LoadingScreen"
const styles = `


  * { box-sizing: border-box; }

  .profile-root {
    min-height: 100vh;
    background: #080a0f;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    position: relative;
  }

  /* noise */
  .profile-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
  }

  /* ── COVER ── */
  .cover-wrap {
    position: relative;
    height: 260px;
    overflow: hidden;
  }

  .cover-img {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.4;
  }

  .cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 40%, #080a0f 100%);
  }

  .cover-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(163,230,53,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(163,230,53,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── PROFILE CARD ── */
  .profile-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem;
    position: relative;
    z-index: 1;
  }

  .profile-card {
    background: #0e1117;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 2rem;
    margin-top: -80px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    display: flex;
    gap: 1.75rem;
    align-items: flex-start;
    flex-wrap: wrap;
    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 16px;
    object-fit: cover;
    border: 3px solid #a3e635;
    box-shadow: 0 0 20px rgba(163,230,53,0.25);
    flex-shrink: 0;
  }

  .profile-info { flex: 1; min-width: 220px; }

  .profile-name {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -1px;
    color: #fff;
    margin-bottom: 0.25rem;
  }

  .profile-phone {
    font-size: 0.85rem;
    color: #a3e635;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }

  .profile-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: rgba(255,255,255,0.4);
  }

  .meta-item svg { color: #a3e635; }

  .stars-row {
    display: flex;
    align-items: center;
    gap: 3px;
    margin-bottom: 0.75rem;
  }

  .star-filled { color: #facc15; fill: #facc15; }
  .star-empty  { color: rgba(255,255,255,0.15); }

  .rating-text {
    margin-left: 8px;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.35);
    font-weight: 500;
  }

  .profile-bio {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.38);
    line-height: 1.6;
    font-weight: 300;
    max-width: 480px;
  }

  .edit-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.65rem 1.25rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: rgba(255,255,255,0.7);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
    white-space: nowrap;
    align-self: flex-start;
  }

  .edit-btn:hover {
    background: rgba(163,230,53,0.08);
    border-color: rgba(163,230,53,0.25);
    color: #a3e635;
  }

  /* ── MAIN CONTENT ── */
  .main-content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
    position: relative;
    z-index: 1;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #fff;
  }

  .section-title span { color: #a3e635; }

  /* ── PROJECT GRID ── */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    margin-bottom: 3rem;
  }

  .project-card {
    background: #0e1117;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
  }

  .project-card:hover {
    border-color: rgba(163,230,53,0.2);
    box-shadow: 0 0 30px rgba(163,230,53,0.06);
    transform: translateY(-3px);
  }

  .project-thumb {
    position: relative;
    height: 150px;
    background: #161b22;
    overflow: hidden;
  }

  .project-thumb img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
    opacity: 0.8;
  }

  .project-card:hover .project-thumb img { transform: scale(1.05); }

  .project-del-btn {
    position: absolute;
    top: 10px; right: 10px;
    padding: 6px;
    background: rgba(239,68,68,0.9);
    border: none;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    display: flex;
    text-decoration: none;
  }

  .project-card:hover .project-del-btn { opacity: 1; }

  .project-body { padding: 1.1rem; }

  .project-link-text {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .project-desc {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.35);
    line-height: 1.5;
    margin-bottom: 0.9rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .view-project-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 0.6rem;
    background: rgba(163,230,53,0.08);
    border: 1px solid rgba(163,230,53,0.15);
    border-radius: 10px;
    color: #a3e635;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .view-project-btn:hover {
    background: rgba(163,230,53,0.15);
    border-color: rgba(163,230,53,0.35);
  }

  /* ── ADD PROJECT FORM ── */
  .add-form-wrap {
    background: #0e1117;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 3rem;
  }

  .form-row { display: flex; flex-direction: column; gap: 1.1rem; }

  .field-lbl {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .field-inp, .field-ta {
    width: 100%;
    padding: 0.8rem 1rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    color: #fff;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: all 0.25s ease;
  }

  /* Fix select dropdown – override browser default white bg */
  select.field-inp {
    appearance: none;
    -webkit-appearance: none;
    background-color: #0e1117;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a3e635' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.9rem center;
    padding-right: 2.5rem;
    cursor: pointer;
  }

  select.field-inp option {
    background-color: #0e1117;
    color: #fff;
  }

  .field-inp::placeholder, .field-ta::placeholder { color: rgba(255,255,255,0.16); }

  .field-inp:focus, .field-ta:focus {
    background: rgba(163,230,53,0.04);
    border-color: rgba(163,230,53,0.3);
    box-shadow: 0 0 0 3px rgba(163,230,53,0.06);
  }

  select.field-inp:focus {
    background-color: #0e1117;
  }

  .field-ta { resize: none; }

  .add-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 0.5rem;
    padding: 0.8rem 1.75rem;
    background: #a3e635;
    border: none;
    border-radius: 12px;
    color: #080a0f;
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 6px 18px rgba(163,230,53,0.2);
  }

  .add-btn:hover {
    background: #bef264;
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(163,230,53,0.3);
  }

  /* ── CLIENT: posted works ── */
  .work-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }

  .work-card {
    background: #0e1117;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    transition: all 0.3s ease;
  }

  .work-card:hover {
    border-color: rgba(163,230,53,0.12);
    box-shadow: 0 0 20px rgba(163,230,53,0.04);
  }

  .work-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.3rem;
  }

  .work-desc { font-size: 0.83rem; color: rgba(255,255,255,0.35); margin-bottom: 0.7rem; }

  .work-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; }

  .budget-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    background: rgba(163,230,53,0.08);
    border: 1px solid rgba(163,230,53,0.15);
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #a3e635;
  }

  .status-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .status-accepted  { background: rgba(34,197,94,0.1);  border: 1px solid rgba(34,197,94,0.2);  color: #4ade80; }
  .status-progress  { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #60a5fa; }
  .status-pending   { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }

  .view-bids-btn {
    padding: 0.6rem 1.25rem;
    background: rgba(167,139,250,0.1);
    border: 1px solid rgba(167,139,250,0.2);
    border-radius: 10px;
    color: #a78bfa;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.83rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .view-bids-btn:hover {
    background: rgba(167,139,250,0.18);
    border-color: rgba(167,139,250,0.4);
  }

  .list-project-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.65rem 1.25rem;
    background: #a3e635;
    border: none;
    border-radius: 10px;
    color: #080a0f;
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }

  .list-project-btn:hover { background: #bef264; transform: scale(1.03); }

  /* ── BIDS ── */
  .bids-section { margin-bottom: 3rem; }

  .bids-count {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.3);
    margin-bottom: 1.25rem;
    font-weight: 300;
  }

  .bid-card {
    background: #0e1117;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
  }

  .bid-card:hover {
    border-color: rgba(163,230,53,0.12);
  }

  .bid-name {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.3rem;
  }

  .bid-skills {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.3);
    margin-bottom: 0.6rem;
  }

  .bid-amount {
    font-family: 'Syne', sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    color: #a3e635;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
  }

  .bid-desc {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.3);
  }

  .accept-btn {
    padding: 0.65rem 1.4rem;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.25);
    border-radius: 10px;
    color: #4ade80;
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .accept-btn:hover {
    background: rgba(34,197,94,0.18);
    border-color: rgba(34,197,94,0.4);
  }

  .no-bids {
    padding: 3rem;
    text-align: center;
    color: rgba(255,255,255,0.2);
    font-size: 0.9rem;
    background: rgba(255,255,255,0.02);
    border: 1px dashed rgba(255,255,255,0.07);
    border-radius: 16px;
  }

  /* ── BECOME FREELANCER BANNER ── */
  .become-banner {
    position: relative;
    background: #0e1117;
    border: 1px solid rgba(163,230,53,0.12);
    border-radius: 20px;
    padding: 3rem 2.5rem;
    overflow: hidden;
  }

  .become-banner::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(163,230,53,0.08), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .become-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: rgba(163,230,53,0.07);
    border: 1px solid rgba(163,230,53,0.15);
    border-radius: 100px;
    font-size: 0.68rem;
    font-weight: 600;
    color: #a3e635;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.25rem;
  }

  .become-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -1px;
    color: #fff;
    margin-bottom: 0.75rem;
    line-height: 1.1;
  }

  .become-title span { color: #a3e635; }

  .become-sub {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.35);
    max-width: 500px;
    line-height: 1.6;
    font-weight: 300;
    margin-bottom: 2rem;
  }

  .become-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.9rem 2rem;
    background: #a3e635;
    border: none;
    border-radius: 12px;
    color: #080a0f;
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 8px 20px rgba(163,230,53,0.25);
  }

  .become-btn:hover {
    background: #bef264;
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 28px rgba(163,230,53,0.35);
  }

  .divider-line {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 2.5rem 0;
  }

  @media (max-width: 640px) {
    .profile-card { flex-direction: column; }
    .profile-avatar { width: 90px; height: 90px; }
    .profile-name { font-size: 1.5rem; }
  }

  /* ── EDIT PROFILE MODAL ── */
  .ep-overlay {
    position: fixed;
    inset: 0;
    z-index: 9998;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(6px);
    animation: ep-fade-in .2s ease;
  }
  @keyframes ep-fade-in { from { opacity: 0 } to { opacity: 1 } }

  .ep-modal {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    width: min(480px, calc(100vw - 2rem));
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 20px;
    background: #0e1117;
    border: 1px solid rgba(163,230,53,0.15);
    box-shadow: 0 24px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05);
    padding: 2rem;
    font-family: 'DM Sans', sans-serif;
    animation: ep-slide-up .3s cubic-bezier(.22,1,.36,1);
  }
  @keyframes ep-slide-up {
    from { opacity: 0; transform: translate(-50%, calc(-50% + 25px)) }
    to   { opacity: 1; transform: translate(-50%, -50%) }
  }

  .ep-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
  }

  .ep-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
  }
  .ep-title span { color: #a3e635; }

  .ep-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px; height: 32px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .ep-close-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.25); color: #f87171; }

  .ep-avatar-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
  }

  .ep-avatar-img {
    width: 64px; height: 64px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid #a3e635;
    box-shadow: 0 0 14px rgba(163,230,53,0.2);
    flex-shrink: 0;
  }

  .ep-avatar-hint {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.35);
    line-height: 1.5;
  }
  .ep-avatar-hint strong { color: rgba(255,255,255,0.6); display: block; margin-bottom: 2px; }

  .ep-form-row { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }

  .ep-save-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 0.85rem;
    background: #a3e635;
    border: none;
    border-radius: 12px;
    color: #080a0f;
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 6px 18px rgba(163,230,53,0.2);
  }
  .ep-save-btn:hover { background: #bef264; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(163,230,53,0.3); }
  .ep-save-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`

export default function UserProfile() {
  const { user, isLoading } = useSelector(state => state.auth)
  const { listedProjects, bids, projectLoading, projectError, projectErrorMessage } = useSelector(state => state.project)
  const { freelancer, freelancerLoading, freelancerError, freelancerErrorMessage } = useSelector(state => state.freelancer)

  const dispatch = useDispatch()

  const isFreelancer = user?.isFreelancer
  const myProjects = listedProjects?.filter((p) => p?.user?._id === user?._id) ?? []
  const projects = freelancer?.previousWorks

  // ── UI state ────────────────────────────────────────────────────────────────
  const [viewForm, setViewForm]       = useState(false)
  const [viewBids, setViewBids]       = useState(false)
  const [activeBidProjectId, setActiveBidProjectId] = useState(null)
  const [showBecomeForm, setShowBecomeForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Portfolio form (freelancer adds previous work)
  const [formData, setFormData] = useState({ projectLink: "", projectDescription: "", projectImage: "" })
  const { projectLink, projectDescription, projectImage } = formData

  // Become-a-freelancer form
  const [becomeData, setBecomeData] = useState({ description: "", skills: "", category: "", experience: "" })

  // Edit profile form
  const [editData, setEditData] = useState({ name: "", phone: "", profilePic: "" })

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange       = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleBecomeChange = (e) => setBecomeData({ ...becomeData, [e.target.name]: e.target.value })
  const handleEditChange   = (e) => setEditData({ ...editData, [e.target.name]: e.target.value })

  const openEditModal = () => {
    setEditData({ name: user.name || "", phone: user.phone || "", profilePic: user.profilePic || "" })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editData.name.trim() || !editData.phone.trim()) {
      toast.error("Name and phone are required")
      return
    }
    dispatch(updateProfile(editData)).then((res) => {
      if (updateProfile.fulfilled.match(res)) {
        toast.success("Profile updated! ✅")
        setShowEditModal(false)
      } else {
        toast.error(res.payload || "Failed to update profile")
      }
    })
  }

  const handleSubmitPortfolio = (e) => {
    e.preventDefault()
    if (!projectLink || !projectDescription) { toast.error("Please fill all fields"); return }
    dispatch(addPreviousProject(formData))
    setFormData({ projectLink: "", projectDescription: "", projectImage: "" })
  }

  const handleViewBiddings = (id) => {
    setActiveBidProjectId(id)
    dispatch(getBids(id))
    setViewBids(true)
  }

  const handleAcceptBid = (bidId) => {
    dispatch(acceptBid({ bidId, status: "accepted" })).then((res) => {
      if (acceptBid.fulfilled.match(res)) {
        toast.success("Bid accepted! Freelancer assigned ✅")
        // refresh bids
        if (activeBidProjectId) dispatch(getBids(activeBidProjectId))
      } else {
        toast.error(res.payload || "Failed to accept bid")
      }
    })
  }

  const handleBecomeFreelancer = (e) => {
    e.preventDefault()
    const { description, skills, category, experience } = becomeData
    if (!description || !skills || !category || !experience) { toast.error("Please fill all fields"); return }
    dispatch(becomeFreelancer({ description, skills, category, experience: Number(experience) })).then((res) => {
      if (becomeFreelancer.fulfilled.match(res)) {
        toast.success("You are now a Freelancer! 🎉 Refresh the page.")
        setShowBecomeForm(false)
        // update localStorage user
        const updatedUser = { ...user, isFreelancer: true }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        window.location.reload() // force reload so Redux auth state updates from localStorage
      } else {
        toast.error(res.payload || "Failed to register as freelancer")
      }
    })
  }

  // ── Effects ─────────────────────────────────────────────────────────────────
  // Only fetch freelancer profile when user IS a freelancer
  useEffect(() => {
    dispatch(getProjects())
    if (isFreelancer) {
      dispatch(getFreelancer(user._id))
    }
  }, [dispatch, user._id, isFreelancer])

  // Error toasts — only show when error is truthy
  useEffect(() => {
    if (freelancerError && freelancerErrorMessage) {
      toast.error(freelancerErrorMessage)
      dispatch(clearFreelancerError())
    }
  }, [freelancerError, freelancerErrorMessage, dispatch])

  useEffect(() => {
    if (projectError && projectErrorMessage) toast.error(projectErrorMessage)
  }, [projectError, projectErrorMessage])

  if (projectLoading || (isFreelancer && freelancerLoading && !freelancer)) return <LoadingScreen />

  return (
    <>
      <style>{styles}</style>
      <main className="profile-root">

        {/* Cover */}
        <div className="cover-wrap">
          <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="cover-img" />
          <div className="cover-overlay" />
          <div className="cover-grid" />
        </div>

        {/* Profile Card */}
        <div className="profile-container">
          <div className="profile-card">
            <img
              src={user.profilePic || "/placeholder.svg"}
              alt={user.name}
              className="profile-avatar"
            />

            <div className="profile-info">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-phone">{user.phone}</p>

              <div className="profile-meta">
                <div className="meta-item">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </div>
                {user.experience && (
                  <div className="meta-item">
                    <Zap size={14} />
                    <span>{user.experience}</span>
                  </div>
                )}
              </div>

              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < Math.floor(user.rating || 0) ? "star-filled" : "star-empty"}
                  />
                ))}
                <span className="rating-text">( reviews)</span>
              </div>

              {user.bio && <p className="profile-bio">{user.bio}</p>}
            </div>

            <button className="edit-btn" onClick={openEditModal}>
              <Edit2 size={14} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {isFreelancer ? (
            <>
              {/* ── FREELANCER VIEW ── */}
              <div className="section-header">
                <h2 className="section-title">My <span>Portfolio</span></h2>
              </div>

              {projects && projects.length > 0 ? (
                <div className="projects-grid">
                  {projects.map((project) => (
                    <div key={project._id || project.id} className="project-card">
                      <div className="project-thumb">
                        <img src={project.projectImage || "/placeholder.svg"} alt={project.projectLink} />
                        <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="project-del-btn">
                          <ExternalLink size={15} />
                        </a>
                      </div>
                      <div className="project-body">
                        <h3 className="project-link-text">{project.projectLink}</h3>
                        <p className="project-desc">{project.projectDescription}</p>
                        <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="view-project-btn">
                          <ExternalLink size={13} />
                          View Project
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-bids" style={{ marginBottom: '2rem' }}>No projects added yet. Add your first one below ↓</div>
              )}

              <div className="divider-line" />

              <div className="section-header">
                <h2 className="section-title">Add <span>Portfolio Project</span></h2>
              </div>

              <div className="add-form-wrap">
                <form onSubmit={handleSubmitPortfolio}>
                  <div className="form-row">
                    <div>
                      <label className="field-lbl">Project Link</label>
                      <input
                        name="projectLink"
                        value={projectLink}
                        onChange={handleChange}
                        type="url"
                        placeholder="https://your-project.com"
                        className="field-inp"
                      />
                    </div>
                    <div>
                      <label className="field-lbl">Project Description</label>
                      <textarea
                        name="projectDescription"
                        value={projectDescription}
                        onChange={handleChange}
                        placeholder="What did you build? What was the impact?"
                        rows="4"
                        className="field-ta"
                      />
                    </div>
                    <div>
                      <label className="field-lbl">Project Image URL (optional)</label>
                      <input
                        name="projectImage"
                        value={projectImage}
                        onChange={handleChange}
                        type="url"
                        placeholder="https://example.com/preview.jpg"
                        className="field-inp"
                      />
                    </div>
                  </div>

                  <button type="submit" className="add-btn" disabled={freelancerLoading}>
                    <Plus size={16} />
                    {freelancerLoading ? "Adding…" : "Add Project"}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              {/* ── CLIENT VIEW ── */}
              <div className="section-header">
                <h2 className="section-title">My <span>Posted Works</span></h2>
                <button onClick={() => setViewForm(!viewForm)} className="list-project-btn">
                  <Plus size={15} />
                  {viewForm ? "Cancel" : "List Project"}
                </button>
              </div>

              {viewForm && <PostWorkForm handleViewForm={() => setViewForm(false)} />}

              <div className="work-list">
                {myProjects.length === 0 && (
                  <div className="no-bids">No projects posted yet. Click "List Project" to start!</div>
                )}
                {myProjects.map((work) => (
                  <div key={work._id} className="work-card">
                    <div style={{ flex: 1 }}>
                      <h3 className="work-title">{work.title}</h3>
                      <p className="work-desc">{work.description}</p>
                      <div className="work-tags">
                        <span className="budget-tag">₹ {work.budget?.toLocaleString('en-IN')}</span>
                        {work.status === "accepted" && (
                          <span className="status-tag status-accepted"><CheckCircle size={11} /> Accepted</span>
                        )}
                        {work.status === "in-progress" && (
                          <span className="status-tag status-progress"><Eye size={11} /> In Progress</span>
                        )}
                        {work.status === "pending" && (
                          <span className="status-tag status-pending"><AlertCircle size={11} /> Pending</span>
                        )}
                        {work.status === "completed" && (
                          <span className="status-tag status-accepted"><CheckCircle size={11} /> Completed</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewBiddings(work._id)}
                      className="view-bids-btn"
                    >
                      {activeBidProjectId === work._id && viewBids ? "Hide Bids" : "View Bids"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Bids Section */}
              {viewBids && (
                <div className="bids-section">
                  <div className="divider-line" />
                  <div className="section-header">
                    <h2 className="section-title">Bids <span>Received</span></h2>
                    <button
                      onClick={() => setViewBids(false)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem' }}
                    >✕</button>
                  </div>
                  <p className="bids-count">{bids?.length ?? 0} bid{(bids?.length ?? 0) !== 1 ? 's' : ''} on this project</p>

                  {!bids || bids.length === 0 ? (
                    <div className="no-bids">No bids yet. Check back soon 👀</div>
                  ) : (
                    bids.map((bid) => (
                      <div key={bid._id} className="bid-card">
                        <div style={{ flex: 1 }}>
                          <h3 className="bid-name">{bid?.freelancer?.user?.name || "Freelancer"}</h3>
                          <p className="bid-skills">{bid?.freelancer?.skills}</p>
                          <p className="bid-amount">₹ {bid.amount?.toLocaleString('en-IN')} INR</p>
                          <div className="bid-desc">
                            <UserCircle size={13} />
                            {bid?.freelancer?.description}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                          {bid.status === "accepted" ? (
                            <span className="status-tag status-accepted"><CheckCircle size={11} /> Accepted</span>
                          ) : (
                            <button
                              className="accept-btn"
                              onClick={() => handleAcceptBid(bid._id)}
                            >
                              Accept Bid
                            </button>
                          )}
                          {bid.status === "rejected" && (
                            <span className="status-tag status-pending">Rejected</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div className="divider-line" />

              {/* Become Freelancer Banner */}
              {!showBecomeForm ? (
                <div className="become-banner">
                  <div className="become-tag">
                    <Zap size={10} />
                    Opportunity
                  </div>
                  <h2 className="become-title">
                    Ready to start<br />
                    <span>earning?</span>
                  </h2>
                  <p className="become-sub">
                    Become a freelancer on Kaam-Karo. Showcase your skills, connect with clients, and get paid for what you're actually good at.
                  </p>
                  <button className="become-btn" onClick={() => setShowBecomeForm(true)}>
                    <Zap size={16} />
                    Become a Freelancer
                  </button>
                </div>
              ) : (
                <div className="add-form-wrap">
                  <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                    <h2 className="section-title">Register as <span>Freelancer</span></h2>
                    <button
                      onClick={() => setShowBecomeForm(false)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem' }}
                    >✕</button>
                  </div>
                  <form onSubmit={handleBecomeFreelancer}>
                    <div className="form-row">
                      <div>
                        <label className="field-lbl">Your Bio / Description</label>
                        <textarea
                          name="description"
                          value={becomeData.description}
                          onChange={handleBecomeChange}
                          placeholder="Tell clients what you do and what makes you great..."
                          rows="3"
                          className="field-ta"
                        />
                      </div>
                      <div>
                        <label className="field-lbl">Skills (comma separated)</label>
                        <input
                          name="skills"
                          value={becomeData.skills}
                          onChange={handleBecomeChange}
                          type="text"
                          placeholder="React, Node.js, MongoDB, Figma..."
                          className="field-inp"
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label className="field-lbl">Category</label>
                          <select
                            name="category"
                            value={becomeData.category}
                            onChange={handleBecomeChange}
                            className="field-inp"
                            style={{ cursor: 'pointer' }}
                          >
                            <option value="">Select category</option>
                            <option>Web Development</option>
                            <option>Mobile Development</option>
                            <option>UI/UX Design</option>
                            <option>Graphic Design</option>
                            <option>Content Writing</option>
                            <option>Digital Marketing</option>
                            <option>Data Science</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="field-lbl">Experience (years)</label>
                          <input
                            name="experience"
                            value={becomeData.experience}
                            onChange={handleBecomeChange}
                            type="number"
                            min="0"
                            max="50"
                            placeholder="e.g. 3"
                            className="field-inp"
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="add-btn" disabled={freelancerLoading}>
                        <Zap size={16} />
                        {freelancerLoading ? "Registering…" : "Register as Freelancer"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBecomeForm(false)}
                        style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── EDIT PROFILE MODAL ── */}
      {showEditModal && (
        <>
          <div className="ep-overlay" onClick={() => setShowEditModal(false)} />
          <form className="ep-modal" onSubmit={handleEditSubmit}>

            <div className="ep-header">
              <div className="ep-title">Edit <span>Profile</span></div>
              <button type="button" className="ep-close-btn" onClick={() => setShowEditModal(false)}>
                <X size={14} />
              </button>
            </div>

            {/* Avatar preview */}
            <div className="ep-avatar-preview">
              <img
                src={editData.profilePic || user.profilePic || "/placeholder.svg"}
                alt="preview"
                className="ep-avatar-img"
                onError={(e) => { e.target.src = "/placeholder.svg" }}
              />
              <div className="ep-avatar-hint">
                <strong>Profile Photo</strong>
                Paste an image URL below to update your photo
              </div>
            </div>

            <div className="ep-form-row">
              <div>
                <label className="field-lbl">Full Name</label>
                <input
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  type="text"
                  placeholder="Your full name"
                  className="field-inp"
                />
              </div>
              <div>
                <label className="field-lbl">Phone Number</label>
                <input
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  type="text"
                  placeholder="e.g. 9876543210"
                  className="field-inp"
                />
              </div>
              <div>
                <label className="field-lbl">Profile Picture URL</label>
                <input
                  name="profilePic"
                  value={editData.profilePic}
                  onChange={handleEditChange}
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="field-inp"
                />
              </div>
            </div>

            <button type="submit" className="ep-save-btn" disabled={isLoading}>
              {isLoading ? "Saving…": "💾 Save Changes"}
            </button>

          </form>
        </>
      )}
    </>
  )
}