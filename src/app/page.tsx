'use client';

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BookOpen, 
  Film, 
  Flame, 
  Target,
  Menu,
  Moon,
  Sun,
  Download,
  Upload,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dashboard } from '@/components/Dashboard';
import { DailyCheckIn } from '@/components/DailyCheckIn';
import { BooksLog } from '@/components/BooksLog';
import { MoviesLog } from '@/components/MoviesLog';
import { SprintsLog } from '@/components/SprintsLog';
import { GoalsTracker } from '@/components/GoalsTracker';
import { useTrackerStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-amber-600' },
  { id: 'daily', label: 'Daily Log', icon: CalendarCheck, color: 'text-green-600' },
  { id: 'books', label: 'Books', icon: BookOpen, color: 'text-indigo-600' },
  { id: 'movies', label: 'Movies', icon: Film, color: 'text-rose-600' },
  { id: 'sprints', label: 'Sprints', icon: Flame, color: 'text-slate-600' },
  { id: 'goals', label: 'One-Time Goals', icon: Target, color: 'text-teal-600' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { loadAllData, isLoading, exportData, importData } = useTrackerStore();
  
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };
  
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-muted-foreground">Loading your tracker...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 dark:from-stone-950 dark:via-amber-950/10 dark:to-orange-950/10', isDark && 'dark')}>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOTc5MTYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" />
      
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg dark:bg-stone-950/80 dark:border-stone-800">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-amber-500/20">
                B
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">Bingo Tracker</h1>
                <p className="text-xs text-muted-foreground">{currentYear} Edition</p>
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
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20' 
                        : ''
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
              {/* Backup Controls */}
              <Button
                variant="ghost"
                size="icon"
                onClick={exportData}
                title="Export backup"
                className="rounded-full"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                title="Import backup"
                className="rounded-full"
              >
                <Upload className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {/* Mobile Menu */}
              <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
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
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                              : ''
                          )}
                        >
                          <Icon className={cn('h-5 w-5', activeTab !== tab.id && tab.color)} />
                          {tab.label}
                        </Button>
                      );
                    })}
                    
                    <div className="border-t my-4" />
                    
                    <Button variant="outline" onClick={exportData} className="justify-start gap-3">
                      <Download className="h-5 w-5" />
                      Export Backup
                    </Button>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="justify-start gap-3">
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
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'daily' && <DailyCheckIn />}
          {activeTab === 'books' && <BooksLog />}
          {activeTab === 'movies' && <MoviesLog />}
          {activeTab === 'sprints' && <SprintsLog />}
          {activeTab === 'goals' && <GoalsTracker />}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-stone-950/50 dark:border-stone-800 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            {currentYear} Bingo Tracker • Data stored in SQLite database
          </p>
        </div>
      </footer>
    </div>
  );
}
