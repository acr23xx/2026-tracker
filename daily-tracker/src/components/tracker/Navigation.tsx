'use client';

import { Home, CalendarDays, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'today' | 'week' | 'month' | 'stats' | 'settings';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

const tabs = [
  { id: 'today' as const, label: 'Today', icon: Home },
  { id: 'week' as const, label: 'Week', icon: CalendarDays },
  { id: 'month' as const, label: 'Month', icon: CalendarDays },
  { id: 'stats' as const, label: 'Stats', icon: BarChart3 },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
];

export function Navigation({ activeTab, onTabChange, className }: NavigationProps) {
  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50',
      'safe-area-inset-bottom',
      className
    )}>
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all',
                  'min-w-[60px]',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 mb-1 transition-transform',
                  isActive && 'scale-110'
                )} />
                <span className={cn(
                  'text-xs font-medium',
                  isActive && 'font-semibold'
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
