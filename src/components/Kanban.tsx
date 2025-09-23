import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, Search, Filter } from 'lucide-react';

// Types
interface Candidate {
  id?: number;
  jobId: number;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  appliedDate: string;
  stage: CandidateStage;
}

enum CandidateStage {
  APPLIED = 'Applied',
  PHONE_SCREEN = 'Phone Screen',
  TECHNICAL_INTERVIEW = 'Technical Interview',
  OFFER = 'Offer',
  HIRED = 'Hired'
}

// Mock API service (replace with your MSW + Dexie implementation)
const candidateService = {
  async getCandidates(): Promise<Candidate[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            jobId: 1,
            jobTitle: 'Software Engineer',
            name: 'Hunter Green',
            email: 'hunter.green.253@example.com',
            phone: '+1-594-918-2888',
            appliedDate: 'Jul 29',
            stage: CandidateStage.APPLIED
          },
          {
            id: 2,
            jobId: 1,
            jobTitle: 'Software Engineer',
            name: 'Hayden Wilson',
            email: 'hayden.wilson.35@example.com',
            phone: '+1-594-918-2888',
            appliedDate: 'Jul 27',
            stage: CandidateStage.APPLIED
          },
          {
            id: 3,
            jobId: 2,
            jobTitle: 'Frontend Developer',
            name: 'Nico Garcia',
            email: 'nico.garcia.24@example.com',
            phone: '+1-235-261-2259',
            appliedDate: 'Aug 20',
            stage: CandidateStage.PHONE_SCREEN
          },
          {
            id: 4,
            jobId: 2,
            jobTitle: 'Frontend Developer',
            name: 'Charlie Campbell',
            email: 'charlie.campbell.118@example.com',
            phone: '+1-594-918-2888',
            appliedDate: 'Aug 17',
            stage: CandidateStage.PHONE_SCREEN
          },
          {
            id: 5,
            jobId: 3,
            jobTitle: 'Backend Developer',
            name: 'Avery Gomez',
            email: 'avery.gomez.575@example.com',
            phone: '+1-650-541-5746',
            appliedDate: 'Sep 11',
            stage: CandidateStage.TECHNICAL_INTERVIEW
          },
          {
            id: 6,
            jobId: 3,
            jobTitle: 'Backend Developer',
            name: 'Skyler Ramirez',
            email: 'skyler.ramirez.18@example.com',
            phone: '+1-922-444-3105',
            appliedDate: 'Aug 27',
            stage: CandidateStage.TECHNICAL_INTERVIEW
          },
          {
            id: 7,
            jobId: 4,
            jobTitle: 'DevOps Engineer',
            name: 'Devon Jackson',
            email: 'devon.jackson.135@example.com',
            phone: '+1-366-378-1815',
            appliedDate: 'Sep 6',
            stage: CandidateStage.OFFER
          },
          {
            id: 8,
            jobId: 4,
            jobTitle: 'DevOps Engineer',
            name: 'Casey Rivera',
            email: 'casey.rivera.317@example.com',
            phone: '+1-900-926-4685',
            appliedDate: 'Jul 27',
            stage: CandidateStage.OFFER
          },
          {
            id: 9,
            jobId: 5,
            jobTitle: 'Data Scientist',
            name: 'Lennox Hall',
            email: 'lennox.hall.171@example.com',
            phone: '+1-366-378-1815',
            appliedDate: 'Aug 20',
            stage: CandidateStage.HIRED
          },
          {
            id: 10,
            jobId: 5,
            jobTitle: 'Data Scientist',
            name: 'Kris Hernandez',
            email: 'kris.hernandez.512@example.com',
            phone: '+1-640-965-5919',
            appliedDate: 'Aug 17',
            stage: CandidateStage.HIRED
          }
        ]);
      }, 500);
    });
  },

  async updateCandidateStage(candidateId: number, newStage: CandidateStage): Promise<void> {
    // Simulate API call to update candidate stage
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Updated candidate ${candidateId} to stage: ${newStage}`);
        resolve();
      }, 200);
    });
  }
};

// Candidate Card Component
const CandidateCard: React.FC<{
  candidate: Candidate;
  onDragStart: (e: React.DragEvent, candidate: Candidate) => void;
}> = ({ candidate, onDragStart }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getInitialsColor = (name: string) => {
    const colors = [
      'bg-blue-600', 'bg-purple-600', 'bg-green-600', 
      'bg-orange-600', 'bg-pink-600', 'bg-indigo-600'
    ];
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className="bg-slate-800 rounded-lg p-4 mb-3 cursor-move hover:bg-slate-750 transition-colors border border-slate-700"
      draggable
      onDragStart={(e) => onDragStart(e, candidate)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full ${getInitialsColor(candidate.name)} flex items-center justify-center text-white text-sm font-medium`}>
          {getInitials(candidate.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm mb-2 truncate">
            {candidate.name}
          </h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-3 h-3" />
              <span className="truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-3 h-3" />
              <span>{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>Applied {candidate.appliedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stage Column Component
const StageColumn: React.FC<{
  stage: CandidateStage;
  candidates: Candidate[];
  count: number;
  color: string;
  onDrop: (e: React.DragEvent, targetStage: CandidateStage) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, candidate: Candidate) => void;
}> = ({ stage, candidates, count, color, onDrop, onDragOver, onDragStart }) => {
  return (
    <div className="flex-1 min-w-80">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h2 className="text-white font-medium text-lg">{stage}</h2>
          <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-sm font-medium">
            {count}
          </span>
        </div>
      </div>
      
      <div
        className="min-h-96 bg-slate-900/50 rounded-lg p-4 border-2 border-dashed border-slate-700 hover:border-slate-600 transition-colors"
        onDrop={(e) => onDrop(e, stage)}
        onDragOver={onDragOver}
      >
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};

// Main Kanban Board Component
const CandidatesKanban: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState('All Jobs');
  const [selectedStage, setSelectedStage] = useState('All');
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Failed to load candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, candidate: Candidate) => {
    setDraggedCandidate(candidate);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStage: CandidateStage) => {
    e.preventDefault();
    
    if (!draggedCandidate || draggedCandidate.stage === targetStage) {
      setDraggedCandidate(null);
      return;
    }

    try {
      // Update candidate stage in backend
      await candidateService.updateCandidateStage(draggedCandidate.id!, targetStage);
      
      // Update local state
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === draggedCandidate.id 
            ? { ...candidate, stage: targetStage }
            : candidate
        )
      );
    } catch (error) {
      console.error('Failed to update candidate stage:', error);
    }
    
    setDraggedCandidate(null);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = selectedJob === 'All Jobs' || candidate.jobTitle === selectedJob;
    const matchesStage = selectedStage === 'All' || candidate.stage === selectedStage;
    
    return matchesSearch && matchesJob && matchesStage;
  });

  const getCandidatesByStage = (stage: CandidateStage) => {
    return filteredCandidates.filter(candidate => candidate.stage === stage);
  };

  const getStageCount = (stage: CandidateStage) => {
    return getCandidatesByStage(stage).length;
  };

  const stages = [
    { stage: CandidateStage.APPLIED, color: 'bg-blue-500', count: getStageCount(CandidateStage.APPLIED) },
    { stage: CandidateStage.PHONE_SCREEN, color: 'bg-orange-500', count: getStageCount(CandidateStage.PHONE_SCREEN) },
    { stage: CandidateStage.TECHNICAL_INTERVIEW, color: 'bg-purple-500', count: getStageCount(CandidateStage.TECHNICAL_INTERVIEW) },
    { stage: CandidateStage.OFFER, color: 'bg-teal-500', count: getStageCount(CandidateStage.OFFER) },
    { stage: CandidateStage.HIRED, color: 'bg-green-500', count: getStageCount(CandidateStage.HIRED) }
  ];

  const uniqueJobTitles = [...new Set(candidates.map(c => c.jobTitle))];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading candidates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">Candidates</h1>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="All">Stage: All</option>
              {Object.values(CandidateStage).map(stage => (
                <option key={stage} value={stage}>Stage: {stage}</option>
              ))}
            </select>

            <select
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
            >
              <option value="All Jobs">Job: All Jobs</option>
              {uniqueJobTitles.map(job => (
                <option key={job} value={job}>Job: {job}</option>
              ))}
            </select>
          </div>

          {/* Pipeline Info */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold">Hiring Pipeline</h2>
            </div>
            <p className="text-slate-400 mt-1">Drag candidates between stages to update their status</p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {stages.map(({ stage, color, count }) => (
            <StageColumn
              key={stage}
              stage={stage}
              candidates={getCandidatesByStage(stage)}
              count={count}
              color={color}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidatesKanban;