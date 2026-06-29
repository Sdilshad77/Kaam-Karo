import React, { useEffect, useMemo, useState } from 'react'
import UpdateCreditsModal from '../../components/admin/UpdateCreditsModal'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllUsers } from '../../features/admin/adminSlice'
import { logoutUser } from '../../features/auth/authSlice'
import { toast } from 'react-toastify'
import LoadingScreen from '../../components/LoadingScreen'

/* ─── Gen-Z Admin Dashboard ─────────────────────────────────────────────────
   Dark glass · neon lime + violet · spring buttons · consistent theme
   ─────────────────────────────────────────────────────────────────────────── */

const css = `
  

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ad-root {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e8f0;
    min-height: 100svh;
  }

  /* fixed grid bg */
  .ad-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(200,255,100,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,255,100,0.03) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(ellipse 90% 50% at 50% 0%, black 20%, transparent 100%);
    animation: ad-grid 24s linear infinite;
  }
  @keyframes ad-grid { from{background-position:0 0} to{background-position:52px 52px} }

  .ad-blob {
    position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0;
  }
  .ad-blob-1 { width:350px;height:350px; background:rgba(200,255,100,0.05); top:-100px;left:-80px; animation:ad-float 12s ease-in-out infinite; }
  .ad-blob-2 { width:300px;height:300px; background:rgba(180,125,255,0.06); bottom:-80px;right:-60px; animation:ad-float 15s ease-in-out infinite reverse; }
  @keyframes ad-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(14px,-18px)} }

  .ad-inner {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
  }

  /* ── HEADER ── */
  .ad-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; flex-wrap: wrap; gap: 1.2rem;
    margin-bottom: 2.5rem;
    animation: ad-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes ad-fade-up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

  .ad-header-label {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #c8ff6e; margin-bottom: 0.4rem;
  }
  .ad-header-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.6rem, 4vw, 2.4rem); letter-spacing: -0.03em; color: #f0f0f5;
  }
  .ad-header-sub { font-size: 0.85rem; color: rgba(200,200,220,0.4); margin-top: 0.25rem; }

  /* search */
  .ad-search-wrap { position: relative; width: 280px; }
  @media (max-width: 600px) { .ad-search-wrap { width: 100%; } }
  .ad-search-icon {
    position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%);
    color: rgba(200,200,220,0.3); pointer-events: none;
  }
  .ad-search {
    width: 100%; padding: 0.65rem 1rem 0.65rem 2.6rem;
    border-radius: 11px; background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08); color: #e8e8f0;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; outline: none;
    transition: border-color 0.22s ease, background 0.22s ease;
  }
  .ad-search::placeholder { color: rgba(200,200,220,0.28); }
  .ad-search:focus { border-color: rgba(200,255,100,0.32); background: rgba(200,255,100,0.03); }

  /* ── STAT CARDS ── */
  .ad-stats {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 1rem; margin-bottom: 2rem;
    animation: ad-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.08s both;
  }
  @media (max-width: 500px) { .ad-stats { grid-template-columns: 1fr; } }

  .ad-stat {
    padding: 1.5rem 1.8rem; border-radius: 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    position: relative; overflow: hidden;
    transition: border-color 0.28s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ad-stat::before {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    background: radial-gradient(circle at top left, rgba(200,255,100,0.05), transparent 55%);
    opacity: 0; transition: opacity 0.3s ease;
  }
  .ad-stat:hover { border-color: rgba(200,255,100,0.18); transform: translateY(-4px); }
  .ad-stat:hover::before { opacity: 1; }

  .ad-stat-label {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: rgba(200,200,220,0.38);
    margin-bottom: 0.6rem;
  }
  .ad-stat-val {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 2.4rem; letter-spacing: -0.04em; color: #f0f0f5;
    line-height: 1;
  }
  .ad-stat-val.lime { color: #c8ff6e; }

  /* big bg number */
  .ad-stat-bg-num {
    position: absolute; right: 1rem; bottom: -0.5rem;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 5rem; color: transparent;
    -webkit-text-stroke: 1px rgba(200,255,100,0.07);
    pointer-events: none; user-select: none; line-height: 1;
  }

  /* ── TABLE CARD ── */
  .ad-table-card {
    border-radius: 20px; overflow: hidden;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    animation: ad-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.16s both;
  }

  /* table top bar */
  .ad-table-topbar {
    padding: 1.1rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
  }
  .ad-table-count {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem; color: #f0f0f5;
  }
  .ad-table-count span { color: #c8ff6e; }

  .ad-table-wrap { overflow-x: auto; }

  table.ad-table {
    width: 100%; border-collapse: collapse;
    min-width: 520px;
  }

  .ad-table thead tr {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
  }
  .ad-table th {
    padding: 0.75rem 1.2rem; text-align: left;
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: rgba(200,200,220,0.35);
  }

  .ad-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: background 0.22s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ad-table tbody tr:last-child { border-bottom: none; }
  .ad-table tbody tr:hover { background: rgba(200,255,100,0.03); }

  .ad-table td {
    padding: 0.9rem 1.2rem;
    font-size: 0.85rem;
  }

  /* avatar + name cell */
  .ad-user-cell { display: flex; align-items: center; gap: 0.75rem; }
  .ad-avatar {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(200,255,100,0.15), rgba(180,125,255,0.15));
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 0.75rem; color: #c8ff6e;
  }
  .ad-user-name { font-weight: 600; color: #f0f0f5; }

  .ad-email { color: rgba(200,200,220,0.45); font-size: 0.82rem; }

  /* credits badge */
  .ad-credits {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.2rem 0.65rem; border-radius: 6px;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.82rem;
    background: rgba(200,255,100,0.08); color: #c8ff6e;
    border: 1px solid rgba(200,255,100,0.18);
  }
  .ad-credits.zero {
    background: rgba(255,255,255,0.04); color: rgba(200,200,220,0.35);
    border-color: rgba(255,255,255,0.07);
  }

  /* edit button */
  .ad-edit-btn {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.38rem 0.85rem; border-radius: 8px;
    background: rgba(180,125,255,0.1); border: 1px solid rgba(180,125,255,0.22);
    color: #b47dff; font-weight: 700; font-size: 0.78rem;
    cursor: pointer; white-space: nowrap;
    transition: background 0.22s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
  }
  .ad-edit-btn:hover {
    background: rgba(180,125,255,0.2); transform: scale(1.07);
    box-shadow: 0 0 14px rgba(180,125,255,0.2);
  }

  /* empty */
  .ad-empty {
    padding: 4rem 1rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
  }
  .ad-empty-icon { font-size: 2.5rem; opacity: 0.4; }
  .ad-empty-text { font-size: 0.9rem; color: rgba(200,200,220,0.35); }
`

const SearchIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const PencilIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
      d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414A2 2 0 018.586 12.5z" />
  </svg>
)

const Dashboard = () => {
  const { user } = useSelector(state => state.auth)
  const { users = [], adminError, adminErrorMessage, adminLoading } =
    useSelector(state => state.admin)

  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  const [showModal,   setShowModal]   = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [searchTerm,  setSearchTerm]  = useState('')

  const totalCredits = useMemo(() =>
    users.reduce((acc, u) => acc + (u.credits || 0), 0)
  , [users])

  const filteredUsers = useMemo(() =>
    users.filter(u =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  , [users, searchTerm])

  const handleModal = (selectedUser = null) => {
    setCurrentUser(selectedUser)
    setShowModal(prev => !prev)
  }

  useEffect(() => {
    if (!user || !user.isAdmin) { navigate('/'); return }
    dispatch(getAllUsers())
  }, [dispatch, navigate, user])

  useEffect(() => {
    if (adminError && adminErrorMessage) {
      toast.error(adminErrorMessage)
      if (
        adminErrorMessage.toLowerCase().includes("signature") ||
        adminErrorMessage.toLowerCase().includes("token") ||
        adminErrorMessage.toLowerCase().includes("unauthorised") ||
        adminErrorMessage.toLowerCase().includes("unauthorized")
      ) {
        dispatch(logoutUser())
        navigate('/login')
      }
    }
  }, [adminError, adminErrorMessage, dispatch, navigate])

  if (adminLoading) return <LoadingScreen />

  return (
    <div className="ad-root">
      <style>{css}</style>
      <div className="ad-bg" />
      <div className="ad-blob ad-blob-1" />
      <div className="ad-blob ad-blob-2" />

      <div className="ad-inner">

        {/* ── HEADER ── */}
        <div className="ad-header">
          <div>
            <div className="ad-header-label">Admin Panel</div>
            <div className="ad-header-title">Dashboard</div>
            <div className="ad-header-sub">Manage users and credits</div>
          </div>
          <div className="ad-search-wrap">
            <span className="ad-search-icon"><SearchIcon /></span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="ad-search"
            />
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="ad-stats">
          <div className="ad-stat">
            <div className="ad-stat-label">Total Users</div>
            <div className="ad-stat-val">{users.length}</div>
            <div className="ad-stat-bg-num">{users.length}</div>
          </div>
          <div className="ad-stat">
            <div className="ad-stat-label">Total Credits</div>
            <div className="ad-stat-val lime">{totalCredits.toLocaleString()}</div>
            <div className="ad-stat-bg-num">{totalCredits}</div>
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="ad-table-card">
          <div className="ad-table-topbar">
            <div className="ad-table-count">
              <span>{filteredUsers.length}</span> user{filteredUsers.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          </div>

          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Credits</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map(item => (
                  <tr key={item._id}>
                    <td>
                      <div className="ad-user-cell">
                        <div className="ad-avatar">
                          {item.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <span className="ad-user-name">{item.name}</span>
                      </div>
                    </td>
                    <td className="ad-email">{item.email}</td>
                    <td>
                      <span className={`ad-credits${!item.credits ? ' zero' : ''}`}>
                        {item.credits || 0}
                      </span>
                    </td>
                    <td>
                      <button className="ad-edit-btn" onClick={() => handleModal(item)}>
                        <PencilIcon /> Edit Credits
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4">
                      <div className="ad-empty">
                        <div className="ad-empty-icon">🔍</div>
                        <div className="ad-empty-text">
                          {searchTerm ? `No users matching "${searchTerm}"` : 'No users found'}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <UpdateCreditsModal handleModal={handleModal} currentUser={currentUser} />
      )}
    </div>
  )
}

export default Dashboard