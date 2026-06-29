import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../features/project/projectSlice";
import LoadingScreen from "../components/LoadingScreen";
import { toast } from "react-toastify";
import WorkCard from "../components/WorkCard";
import { Search } from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "Design",
  "Writing",
  "Marketing",
  "Data Science",
  "Other",
];

const css = `


  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .aw-root {
    font-family: 'DM Sans', sans-serif;
    background: #09090d;
    color: #e8e8f0;
    min-height: 100svh;
    overflow-x: hidden;
  }

  .aw-blob {
    position: fixed; border-radius: 50%;
    filter: blur(90px); pointer-events: none; z-index: 0;
  }
  .aw-blob-1 {
    width: 500px; height: 500px;
    background: rgba(200,255,100,0.05);
    top: -150px; left: -150px;
    animation: aw-float 14s ease-in-out infinite;
    will-change: transform;
  }
  .aw-blob-2 {
    width: 400px; height: 400px;
    background: rgba(180,125,255,0.06);
    bottom: -100px; right: -100px;
    animation: aw-float 17s ease-in-out infinite reverse;
    will-change: transform;
  }
  @keyframes aw-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-24px)} }

  .aw-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(200,255,100,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,255,100,0.03) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 100%);
    animation: none;
  }
  @keyframes aw-grid { from{background-position:0 0} to{background-position:0 0} }

  .aw-inner {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto;
    padding: 5rem 1.5rem 6rem;
  }

  /* ── HERO ── */
  .aw-head {
    text-align: center; margin-bottom: 3rem;
    animation: aw-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes aw-fade-up { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

  .aw-badge {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.28rem 0.9rem; border-radius: 999px;
    border: 1px solid rgba(200,255,100,0.22); background: rgba(200,255,100,0.07);
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.09em;
    text-transform: uppercase; color: #c8ff6e; margin-bottom: 1.3rem;
  }
  .aw-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #c8ff6e; box-shadow: 0 0 8px #c8ff6e;
    animation: aw-blink 1.8s ease-in-out infinite;
  }
  @keyframes aw-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

  .aw-h1 {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(2.2rem, 6vw, 4rem);
    letter-spacing: -0.04em; line-height: 1.07;
    color: #f0f0f5; margin-bottom: 1rem;
  }
  .aw-h1 em {
    font-style: normal;
    background: linear-gradient(90deg, #c8ff6e 0%, #b47dff 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .aw-sub {
    font-size: 1rem; color: rgba(200,200,220,0.5);
    max-width: 480px; margin: 0 auto 0; line-height: 1.7;
  }

  /* ── CONTROLS ── */
  .aw-controls {
    display: flex; flex-wrap: wrap; gap: 0.85rem; align-items: center;
    margin-bottom: 1.5rem;
    animation: aw-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }

  .aw-search-wrap {
    position: relative; flex: 1; min-width: 220px; max-width: 380px;
  }
  .aw-search-icon {
    position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
    color: rgba(200,200,220,0.3); pointer-events: none;
  }
  .aw-search {
    width: 100%; padding: 0.72rem 1rem 0.72rem 2.6rem;
    border-radius: 12px; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09); color: #e8e8f0;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; outline: none;
    transition: border-color 0.22s ease, background 0.22s ease;
  }
  .aw-search::placeholder { color: rgba(200,200,220,0.28); }
  .aw-search:focus { border-color: rgba(200,255,100,0.3); background: rgba(200,255,100,0.03); }

  .aw-sort-select {
    padding: 0.72rem 1rem; border-radius: 12px; font-size: 0.82rem; font-weight: 600;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    color: rgba(200,200,220,0.7); cursor: pointer; outline: none;
    transition: all 0.22s ease;
  }
  .aw-sort-select:hover, .aw-sort-select:focus {
    border-color: rgba(200,255,100,0.25); color: #c8ff6e;
  }

  /* Category filters */
  .aw-cats {
    display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 1.5rem;
    animation: aw-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both;
  }
  .aw-cat-btn {
    padding: 0.38rem 0.85rem; border-radius: 10px; font-size: 0.75rem; font-weight: 600;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    color: rgba(200,200,220,0.5); cursor: pointer;
    transition: all 0.22s ease;
    white-space: nowrap;
  }
  .aw-cat-btn:hover {
    border-color: rgba(200,255,100,0.2); color: #c8ff6e;
    background: rgba(200,255,100,0.05);
  }
  .aw-cat-btn.active {
    background: rgba(200,255,100,0.1); border-color: rgba(200,255,100,0.3);
    color: #c8ff6e; font-weight: 700;
  }

  /* ── COUNT ── */
  .aw-count {
    font-size: 0.78rem; color: rgba(200,200,220,0.35);
    margin-bottom: 1.5rem;
    animation: aw-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  }
  .aw-count span { color: #c8ff6e; font-weight: 700; }

  /* ── GRID ── */
  .aw-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 1.25rem;
  }
  @media (max-width: 780px) { .aw-grid { grid-template-columns: 1fr; } }

  /* ── EMPTY ── */
  .aw-empty {
    grid-column: 1/-1;
    display: flex; flex-direction: column; align-items: center;
    gap: 0.8rem; padding: 5rem 1rem; text-align: center;
  }
  .aw-empty-icon { font-size: 3rem; animation: aw-float 4s ease-in-out infinite; }
  .aw-empty-title {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 1.2rem; color: #f0f0f5;
  }
  .aw-empty-sub { font-size: 0.85rem; color: rgba(200,200,220,0.38); }
`;

