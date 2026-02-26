'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

const SUGGESTED_SKILLS: Record<string, string[]> = {
  default: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'REST APIs'],
};

export default function SkillsInput({ skills, onChange }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInputValue('');
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  const suggestions = SUGGESTED_SKILLS.default.filter(
    (s) => !skills.includes(s)
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills & Technologies
        </label>

        {/* Skills tags + input */}
        <div className="min-h-[50px] w-full flex flex-wrap gap-2 p-3 border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-blue-900 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={skills.length === 0 ? 'Type a skill and press Enter...' : ''}
            className="flex-1 min-w-[120px] outline-none text-sm text-gray-900 placeholder-gray-400 bg-transparent"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add a skill</p>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Suggested skills:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-dashed border-gray-300 text-gray-600 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus className="h-3 w-3" />
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
