'use client';

import { Briefcase } from 'lucide-react';

interface JobRoleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const POPULAR_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Product Manager',
  'UX Designer',
  'DevOps Engineer',
];

export default function JobRoleInput({ value, onChange }: JobRoleInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-2">
          Job Role / Position
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="jobRole"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Software Engineer, Product Manager..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-3">Popular roles:</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => onChange(role)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors duration-150 ${
                value === role
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
