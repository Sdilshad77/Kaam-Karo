import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { addProject, getProjects } from "../features/project/projectSlice";
import { toast } from "react-toastify";
import { Plus, X } from "lucide-react";

const formCss = `
  .pwf-wrap {
    border-radius: 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(200,255,100,0.15);
    padding: 2rem;
    margin-bottom: 2rem;
    animation: pwf-in 0.35s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes pwf-in { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }

  .pwf-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .pwf-title {
    font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800;
    color: #f0f0f5; letter-spacing: -0.02em;
  }
  .pwf-close {
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.3); transition: color 0.2s;
  }
  .pwf-close:hover { color: #f87171; }

  .pwf-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
    margin-bottom: 1rem;
  }
  @media(max-width:600px){ .pwf-grid { grid-template-columns:1fr; } }

  .pwf-full { grid-column: 1 / -1; }

  .pwf-lbl {
    display: block; font-size: 0.72rem; font-weight: 600;
    color: rgba(200,200,220,0.5); letter-spacing: 0.07em;
    text-transform: uppercase; margin-bottom: 0.45rem;
  }
  .pwf-inp {
    width: 100%; padding: 0.75rem 1rem;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    color: #e8e8f0; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; transition: border-color 0.22s, background 0.22s;
  }
  .pwf-inp:focus { border-color: rgba(200,255,100,0.4); background: rgba(200,255,100,0.03); }
  .pwf-inp::placeholder { color: rgba(200,200,220,0.25); }
  .pwf-inp option { background: #111116; }

  .pwf-ta {
    width: 100%; padding: 0.75rem 1rem; resize: vertical;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    color: #e8e8f0; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; transition: border-color 0.22s, background 0.22s;
  }
  .pwf-ta:focus { border-color: rgba(200,255,100,0.4); background: rgba(200,255,100,0.03); }
  .pwf-ta::placeholder { color: rgba(200,200,220,0.25); }

  .pwf-actions { display: flex; gap: 0.75rem; margin-top: 1.25rem; }

  .pwf-submit {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.8rem 1.5rem; border-radius: 12px;
    background: linear-gradient(135deg, #c8ff6e, #a3e635);
    border: none; color: #0a0a0e; font-weight: 800; font-size: 0.88rem;
    cursor: pointer;
    transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s;
  }
  .pwf-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,255,100,0.3); }
  .pwf-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .pwf-cancel {
    padding: 0.8rem 1.5rem; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(200,200,220,0.6); font-weight: 600; font-size: 0.88rem; cursor: pointer;
    transition: background 0.2s;
  }
  .pwf-cancel:hover { background: rgba(255,255,255,0.08); color: #e8e8f0; }
`

const CATEGORIES = ["Web Development", "Mobile Development", "UI/UX Design", "Graphic Design", "Content Writing", "Digital Marketing", "Data Science", "Other"]
const TIMELINES  = ["1-2 weeks", "2-4 weeks", "1-3 months", "3+ months"]

export default function PostWorkForm({ handleViewForm }) {
    const dispatch = useDispatch()
    const { projectLoading } = useSelector(state => state.project)

    const [formData, setFormData] = useState({
        title: "", description: "", budget: "",
        category: "", duration: "", technology: ""
    })

    const { title, description, budget, category, duration, technology } = formData

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!title || !description || !budget || !category || !duration || !technology) {
            toast.error("Please fill all fields!")
            return
        }
        dispatch(addProject(formData)).then((res) => {
            if (addProject.fulfilled.match(res)) {
                toast.success("Project listed successfully! 🎉")
                dispatch(getProjects())
                handleViewForm()
            } else {
                toast.error(res.payload || "Failed to list project")
            }
        })
    }

    return (
        <>
            <style>{formCss}</style>
            <div className="pwf-wrap">
                <div className="pwf-header">
                    <div className="pwf-title">Post a New Project</div>
                    <button className="pwf-close" onClick={handleViewForm} type="button">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="pwf-grid">
                        {/* Title */}
                        <div className="pwf-full">
                            <label className="pwf-lbl">Project Title</label>
                            <input
                                name="title" value={title} onChange={handleChange}
                                type="text" placeholder="e.g. Build a React E-Commerce App"
                                className="pwf-inp"
                            />
                        </div>

                        {/* Description */}
                        <div className="pwf-full">
                            <label className="pwf-lbl">Description</label>
                            <textarea
                                name="description" value={description} onChange={handleChange}
                                placeholder="Describe your project in detail — requirements, goals, deliverables..."
                                rows="4" className="pwf-ta"
                            />
                        </div>

                        {/* Budget */}
                        <div>
                            <label className="pwf-lbl">Budget (₹ INR)</label>
                            <input
                                name="budget" value={budget} onChange={handleChange}
                                type="number" min="1" placeholder="e.g. 15000"
                                className="pwf-inp"
                            />
                        </div>

                        {/* Timeline */}
                        <div>
                            <label className="pwf-lbl">Timeline</label>
                            <select name="duration" value={duration} onChange={handleChange} className="pwf-inp">
                                <option value="">Select timeline</option>
                                {TIMELINES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="pwf-lbl">Category</label>
                            <select name="category" value={category} onChange={handleChange} className="pwf-inp">
                                <option value="">Select category</option>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Technology */}
                        <div>
                            <label className="pwf-lbl">Technologies Required</label>
                            <input
                                name="technology" value={technology} onChange={handleChange}
                                type="text" placeholder="e.g. React, Node.js, MongoDB"
                                className="pwf-inp"
                            />
                        </div>
                    </div>

                    <div className="pwf-actions">
                        <button type="submit" className="pwf-submit" disabled={projectLoading}>
                            <Plus size={16} />
                            {projectLoading ? "Posting…" : "Post Project"}
                        </button>
                        <button type="button" className="pwf-cancel" onClick={handleViewForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}