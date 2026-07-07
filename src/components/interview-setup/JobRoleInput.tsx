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
    <div className="space-y-3">
      <label className="block text-sm font-bold text-neutral-900">
        Target Role
      </label>
      <p className="text-sm text-neutral-500">
        What position are you interviewing for?
      </p>

      <div className="relative mt-3">
        <div
          className={`relative flex items-center border-2 transition-all duration-300 ${
            isFocused
              ? 'border-neutral-900 bg-neutral-50'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          } rounded-xl px-4 py-3.5`}
        >
          <Briefcase
            className={`h-5 w-5 transition-colors ${
              isFocused ? 'text-neutral-900' : 'text-neutral-400'
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
            className="ml-3 flex-1 bg-transparent outline-none text-neutral-900 placeholder-neutral-400 text-base font-medium"
          />
        </div>

        {value && (
          <div className="absolute top-full mt-2 left-0 right-0 text-xs text-neutral-500 px-1">
            <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-700 rounded">
              Ready to personalize
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
