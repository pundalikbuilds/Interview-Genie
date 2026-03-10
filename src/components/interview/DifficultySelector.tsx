'use client';

interface DifficultySelectorProps {
  value: 'easy' | 'intermediate' | 'hard';
  onChange: (value: 'easy' | 'intermediate' | 'hard') => void;
}

export default function DifficultySelector({
  value,
  onChange,
}: DifficultySelectorProps) {
  const difficulties = [
    {
      id: 'easy',
      label: 'Easy',
    },
    {
      id: 'intermediate',
      label: 'Intermediate',
    },
    {
      id: 'hard',
      label: 'Hard',
    },
  ] as const;

  const selectedIndex = difficulties.findIndex((difficulty) => difficulty.id === value);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-neutral-900 mb-2">
          Interview Difficulty
        </label>
        <p className="text-sm text-gray-600">Move the point on the bar to set your interview level.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div
          role="radiogroup"
          aria-label="Interview difficulty"
          className="relative rounded-xl bg-gray-100 border border-gray-200 p-1"
        >
          <div
            className="absolute top-1 bottom-1 rounded-lg bg-white border border-neutral-300 shadow-sm transition-all duration-300"
            style={{
              left: `calc(${selectedIndex} * (100% / 3) + 0.25rem)`,
              width: 'calc(33.333% - 0.5rem)',
            }}
          />

          <div className="relative grid grid-cols-3 gap-1">
            {difficulties.map((difficulty) => {
              const isSelected = value === difficulty.id;

              return (
                <button
                  key={difficulty.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onChange(difficulty.id)}
                  className={`z-10 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isSelected ? 'text-neutral-900' : 'text-gray-500 hover:text-neutral-800'
                  }`}
                >
                  {difficulty.label}
                </button>
              );
            })}
          </div>

          <div className="mt-2 grid grid-cols-3 px-2">
            {difficulties.map((difficulty) => (
              <div key={difficulty.id} className="flex justify-center">
                <div
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    value === difficulty.id ? 'bg-neutral-900' : 'bg-gray-300'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
