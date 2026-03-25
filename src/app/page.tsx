'use client';

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  Film,
  Target,
  Menu,
  Download,
  Upload,
  Loader2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dashboard } from '@/components/Dashboard';
import { DailyCheckIn } from '@/components/DailyCheckIn';
import { BooksLog } from '@/components/BooksLog';
import { MoviesLog } from '@/components/MoviesLog';
import { GoalsTracker } from '@/components/GoalsTracker';
import { useTrackerStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard, color: 'text-blue-400' },
  { id: 'daily', label: 'Daily Log', shortLabel: 'Daily', icon: CalendarCheck, color: 'text-emerald-400' },
  { id: 'books', label: 'Books', shortLabel: 'Books', icon: BookOpen, color: 'text-violet-400' },
  { id: 'movies', label: 'Movies', shortLabel: 'Movies', icon: Film, color: 'text-rose-400' },
  { id: 'goals', label: 'One-Time Goals', shortLabel: 'Goals', icon: Target, color: 'text-teal-400' },
] as const;

const MOBILE_MAIN_TABS = TABS.slice(0, 4);
const MOBILE_MORE_TABS = TABS.slice(4);

type TabId = typeof TABS[number]['id'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { loadAllData, isLoading, exportData, importData } = useTrackerStore();

  useEffect(() => {
    loadAllData();
    document.documentElement.classList.add('dark');
  }, [loadAllData]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importData(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const currentYear = format(new Date(), 'yyyy');

  if (isLoading) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-[oklch(0.18_0.035_250)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-slate-400">Loading your tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-[oklch(0.18_0.035_250)]">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[oklch(0.20_0.035_250)]/90 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-blue-500/25">
                B
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-white">Bingo Tracker</h1>
                <p className="text-xs text-slate-400">{currentYear} Edition</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'gap-2',
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-indigo-700'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    )}
                  >
                    <Icon className={cn('h-4 w-4', activeTab !== tab.id && tab.color)} />
                    {tab.label}
                  </Button>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={exportData}
                title="Export backup"
                className="rounded-full text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                title="Import backup"
                className="rounded-full text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                <Upload className="h-4 w-4" />
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-slate-300 hover:text-white hover:bg-white/[0.06]">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 bg-[oklch(0.20_0.035_250)] border-white/[0.06]">
                  <div className="flex flex-col gap-2 mt-8">
                    {TABS.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <Button
                          key={tab.id}
                          variant={activeTab === tab.id ? 'default' : 'ghost'}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsMobileNavOpen(false);
                          }}
                          className={cn(
                            'justify-start gap-3',
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                              : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                          )}
                        >
                          <Icon className={cn('h-5 w-5', activeTab !== tab.id && tab.color)} />
                          {tab.label}
                        </Button>
                      );
                    })}

                    <div className="border-t border-white/[0.06] my-4" />

                    <Button variant="outline" onClick={exportData} className="justify-start gap-3 border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.06]">
                      <Download className="h-5 w-5" />
                      Export Backup
                    </Button>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="justify-start gap-3 border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.06]">
                      <Upload className="h-5 w-5" />
                      Import Backup
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'daily' && <DailyCheckIn />}
          {activeTab === 'books' && <BooksLog />}
          {activeTab === 'movies' && <MoviesLog />}
          {activeTab === 'goals' && <GoalsTracker />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-[oklch(0.19_0.035_250)]/95 backdrop-blur-xl safe-area-pb">
        <div className="flex items-center justify-around h-16 px-2">
          {MOBILE_MAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full gap-0.5 rounded-lg transition-colors',
                  isActive ? 'text-blue-400' : 'text-slate-500'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{tab.shortLabel}</span>
                {isActive && (
                  <div className="absolute bottom-1 w-8 h-1 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}

          {/* More button */}
          <Sheet open={isMobileMoreOpen} onOpenChange={setIsMobileMoreOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full gap-0.5 rounded-lg transition-colors',
                  MOBILE_MORE_TABS.some(t => t.id === activeTab) ? 'text-blue-400' : 'text-slate-500'
                )}
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto rounded-t-2xl bg-[oklch(0.22_0.035_250)] border-white/[0.06]">
              <div className="py-4 space-y-2">
                <p className="text-sm font-semibold text-slate-400 px-2 mb-3">More Options</p>
                {MOBILE_MORE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'ghost'}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMoreOpen(false);
                      }}
                      className={cn(
                        'w-full justify-start gap-3 h-12',
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                      )}
                    >
                      <Icon className={cn('h-5 w-5', activeTab !== tab.id && tab.color)} />
                      {tab.label}
                    </Button>
                  );
                })}

                <div className="border-t border-white/[0.06] my-3" />

                <Button variant="outline" onClick={exportData} className="w-full justify-start gap-3 h-12 border-white/[0.1] text-slate-300 hover:text-white">
                  <Download className="h-5 w-5" />
                  Export Backup
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full justify-start gap-3 h-12 border-white/[0.1] text-slate-300 hover:text-white">
                  <Upload className="h-5 w-5" />
                  Import Backup
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Footer - Desktop only */}
      <footer className="hidden lg:block border-t border-white/[0.06] mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-slate-500">
            {currentYear} Bingo Tracker
          </p>
        </div>
      </footer>
    </div>
  );
}
