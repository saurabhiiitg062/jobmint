import React, { useState } from 'react';
import { Flame, CheckCircle } from 'lucide-react';
import type { Job } from '@/types';

interface EligibilityCheckerProps {
  jobs: Job[]; // list of jobs to evaluate eligibility against
}

const qualifications = ['10th Pass', '12th Pass', 'Diploma', 'Graduation', 'B.Tech'];
const states = ['Bihar', 'Karnataka', 'UP', 'Delhi'];
const categories = ['SSC', 'UPSC', 'RRB', 'ISRO', 'DRDO', 'IBPS', 'NTA'];

const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ jobs }) => {
  const [show, setShow] = useState(false);
  const [qual, setQual] = useState('');
  const [age, setAge] = useState(''); // placeholder for future use
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [eligibleJobs, setEligibleJobs] = useState<Job[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = jobs.filter((job) => {
      const matchesQualification = qual ? job.qualification?.includes(qual) : true;
      const matchesState = state ? job.state === state : true;
      const matchesCategory = category ? job.organization === category : true;
      return matchesQualification && matchesState && matchesCategory;
    });
    setEligibleJobs(filtered);
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="flex items-center space-x-2 text-primary hover:text-red-700 font-medium"
      >
        <Flame className="w-4 h-4 text-accent" />
        <span>Eligibility Checker 🔥</span>
      </button>
      {show && (
        <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={qual}
              onChange={(e) => setQual(e.target.value)}
              className="border border-gray-300 rounded p-1 text-sm"
            >
              <option value="">Any Qualification</option>
              {qualifications.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border border-gray-300 rounded p-1 text-sm"
            />
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border border-gray-300 rounded p-1 text-sm"
            >
              <option value="">Any State</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded p-1 text-sm"
            >
              <option value="">Any Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-[#600000]"
          >
            Check Eligibility
          </button>
        </form>
      )}
      {eligibleJobs.length > 0 && (
        <div className="mt-4 text-sm">
          <p className="font-medium">You are eligible for:</p>
          <ul className="list-disc list-inside mt-1">
            {eligibleJobs.map((job) => (
              <li key={job._id} className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>{job.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker;
