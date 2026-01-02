'use client';

import { cn } from '@/lib/utils';

interface RatingSelectorProps {
  value: number;
  onChange: (value: number) => void;
  labels?: string[];
  emojis?: string[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const defaultEmojis = ['😢', '😕', '😐', '🙂', '😄'];

export function RatingSelector({
  value,
  onChange,
  labels,
  emojis = defaultEmojis,
  className,
  size = 'md',
}: RatingSelectorProps) {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-14 h-14 text-3xl',
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex gap-2">
        {emojis.map((emoji, index) => {
          const rating = index + 1;
          const isSelected = value === rating;
          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className={cn(
                sizes[size],
                'rounded-full flex items-center justify-center transition-all duration-200',
                isSelected
                  ? 'bg-primary/20 ring-2 ring-primary scale-110'
                  : 'hover:bg-muted hover:scale-105 opacity-50 hover:opacity-100'
              )}
            >
              {emoji}
            </button>
          );
        })}
      </div>
      {labels && value > 0 && (
        <span className="text-sm text-muted-foreground font-medium">
          {labels[value - 1]}
        </span>
      )}
    </div>
  );
}
