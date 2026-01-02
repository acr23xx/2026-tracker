# Daily Tracker

A beautiful, mobile-first daily tracking app built with Next.js, Tailwind CSS, and shadcn/ui. Track your habits, mood, sleep, fitness, productivity, and more – all in one place.

![Daily Tracker](https://via.placeholder.com/800x400/6366f1/white?text=Daily+Tracker)

## Features

### 📊 Comprehensive Daily Tracking
- **Sleep**: Track hours, quality, bed time, and wake time
- **Mood & Energy**: Rate your morning/evening mood, energy levels, and stress
- **Fitness**: Log exercise, steps, water intake, and eating habits
- **Productivity**: Track focus hours, tasks planned/completed
- **Habits**: Customizable daily habit checklist
- **Gratitude**: Daily gratitude journaling
- **Notes**: Highlights, challenges, and reflections

### 📅 Time-Based Views
- **Today**: Daily check-in with all tracking categories
- **Week**: Weekly view with habit grid and summary statistics
- **Month**: Monthly calendar view with mood indicators and trends

### 📈 Statistics & Insights
- 14-day trend charts for mood, sleep, fitness, and productivity
- Week-over-week and month-over-month comparisons
- Progress tracking against personal goals
- Streak tracking for consistency

### ⚙️ Customization
- Add/remove custom habits with emoji icons
- Enable/disable tracking categories
- Set personal goals (sleep, water, exercise, steps, focus)
- Light/dark/system theme support
- Week start day preference

### 💾 Data Management
- All data stored locally (localStorage)
- Export data as JSON backup
- Import data from backup
- No account required - your data stays on your device

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Charts**: [Recharts](https://recharts.org/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd daily-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and CSS variables
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main page component
├── components/
│   ├── tracker/         # Tracker-specific components
│   │   ├── DailyCheckIn.tsx    # Main check-in form
│   │   ├── HabitList.tsx       # Habit tracking grid
│   │   ├── MonthlyView.tsx     # Monthly calendar view
│   │   ├── Navigation.tsx      # Bottom navigation
│   │   ├── NumberInput.tsx     # Numeric input with +/- buttons
│   │   ├── QuickStats.tsx      # Dashboard statistics cards
│   │   ├── RatingSelector.tsx  # Emoji rating selector
│   │   ├── SettingsPanel.tsx   # Settings & customization
│   │   ├── StatsCharts.tsx     # Trend charts
│   │   ├── TrackerApp.tsx      # Main app container
│   │   └── WeeklyView.tsx      # Weekly summary view
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── helpers.ts       # Utility functions
│   ├── store.ts         # Zustand store with persistence
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Tailwind merge utility
└── public/
    └── manifest.json    # PWA manifest
```

## Data Model

### Daily Entry
Each day's entry tracks:
- Sleep (hours, quality, times)
- Mood (morning, evening, energy, stress)
- Fitness (exercise, steps, water, eating)
- Productivity (score, focus hours, tasks)
- Habits (customizable boolean checklist)
- Notes (gratitude, highlights, challenges)

### Habits
Customizable habits with:
- Name and emoji icon
- Frequency (daily/weekly/monthly)
- Color coding
- Archive functionality

### Settings
User preferences:
- Name and theme
- Week start day
- Enabled categories
- Daily goals

## Mobile-First Design

The app is designed primarily for mobile use with:
- Touch-friendly controls
- Bottom navigation for easy thumb access
- Collapsible sections to reduce scrolling
- Safe area support for notched phones
- PWA capabilities for home screen installation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Future Enhancements

- [ ] Cloud sync with authentication
- [ ] Reminder notifications
- [ ] Social sharing
- [ ] Data insights with AI
- [ ] Widgets for quick tracking
- [ ] Apple Health / Google Fit integration
