'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

interface DifficultySelectorProps {
  value: 'easy' | 'intermediate' | 'hard';
  onChange: (value: 'easy' | 'intermediate' | 'hard') => void;
}

export default function DifficultySelector({
  value,
  onChange,
}: DifficultySelectorProps) {
  const [description, setDescription] = useState('');

  const difficulties = [
    {
      id: 'easy',
      label: 'Easy',
      desc: 'Fundamentals and gentle warm-up questions',
    },
    {
      id: 'intermediate',
      label: 'Intermediate',
      desc: 'Real-world scenarios with moderate complexity',
    },
    {
      id: 'hard',
      label: 'Hard',
      desc: 'Challenging topics and deeper technical reasoning',
    },
  ] as const;

  useEffect(() => {
    const selected = difficulties.find((d) => d.id === value);
    setDescription(selected?.desc || '');
  }, [value]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Interview Difficulty
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Choose your experience level to receive appropriately challenging questions
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {difficulties.map((difficulty) => {
          const isSelected = value === difficulty.id;
          return (
            <button
              key={difficulty.id}
              onClick={() => onChange(difficulty.id)}
              className={`relative group px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Gradient background on hover for unselected */}
              {!isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none" />
              )}

              <div className="relative flex flex-col items-start">
                <span
                  className={`text-sm font-semibold transition-colors ${
                    isSelected ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {difficulty.label}
                </span>
                {isSelected && (
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-full">
                    <Activity className="h-3 w-3" />
                    <span className="text-xs font-medium">Selected</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Description */}
      <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">{description}</p>
      </div>

      {/* Difficulty Scale */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-medium text-gray-600">Easier</span>
        <div className="flex-1 mx-3 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full" />
        <span className="text-xs font-medium text-gray-600">Harder</span>
      </div>
    </div>
  );
}
