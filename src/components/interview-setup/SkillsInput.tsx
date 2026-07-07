'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
    <div className="space-y-3">
      <label className="block text-sm font-bold text-neutral-900">
        Key Skills
      </label>
      <p className="text-sm text-neutral-500">
        List the skills you want to be tested on. Press Enter to add each skill.
      </p>

      <div className="mt-3">
        <div
          className={`border-2 transition-all duration-300 rounded-xl px-4 py-3 ${
            isFocused
              ? 'border-neutral-900 bg-neutral-50'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex flex-wrap gap-2 mb-2">
            <AnimatePresence>
              {skills.map((skill) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="inline-flex items-center gap-1.5 bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium group"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-neutral-400 hover:text-white transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-neutral-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type a skill and press Enter..."
              className="flex-1 bg-transparent outline-none text-neutral-900 placeholder-neutral-400 text-base py-1 font-medium"
            />
          </div>
        </div>

        {/* Suggestions */}
        {isFocused && availableSuggestions.length > 0 && (
          <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-600 mb-2">Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleAddSkill(suggestion);
                  }}
                  className="px-3 py-1.5 text-sm text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 hover:border-neutral-400 hover:text-neutral-900 transition-all"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <p className="text-xs text-neutral-700">
          {skills.length} skill{skills.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}
