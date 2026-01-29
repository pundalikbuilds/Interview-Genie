'use client';

import { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillsInput({ skills, onChange }: SkillsInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    'React',
    'TypeScript',
    'Python',
    'Database Design',
    'System Design',
    'Problem Solving',
    'Communication',
  ];

  const availableSuggestions = suggestions.filter(
    (s) => !skills.some((skill) => skill.toLowerCase() === s.toLowerCase())
  );

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInput('');
      inputRef.current?.focus();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(input);
    } else if (e.key === 'Backspace' && !input && skills.length > 0) {
      handleRemoveSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Key Skills
      </label>
      <p className="text-xs text-gray-500">
        List the skills you want to be tested on. Press Enter to add each skill.
      </p>

      <div className="mt-3">
        <div
          className={`border-2 transition-all duration-300 rounded-xl px-4 py-3 ${
            isFocused
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 group hover:shadow-sm transition-shadow"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-900"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type a skill and press Enter..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-base py-1"
            />
          </div>
        </div>

        {/* Suggestions */}
        {isFocused && availableSuggestions.length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-2">Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleAddSkill(suggestion);
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <p className="text-xs text-blue-600">
          {skills.length} skill{skills.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}
