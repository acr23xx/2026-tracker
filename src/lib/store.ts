import { create } from 'zustand';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  subDays,
  isAfter,
  isBefore,
} from 'date-fns';
import type { DailyLog, Book, Movie, Sprint, OneTimeGoal, WeeklySummary, MonthlySummary, BingoSquare } from './types';

interface TrackerState {
  // Data
  dailyLogs: Record<string, DailyLog>;
  books: Book[];
  movies: Movie[];
  sprints: Sprint[];
  oneTimeGoals: OneTimeGoal[];
  isLoading: boolean;
  
  // Data loading
  loadAllData: () => Promise<void>;
  
  // Daily Log actions
  getDailyLog: (date: string) => DailyLog;
  updateDailyLog: (date: string, updates: Partial<DailyLog>) => Promise<void>;
  deleteDailyLog: (date: string) => Promise<void>;
  checkIn: (date: string) => Promise<void>;
  
  // Book actions
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  
  // Movie actions
  addMovie: (movie: Omit<Movie, 'id'>) => Promise<void>;
  updateMovie: (id: string, updates: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  
  // Sprint actions
  addSprint: (sprint: Omit<Sprint, 'id'>) => Promise<void>;
  updateSprint: (id: string, updates: Partial<Sprint>) => Promise<void>;
  deleteSprint: (id: string) => Promise<void>;
  
  // Goal actions
  toggleGoalComplete: (id: string) => Promise<void>;
  
  // Backup actions
  exportData: () => Promise<void>;
  importData: (file: File) => Promise<void>;
  
  // Stats & Calculations
  getWeeklySummary: (weekStart: Date) => WeeklySummary;
  getMonthlySummary: (monthStart: Date) => MonthlySummary;
  getConsecutivePhoneFreeWeeks: () => number;
  getTotalScreenUnder4Weeks: () => number;
  getBingoSquares: () => BingoSquare[];
  getMinWeight: () => number | null;
  getCurrentStreak: () => number;
}

const createEmptyDailyLog = (date: string): DailyLog => ({
  date,
  checkedIn: false,
  weight: null,
  wakeBefore9am: false,
  laFitness: false,
  closedAllRings: false,
  intermittentFast: false,
  screenTime: null,
  caffeine: null,
  alcoholUsed: false,
  weedUsed: false,
  fastFood: false,
  phoneFreeEvening: false,
  phoneFreeDate: false,
  pickleball: false,
  golf: false,
  liveEvent: false,
  notes: '',
});

export const useTrackerStore = create<TrackerState>()((set, get) => ({
  dailyLogs: {},
  books: [],
  movies: [],
  sprints: [],
  oneTimeGoals: [],
  isLoading: true,
  
  loadAllData: async () => {
    try {
      const [logsRes, booksRes, moviesRes, sprintsRes, goalsRes] = await Promise.all([
        fetch('/api/daily-logs'),
        fetch('/api/books'),
        fetch('/api/movies'),
        fetch('/api/sprints'),
        fetch('/api/goals'),
      ]);
      
      const [logs, books, movies, sprints, goals] = await Promise.all([
        logsRes.json(),
        booksRes.json(),
        moviesRes.json(),
        sprintsRes.json(),
        goalsRes.json(),
      ]);
      
      // Convert logs array to record keyed by date
      const logsRecord: Record<string, DailyLog> = {};
      if (Array.isArray(logs)) {
        logs.forEach((log: DailyLog) => {
          logsRecord[log.date] = log;
        });
      }
      
      set({
        dailyLogs: logsRecord,
        books: Array.isArray(books) ? books : [],
        movies: Array.isArray(movies) ? movies : [],
        sprints: Array.isArray(sprints) ? sprints : [],
        oneTimeGoals: Array.isArray(goals) ? goals : [],
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      set({ isLoading: false });
    }
  },
  
  getDailyLog: (date: string) => {
    const logs = get().dailyLogs;
    return logs[date] || createEmptyDailyLog(date);
  },
  
  updateDailyLog: async (date: string, updates: Partial<DailyLog>) => {
    const currentLog = get().getDailyLog(date);
    const newLog = { ...currentLog, ...updates, date };
    
    // Optimistic update
    set((state) => ({
      dailyLogs: { ...state.dailyLogs, [date]: newLog },
    }));
    
    try {
      await fetch('/api/daily-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      });
    } catch (error) {
      console.error('Failed to save daily log:', error);
    }
  },
  
  checkIn: async (date: string) => {
    await get().updateDailyLog(date, { checkedIn: true });
  },

  deleteDailyLog: async (date: string) => {
    set((state) => {
      const newLogs = { ...state.dailyLogs };
      delete newLogs[date];
      return { dailyLogs: newLogs };
    });
    
    try {
      await fetch(`/api/daily-logs?date=${date}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete daily log:', error);
    }
  },
  
  addBook: async (book) => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
      const newBook = await res.json();
      set((state) => ({ books: [...state.books, newBook] }));
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  },
  
  updateBook: async (id, updates) => {
    set((state) => ({
      books: state.books.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
    
    try {
      await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  },
  
  deleteBook: async (id) => {
    set((state) => ({ books: state.books.filter((b) => b.id !== id) }));
    
    try {
      await fetch(`/api/books/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  },
  
  addMovie: async (movie) => {
    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      });
      const newMovie = await res.json();
      set((state) => ({ movies: [...state.movies, newMovie] }));
    } catch (error) {
      console.error('Failed to add movie:', error);
    }
  },
  
  updateMovie: async (id, updates) => {
    set((state) => ({
      movies: state.movies.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
    
    try {
      await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Failed to update movie:', error);
    }
  },
  
  deleteMovie: async (id) => {
    set((state) => ({ movies: state.movies.filter((m) => m.id !== id) }));
    
    try {
      await fetch(`/api/movies/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete movie:', error);
    }
  },
  
  addSprint: async (sprint) => {
    try {
      const res = await fetch('/api/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sprint),
      });
      const newSprint = await res.json();
      set((state) => ({ sprints: [...state.sprints, newSprint] }));
    } catch (error) {
      console.error('Failed to add sprint:', error);
    }
  },
  
  updateSprint: async (id, updates) => {
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    
    try {
      await fetch(`/api/sprints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Failed to update sprint:', error);
    }
  },
  
  deleteSprint: async (id) => {
    set((state) => ({ sprints: state.sprints.filter((s) => s.id !== id) }));
    
    try {
      await fetch(`/api/sprints/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete sprint:', error);
    }
  },
  
  toggleGoalComplete: async (id: string) => {
    const goal = get().oneTimeGoals.find((g) => g.id === id);
    if (!goal) return;
    
    const updates = {
      completed: !goal.completed,
      dateCompleted: !goal.completed ? format(new Date(), 'yyyy-MM-dd') : null,
    };
    
    set((state) => ({
      oneTimeGoals: state.oneTimeGoals.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    }));
    
    try {
      await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  },
  
  exportData: async () => {
    try {
      const res = await fetch('/api/backup');
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bingo-tracker-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  },
  
  importData: async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      // Reload all data
      await get().loadAllData();
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  },
  
  getWeeklySummary: (weekStart: Date) => {
    const start = startOfWeek(weekStart, { weekStartsOn: 1 });
    const end = endOfWeek(weekStart, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    const logs = get().dailyLogs;
    
    let checkIns = 0;
    let phoneFreeEvenings = 0;
    let totalScreenTime = 0;
    let screenTimeDays = 0;
    
    days.forEach((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const log = logs[dateStr];
      if (log?.checkedIn) {
        checkIns++;
        if (log.phoneFreeEvening) phoneFreeEvenings++;
        if (log.screenTime !== null) {
          totalScreenTime += log.screenTime;
          screenTimeDays++;
        }
      }
    });
    
    const avgScreenTime = screenTimeDays > 0 ? totalScreenTime / screenTimeDays : 0;
    const allDaysCheckedIn = checkIns === days.length;
    
    return {
      weekStart: format(start, 'yyyy-MM-dd'),
      daysInWeek: days.length,
      checkIns,
      phoneFreeEvenings,
      isPhoneFreeWeek: allDaysCheckedIn && phoneFreeEvenings >= 1,
      avgScreenTime,
      isScreenUnder4Week: allDaysCheckedIn && avgScreenTime < 4 && screenTimeDays > 0,
    };
  },
  
  getMonthlySummary: (monthStart: Date) => {
    const start = startOfMonth(monthStart);
    const end = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start, end });
    const logs = get().dailyLogs;
    
    let checkIns = 0;
    let weedDays = 0;
    let alcoholDays = 0;
    let fastFoodDays = 0;
    
    days.forEach((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const log = logs[dateStr];
      if (log?.checkedIn) {
        checkIns++;
        if (log.weedUsed) weedDays++;
        if (log.alcoholUsed) alcoholDays++;
        if (log.fastFood) fastFoodDays++;
      }
    });
    
    const allDaysCheckedIn = checkIns === days.length;
    
    return {
      monthStart: format(start, 'yyyy-MM-dd'),
      month: format(start, 'MMMM yyyy'),
      daysInMonth: days.length,
      checkIns,
      weedDays,
      isWeedFreeMonth: allDaysCheckedIn && weedDays === 0,
      alcoholDays,
      isAlcoholFreeMonth: allDaysCheckedIn && alcoholDays === 0,
      fastFoodDays,
      isFastFoodFreeMonth: allDaysCheckedIn && fastFoodDays === 0,
    };
  },
  
  getConsecutivePhoneFreeWeeks: () => {
    const today = new Date();
    let consecutiveWeeks = 0;
    let currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    
    while (true) {
      const summary = get().getWeeklySummary(currentWeekStart);
      if (summary.isPhoneFreeWeek) {
        consecutiveWeeks++;
        currentWeekStart = subDays(currentWeekStart, 7);
      } else {
        break;
      }
    }
    
    return consecutiveWeeks;
  },
  
  getTotalScreenUnder4Weeks: () => {
    const year2026Start = new Date(2026, 0, 1);
    const today = new Date();
    
    let totalWeeks = 0;
    let currentWeekStart = startOfWeek(year2026Start, { weekStartsOn: 1 });
    
    while (isBefore(currentWeekStart, today)) {
      const summary = get().getWeeklySummary(currentWeekStart);
      if (summary.isScreenUnder4Week) {
        totalWeeks++;
      }
      currentWeekStart = new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    
    return totalWeeks;
  },
  
  getMinWeight: () => {
    const logs = get().dailyLogs;
    let minWeight: number | null = null;
    
    Object.values(logs).forEach((log) => {
      if (log.weight !== null && (minWeight === null || log.weight < minWeight)) {
        minWeight = log.weight;
      }
    });
    
    return minWeight;
  },
  
  getCurrentStreak: () => {
    const logs = get().dailyLogs;
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const log = logs[dateStr];
      
      if (log?.checkedIn) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  },
  
  getBingoSquares: () => {
    const state = get();
    const logs = state.dailyLogs;
    const today = new Date();
    
    // Count daily log totals
    let laFitnessCount = 0;
    let wakeBefore9amCount = 0;
    let closedAllRingsCount = 0;
    let intermittentFastCount = 0;
    let lowCaffeineCount = 0;
    let phoneFreeEveningsCount = 0;
    let phoneFreeeDateCount = 0;
    let pickleballCount = 0;
    let golfCount = 0;
    let liveEventCount = 0;
    
    Object.values(logs).forEach((log) => {
      if (log.checkedIn) {
        if (log.laFitness) laFitnessCount++;
        if (log.wakeBefore9am) wakeBefore9amCount++;
        if (log.closedAllRings) closedAllRingsCount++;
        if (log.intermittentFast) intermittentFastCount++;
        if (log.caffeine !== null && log.caffeine < 200) lowCaffeineCount++;
        if (log.phoneFreeEvening) phoneFreeEveningsCount++;
        if (log.phoneFreeDate) phoneFreeeDateCount++;
        if (log.pickleball) pickleballCount++;
        if (log.golf) golfCount++;
        if (log.liveEvent) liveEventCount++;
      }
    });
    
    // Check for fast-food-free months
    let hasFastFoodFreeMonth = false;
    
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(2026, month, 1);
      if (isAfter(monthDate, today)) break;
      
      const summary = state.getMonthlySummary(monthDate);
      if (summary.isFastFoodFreeMonth) hasFastFoodFreeMonth = true;
    }
    
    // Calculate 80% year goals for weed and alcohol
    let totalCheckedInDays = 0;
    let weedFreeDays = 0;
    let alcoholFreeDays = 0;
    
    Object.values(logs).forEach((log) => {
      if (log.checkedIn) {
        totalCheckedInDays++;
        if (!log.weedUsed) weedFreeDays++;
        if (!log.alcoholUsed) alcoholFreeDays++;
      }
    });
    
    const weedFreePercent = totalCheckedInDays > 0 ? (weedFreeDays / totalCheckedInDays) * 100 : 0;
    const alcoholFreePercent = totalCheckedInDays > 0 ? (alcoholFreeDays / totalCheckedInDays) * 100 : 0;
    
    // Count sprints with 10+ points
    const sprintsWith10Points = state.sprints.filter(s => s.points >= 10).length;
    
    // Count books and 2026 movies
    const booksCount = state.books.length;
    const movies2026Count = state.movies.filter(m => m.releaseYear === 2026).length;
    
    // One-time goals
    const tvApp = state.oneTimeGoals.find(g => g.id === 'tv-app')?.completed || false;
    const officeWalls = state.oneTimeGoals.find(g => g.id === 'office-walls')?.completed || false;
    const dentist = state.oneTimeGoals.find(g => g.id === 'dentist')?.completed || false;
    const doctor = state.oneTimeGoals.find(g => g.id === 'doctor')?.completed || false;
    const clothes = state.oneTimeGoals.find(g => g.id === 'clothes')?.completed || false;
    const dynastyAlgo = state.oneTimeGoals.find(g => g.id === 'dynasty-algo')?.completed || false;
    
    // Consecutive weeks calculations
    const consecutivePhoneFreeWeeks = state.getConsecutivePhoneFreeWeeks();
    const totalScreenUnder4Weeks = state.getTotalScreenUnder4Weeks();
    
    // Min weight
    const minWeight = state.getMinWeight();
    
    const squares: BingoSquare[] = [
      // Row 1
      { id: '1', category: 'Health', title: 'Get to 175 lbs', progress: minWeight || 0, target: 175, done: minWeight !== null && minWeight <= 175, measurement: 'Min weight ≤ 175' },
      { id: '2', category: 'Habits', title: 'Weed-free 80% of the year', progress: Math.round(weedFreePercent), target: 80, done: weedFreePercent >= 80, measurement: `${weedFreeDays}/${totalCheckedInDays} days clean (${Math.round(weedFreePercent)}%)` },
      { id: '3', category: 'Fitness', title: 'Go to LA Fitness 80 times', progress: laFitnessCount, target: 80, done: laFitnessCount >= 80, measurement: 'LA Fitness check-ins' },
      { id: '4', category: 'Food', title: 'No fast food for an entire month', progress: hasFastFoodFreeMonth ? 1 : 0, target: 1, done: hasFastFoodFreeMonth, measurement: 'Complete month with all check-ins, no fast food' },
      { id: '5', category: 'Work', title: 'Get 10 points in a sprint 10 times', progress: sprintsWith10Points, target: 10, done: sprintsWith10Points >= 10, measurement: 'Sprints with 10+ points' },
      
      // Row 2
      { id: '6', category: 'Media', title: 'Read 5 books', progress: booksCount, target: 5, done: booksCount >= 5, measurement: 'Books finished' },
      { id: '7', category: 'Habits', title: 'Wake up before 9am 100 times', progress: wakeBefore9amCount, target: 100, done: wakeBefore9amCount >= 100, measurement: 'Wake <9am check-ins' },
      { id: '8', category: 'Media', title: 'Watch 50 movies released in 2026', progress: movies2026Count, target: 50, done: movies2026Count >= 50, measurement: '2026 movies watched' },
      { id: '9', category: 'Projects', title: 'Create TV show tracking app', progress: tvApp ? 1 : 0, target: 1, done: tvApp, measurement: 'One-time goal' },
      { id: '10', category: 'Tech', title: 'Phone-free evening 1x/week for 8 straight weeks', progress: consecutivePhoneFreeWeeks, target: 8, done: consecutivePhoneFreeWeeks >= 8, measurement: 'Consecutive phone-free weeks' },
      
      // Row 3
      { id: '11', category: 'Home', title: 'Hang stuff on office walls', progress: officeWalls ? 1 : 0, target: 1, done: officeWalls, measurement: 'One-time goal' },
      { id: '12', category: 'Health', title: 'Go to the Dentist', progress: dentist ? 1 : 0, target: 1, done: dentist, measurement: 'One-time goal' },
      { id: '13', category: 'Wildcard', title: 'Free Square', progress: 1, target: 1, done: true, measurement: 'Always complete' },
      { id: '14', category: 'Health', title: 'Go to the Doctor', progress: doctor ? 1 : 0, target: 1, done: doctor, measurement: 'One-time goal' },
      { id: '15', category: 'Tech', title: 'Daily avg screen time <4h for 10 total weeks', progress: totalScreenUnder4Weeks, target: 10, done: totalScreenUnder4Weeks >= 10, measurement: 'Weeks with avg <4h screen time' },
      
      // Row 4
      { id: '16', category: 'Fitness', title: 'Close all Apple Watch rings 100 times', progress: closedAllRingsCount, target: 100, done: closedAllRingsCount >= 100, measurement: 'Days with all rings closed' },
      { id: '17', category: 'Habits', title: 'Alcohol-free 80% of the year', progress: Math.round(alcoholFreePercent), target: 80, done: alcoholFreePercent >= 80, measurement: `${alcoholFreeDays}/${totalCheckedInDays} days clean (${Math.round(alcoholFreePercent)}%)` },
      { id: '18', category: 'Home', title: 'Get rid of clothes that do not fit', progress: clothes ? 1 : 0, target: 1, done: clothes, measurement: 'One-time goal' },
      { id: '19', category: 'Habits', title: 'Intermittent fast 100 times', progress: intermittentFastCount, target: 100, done: intermittentFastCount >= 100, measurement: 'Intermittent fast days' },
      { id: '20', category: 'Projects', title: 'Create a dynasty salary algorithm', progress: dynastyAlgo ? 1 : 0, target: 1, done: dynastyAlgo, measurement: 'One-time goal' },
      
      // Row 5
      { id: '21', category: 'Fun', title: 'Go to 5 live events', progress: liveEventCount, target: 5, done: liveEventCount >= 5, measurement: 'Live events attended' },
      { id: '22', category: 'Fun', title: 'Play Pickleball 10 times', progress: pickleballCount, target: 10, done: pickleballCount >= 10, measurement: 'Pickleball sessions' },
      { id: '23', category: 'Fun', title: 'Golf 5 times', progress: golfCount, target: 5, done: golfCount >= 5, measurement: 'Golf sessions' },
      { id: '24', category: 'Habits', title: 'Under 200 mg of caffeine 75 times', progress: lowCaffeineCount, target: 75, done: lowCaffeineCount >= 75, measurement: 'Days with <200mg caffeine' },
      { id: '25', category: 'Relationship', title: '10 phone-free date nights', progress: phoneFreeeDateCount, target: 10, done: phoneFreeeDateCount >= 10, measurement: 'Phone-free date nights' },
    ];
    
    return squares;
  },
}));
