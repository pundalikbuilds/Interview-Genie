'use client';

import { useState, useRef, useEffect } from 'react';
import { Briefcase } from 'lucide-react';

interface JobRoleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobRoleInput({ value, onChange }: JobRoleInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState('Frontend Developer');
  const inputRef = useRef<HTMLInputElement>(null);

  const examples = [
    'Frontend Developer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
    'DevOps Engineer',
  ];

  useEffect(() => {
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setPlaceholder(randomExample);
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Target Role
      </label>
      <p className="text-xs text-gray-500">
        We'll personalize your interview questions based on the role you're applying for
      </p>

      <div className="relative mt-3">
        <div
          className={`relative flex items-center border-2 transition-all duration-300 ${
            isFocused
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          } rounded-xl px-4 py-3`}
        >
          <Briefcase
            className={`h-5 w-5 transition-colors ${
              isFocused ? 'text-blue-600' : 'text-gray-400'
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="ml-3 flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-base"
          />
        </div>

        {value && (
          <div className="absolute top-full mt-2 left-0 right-0 text-xs text-gray-500 px-1">
            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded">
              Ready to personalize
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