export default function AllWork() {
  const {
    listedProjects,
    projectLoading,
    projectError,
    projectErrorMessage,
  } = useSelector((state) => state.project);

  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projectError && projectErrorMessage) {
      toast.error(projectErrorMessage);
    }
  }, [projectError, projectErrorMessage]);

  const filtered = useMemo(() => {
    let list = listedProjects || [];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.technology?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== "All Categories") {
      list = list.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Hide completed projects from the live projects feed
    list = list.filter((p) => p.status?.toLowerCase() !== "completed");

    if (sortBy === "latest") {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === "budget-high") {
      list = [...list].sort((a, b) => (b.budget || 0) - (a.budget || 0));
    } else if (sortBy === "budget-low") {
      list = [...list].sort((a, b) => (a.budget || 0) - (b.budget || 0));
    }

    return list;
  }, [listedProjects, search, activeCategory, sortBy]);

  if (projectLoading) return <LoadingScreen />;

  return (
    <div className="aw-root">
      <style>{css}</style>
      <div className="aw-blob aw-blob-1" />
      <div className="aw-blob aw-blob-2" />
      <div className="aw-grid-bg" />

      <main className="aw-inner">

        {/* ── HERO ── */}
        <div className="aw-head">
          <div className="aw-badge">
            <span className="aw-badge-dot" />
            Live Projects
          </div>
          <h1 className="aw-h1">
            Find Your Next<br />
            <em>Freelance Gig</em>
          </h1>
          <p className="aw-sub">
            Browse real projects posted by clients — bid, win, and get paid for your skills.
          </p>
        </div>

        {/* ── CONTROLS (Search + Sort) ── */}
        <div className="aw-controls">
          <div className="aw-search-wrap">
            <span className="aw-search-icon">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search by title, skill, category..."
              className="aw-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="aw-sort-select"
          >
            <option value="latest">Latest First</option>
            <option value="budget-high">Budget: High → Low</option>
            <option value="budget-low">Budget: Low → High</option>
          </select>
        </div>

        {/* ── CATEGORY FILTERS ── */}
        <div className="aw-cats">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`aw-cat-btn${activeCategory === cat ? " active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── COUNT ── */}
        <div className="aw-count">
          Showing <span>{filtered.length}</span> project
          {filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
          {activeCategory !== "All Categories" && ` in "${activeCategory}"`}
        </div>

        {/* ── GRID ── */}
        <div className="aw-grid">
          {filtered.length > 0 ? (
            filtered.map((work) => (
              <WorkCard key={work._id} work={work} />
            ))
          ) : (
            <div className="aw-empty">
              <div className="aw-empty-icon">🔍</div>
              <div className="aw-empty-title">
                {search || activeCategory !== "All Categories"
                  ? "No matching projects found"
                  : "No Projects Yet"}
              </div>
              <div className="aw-empty-sub">
                {search || activeCategory !== "All Categories"
                  ? "Try adjusting your search or category filter"
                  : "Clients are posting new projects soon — check back!"}
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}