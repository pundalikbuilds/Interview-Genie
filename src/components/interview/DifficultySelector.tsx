'use client';

interface DifficultySelectorProps {
  value: 'easy' | 'medium' | 'hard';
  onChange: (value: 'easy' | 'medium' | 'hard') => void;
}

const DIFFICULTY_OPTIONS = [
  {
    value: 'easy' as const,
    label: 'Easy',
    description: 'Great for beginners or warming up. Covers fundamental concepts.',
    color: 'green',
    badge: '🌱 Beginner',
  },
  {
    value: 'medium' as const,
    label: 'Medium',
    description: 'Intermediate questions. Tests practical knowledge and experience.',
    color: 'yellow',
    badge: '⚡ Intermediate',
  },
  {
    value: 'hard' as const,
    label: 'Hard',
    description: 'Advanced topics. Designed to replicate real senior-level interviews.',
    color: 'red',
    badge: '🔥 Advanced',
  },
];

const colorClasses = {
  green: {
    selected: 'border-green-500 bg-green-50',
    dot: 'bg-green-500',
    badge: 'bg-green-100 text-green-700',
  },
  yellow: {
    selected: 'border-yellow-500 bg-yellow-50',
    dot: 'bg-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  red: {
    selected: 'border-red-500 bg-red-50',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
  },
};

export default function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Difficulty Level
      </label>
      {DIFFICULTY_OPTIONS.map((option) => {
        const colors = colorClasses[option.color as keyof typeof colorClasses];
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${
              isSelected
                ? colors.selected
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                isSelected ? `${colors.dot} border-transparent` : 'border-gray-400'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{option.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                    {option.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
