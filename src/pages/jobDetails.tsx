import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Archive, Trash2, FileText, ListChecks, Tags, Users, Briefcase, Calendar, Eye, ClipboardCheck, DollarSign, UserCheck, Building } from 'lucide-react';
import {  Job, Candidate, CandidateStage } from "@/mock/type";
import { db } from '@/mock/db';
import Layout from "@/components/layout";
import NewJobModal from "@/components/JobModal";

// --- MAIN JOB DETAILS COMPONENT (Using your original logic) ---
export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState < Job | null > (null);
    const [loading, setLoading] = useState(true);
    const [openEdit, setOpenEdit] = useState(false);
    const [pipeline, setPipeline] = useState < Record < CandidateStage, number >> ({
        applied: 0, screen: 0, tech: 0, offer: 0, hired: 0, rejected: 0,
    });

    useEffect(() => {
        async function fetchJobAndPipeline() {
            try {
                if (!id) return;
                setLoading(true);
                const jobData = await db.jobs.get(Number(id));
                setJob(jobData || null);

                const candidates: Candidate[] = await db.candidates.where("jobId").equals(Number(id)).toArray();
                const stageCounts: Record < CandidateStage, number > = { applied: 0, screen: 0, tech: 0, offer: 0, hired: 0, rejected: 0 };
                candidates.forEach((c) => {
                    stageCounts[c.stage] = (stageCounts[c.stage] || 0) + 1;
                });
                setPipeline(stageCounts);
            } catch (error) {
                console.error("Failed to fetch job or pipeline:", error);
            } finally {
                // Simulate a load time to see the skeleton
                setTimeout(() => setLoading(false), 700);
            }
        }
        fetchJobAndPipeline();
    }, [id]);

    function handleArchive() {
        if (!job) return;
        const updatedJob = { ...job, status: (job.status === "archived" ? "active" : "archived") as Job["status"] };
        db.jobs.update(job.id, updatedJob);
        setJob({ ...updatedJob, status: updatedJob.status as Job["status"] });
    }

    function handleDelete() {
        if (!job) return;
        db.jobs.delete(job.id);
        navigate(-1);
    }

    function refreshJobs() {
        if (!id) return;
        setLoading(true);
        db.jobs.get(Number(id)).then((jobData) => {
            setJob(jobData || null);
            setLoading(false);
        });
    }

    const totalCandidates = useMemo(() => Object.values(pipeline).reduce((sum, count) => sum + count, 0), [pipeline]);
    
    // Fallback for salary data if not present in your backend response.
    const salaryDisplay = (job?.salaryMin && job?.salaryMax) 
        ? `$${(job.salaryMin/1000)}k - $${(job.salaryMax/1000)}k`
        : 'Not Specified';


    if (loading) {
        return <Layout><LoadingSkeleton /></Layout>;
    }

    if (!job) {
        return <Layout><div className="flex items-center justify-center h-screen"><span className="text-lg text-red-500">Job not found.</span></div></Layout>;
    }

    return (
        <Layout>
            <Style />
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 animated-header">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-semibold text-stone-500 hover:text-teal-600 transition-colors duration-300 mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Jobs
                        </button>
                        <h1 className="text-4xl font-bold text-stone-900">Job Details</h1>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button className="primary-btn" onClick={() => setOpenEdit(true)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </button>
                        <button className="secondary-btn" onClick={handleArchive}>
                            <Archive className="w-4 h-4 mr-2" /> {job.status === "archived" ? "Restore" : "Archive"}
                        </button>
                        <button className="danger-btn" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column */}
                    <div className="flex-1 space-y-8 ">
                      <ContentSection
                        icon={Briefcase}
                        title="Job Overview"
                        style={{
                          animationDelay: '100ms',
                          backgroundColor: '#0d9488',
                          color: 'white',
                        }}
                      >
                        {job.status === "active" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">Active</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 text-xs font-semibold text-amber-800">Archived</span>
                        )}
                        <h2 className="text-3xl font-extrabold text-white mt-2 mb-2">{job.title}</h2>
                        <div className="flex items-center gap-4 text-white/80">
                          <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-white/80" />{job.location}</span>
                          <span className="px-2 py-0.5 bg-white/20 text-white rounded text-xs border border-white/30">{job.type}</span>
                        </div>
                      </ContentSection>

                        <ContentSection icon={FileText} title="Job Description" style={{ animationDelay: '200ms' }}>
                            <p className="text-stone-600 text-base leading-relaxed">{job.description}</p>
                        </ContentSection>

                        <ContentSection icon={ListChecks} title="Requirements" style={{ animationDelay: '300ms' }}>
                            <ul className="space-y-3">
                                {job.requirements?.map((req, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-base text-stone-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></span> {req}
                                    </li>
                                ))}
                            </ul>
                        </ContentSection>

                        <ContentSection icon={Tags} title="Skills & Tags" style={{ animationDelay: '400ms' }}>
                            <div className="flex flex-wrap gap-2">
                                {job.tags?.map((tag, idx) => (
                                    <span key={idx} className="skill-tag">{tag}</span>
                                ))}
                            </div>
                        </ContentSection>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="w-full lg:w-96 flex-shrink-0 space-y-8">
                        <ContentSection icon={Users} title="Candidate Pipeline" style={{ animationDelay: '500ms' }}>
                             <div className="space-y-3">
                                {Object.entries(pipeline).map(([stage, count]) => {
                                    const percentage = totalCandidates > 0 ? (count / totalCandidates) * 100 : 0;
                                    return (
                                        <div key={stage} className="pipeline-bar-wrapper">
                                            <div className="flex justify-between items-center text-sm mb-1">
                                                <span className="font-semibold text-stone-600 capitalize">{stage}</span>
                                                <span className="font-bold text-stone-800">{count}</span>
                                            </div>
                                            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                                                <div className="bg-teal-500 h-2 rounded-full pipeline-bar" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ContentSection>
                        
                        <ContentSection icon={Briefcase} title="Job Information" style={{ animationDelay: '600ms' }}>
                            <div className="space-y-4 text-sm">
                                <InfoItem icon={Building} label="DEPARTMENT" value={job.department || 'Not Specified'} />
                                <InfoItem icon={UserCheck} label="HIRING MANAGER" value={job.hiringManager || 'Not Specified'} />
                                <InfoItem icon={DollarSign} label="SALARY RANGE" value={salaryDisplay} />
                                <InfoItem icon={Calendar} label="CREATED" value={new Date().toLocaleDateString()} />
                            </div>
                        </ContentSection>
                        
                        <ContentSection icon={Eye} title="Quick Actions" style={{ animationDelay: '700ms' }}>
                            <div className="flex flex-col gap-3">
                                <button
                className="quick-action-button primary"
                onClick={() => navigate(`/jobs/${job.id}/candidates`)}
              >
                👥 View Candidates
              </button>

              <button
                className="quick-action-button secondary"
                onClick={() => navigate(`/jobs/${job.id}/assessments`)}
              >
                📑 View Assessments
              </button>
                            </div>
                        </ContentSection>
                    </div>
                </div>

                {openEdit && <NewJobModal open={openEdit} job={job} onClose={() => setOpenEdit(false)} onSaved={refreshJobs} />}
            </div>
        </Layout>
    );
}

// Helper Components
const ContentSection = ({ icon: Icon, title, children, ...props }) => {
    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div className="content-card fade-in-up" onMouseMove={handleMouseMove} {...props}>
            {title && (
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-3 mb-4">
                {Icon && <span className="icon-wrapper"><Icon className="w-5 h-5"/></span>}
                {title}
                </h3>
            )}
            {children}
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 info-item">
        <Icon className="w-5 h-5 text-stone-400 flex-shrink-0 mt-0.5"/>
        <div>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">{label}</p>
            <p className="font-semibold text-stone-800">{value}</p>
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <div className="p-6 lg:p-8">
         <div className="flex justify-between mb-8">
            <div className="w-1/3 h-12 shimmer rounded-lg"></div>
            <div className="w-1/4 h-12 shimmer rounded-lg"></div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
                <div className="w-full h-32 shimmer rounded-xl"></div>
                <div className="w-full h-48 shimmer rounded-xl"></div>
                <div className="w-full h-48 shimmer rounded-xl"></div>
            </div>
            <div className="w-full lg:w-96 flex-shrink-0 space-y-8">
                <div className="w-full h-64 shimmer rounded-xl"></div>
                <div className="w-full h-48 shimmer rounded-xl"></div>
            </div>
        </div>
    </div>
);

// Inline Styles Component
const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #f5f5f4; }

    .content-card {
      background-color: white; border-radius: 1rem; padding: 1.5rem;
      box-shadow: 0 4px_6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
      border: 1px solid #e7e5e4;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .content-card::before {
        content: '';
        position: absolute;
        top: var(--mouse-y);
        left: var(--mouse-x);
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(20, 184, 166, 0.25) 0%, rgba(20, 184, 166, 0) 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.4s ease, height 0.4s ease, opacity 0.4s ease;
        opacity: 0;
        z-index: 0;
    }

    .content-card:hover::before {
        width: 400px;
        height: 400px;
        opacity: 1;
    }
    
    .content-card > * {
        position: relative;
        z-index: 1;
    }


    .primary-btn, .secondary-btn, .danger-btn {
      display: inline-flex; align-items: center; justify-content: center;
      font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 0.5rem;
      transition: all 0.3s ease; border: 1px solid transparent; white-space: nowrap;
    }
    .primary-btn {
        background-image: linear-gradient(45deg, #14b8a6, #0d9488); color: white;
        box-shadow: 0 4px 15px -3px rgba(13, 148, 136, 0.3);
    }
    .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 7px 18px -5px rgba(13, 148, 136, 0.4); }
    .primary-btn:active, .secondary-btn:active, .danger-btn:active { transform: translateY(-1px) scale(0.98); }

    .secondary-btn {
      background-color: white; color: #44403c; border-color: #d6d3d1;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }
    .secondary-btn:hover { background-color: #f5f5f4; border-color: #a8a29e; transform: translateY(-2px); }

    .danger-btn { background-color: #fee2e2; color: #b91c1c; border-color: #fecaca; }
    .danger-btn:hover { background-color: #fca5a5; color: #7f1d1d; transform: translateY(-2px); }

    .skill-tag {
      background-color: #f5f5f4; color: #57534e; border-radius: 9999px;
      padding: 0.25rem 0.75rem; font-size: 0.875rem; font-weight: 500;
      transition: all 0.2s ease;
    }
    .skill-tag:hover { background-color: #14b8a6; color: white; transform: translateY(-2px); }
    
    .quick-action-btn {
        width: 100%; display: flex; align-items: center; justify-content: center;
        padding: 0.75rem; font-weight: 600; border-radius: 0.5rem; transition: all 0.3s ease;
    }
    .quick-action-btn.primary { background-color: #f0fdfa; color: #0d9488; border: 1px solid #99f6e4; }
    .quick-action-btn.primary:hover { background-color: #ccfbf1; border-color: #5eead4; transform: scale(1.03); }
    .quick-action-btn.secondary { background-color: #fafaf9; color: #78716c; border: 1px solid #e7e5e4; }
    .quick-action-btn.secondary:hover { background-color: #f5f5f4; border-color: #d6d3d1; transform: scale(1.03); }

    .icon-wrapper {
        background-color: #f0fdfa; /* teal-50 */
        color: #0d9488; /* teal-600 */
        padding: 0.5rem; /* p-2 */
        border-radius: 9999px; /* rounded-full */
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    .content-card:hover .icon-wrapper {
        transform: rotate(15deg) scale(1.1);
        background-color: #ccfbf1; /* teal-200 */
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .animated-header { animation: fadeIn 0.4s ease-out; }
    
    .pipeline-bar {
        transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        transform-origin: left;
    }
    .pipeline-bar-wrapper:hover .pipeline-bar {
        filter: brightness(1.1);
    }
    .pipeline-bar-wrapper {
        transition: background-color 0.2s ease-in-out;
        padding: 0.5rem; margin: -0.5rem; border-radius: 0.5rem;
    }
    .pipeline-bar-wrapper:hover { background-color: #fafaf9; }


    .info-item {
        transition: background-color 0.2s ease-in-out;
        padding: 0.5rem; margin: -0.5rem; border-radius: 0.5rem;
    }
    .info-item:hover { background-color: #f5f5f4; }

    @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
    }
    .shimmer {
        animation: shimmer 2s infinite linear;
        background: linear-gradient(to right, #f5f5f4 8%, #e7e5e4 18%, #f5f5f4 33%);
        background-size: 2000px 100%;
    }
  `}</style>
);

