# 🌸 Cellulite Reduction Tracker

A premium wellness web application designed to help women reduce cellulite through consistent tracking of daily habits, workouts, and visual progress.

## ✨ Features

### 📊 Daily Habit Tracking
- Track 17 daily wellness habits organized by time of day
- **Morning routine**: Legs up wall, dry brushing, contrast shower, hydration
- **Daytime**: Hourly movement, 10k steps goal, 2.5L water goal
- **Evening**: Glute exercises, toe pickups, oil massage, magnesium, legs elevated
- **Nutrition**: Collagen, protein, low sugar, avoid seed oils
- Auto-save functionality
- Real-time completion percentage
- Streak tracking with celebration animations

### 💪 Weekly Glute Workouts
- Log 2 complete glute workouts per week
- Track 5 exercises per session (hip thrusts, abductors, Romanian deadlifts, etc.)
- Record sets, reps, and weight for each exercise
- Weekly completion tracking with confetti celebration
- Workout history with detailed logs

### 📸 Weekly Progress Photos
- Upload 3 photos per week (front, back, side views)
- Automatic image optimization and compression
- Side-by-side week comparison
- Fullscreen photo viewer
- Track transformation over time

### 📈 Comprehensive Analytics
- Real-time dashboard with all your stats
- Current streak and longest streak tracking
- Habit completion rate
- Weekly workout progress
- Personalized insights and achievements
- Recent activity timeline

### 🎨 Premium Design
- Elegant spa-like aesthetic with rose gold palette
- Smooth Framer Motion animations throughout
- Confetti celebrations for milestones
- Mobile-responsive with hamburger menu
- Custom scrollbars and focus states
- Glassmorphism effects
- Motivational tips and onboarding flow

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- PostgreSQL database
- Prisma ORM
- JWT authentication
- Multer & Sharp for image handling

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd cellulite-tracker
```

2. Set up the backend
```bash
cd backend
npm install
```

3. Configure environment variables
```bash
# backend/.env
DATABASE_URL="postgresql://localhost:5432/cellulite_tracker?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
NODE_ENV="development"
UPLOAD_DIR="./uploads"
```

4. Set up the database
```bash
# In the backend directory
npx prisma generate
npx prisma migrate dev --name init
```

5. Set up the frontend
```bash
cd ../frontend
npm install
```

6. Configure frontend environment
```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
cellulite-tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, upload, error handling
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── types/           # TypeScript types
│   │   └── server.ts        # Express app setup
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── uploads/             # Uploaded photos
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── contexts/        # React contexts
    │   ├── hooks/           # Custom hooks
    │   ├── services/        # API services
    │   ├── utils/           # Helper functions
    │   └── types/           # TypeScript types
    └── public/              # Static assets
```

## Development Phases

- [x] Phase 1: Foundation Setup ✅
- [x] Phase 2: Authentication System ✅
- [x] Phase 3: Core Layout & Navigation ✅
- [x] Phase 4: Habit Check-In System ✅
- [x] Phase 5: Weekly Glute Workouts ✅
- [x] Phase 6: Weekly Progress Photos ✅
- [x] Phase 7: Dashboard & Analytics ✅
- [x] Phase 8: Polish & Premium Details ✅

**🎉 All phases complete! The application is production-ready.**

---

## 🚀 Usage Tips

### For Best Results:

1. **Daily Consistency**: Log your habits every day, even if you only complete 70%. Consistency beats perfection.

2. **Photo Tips**:
   - Take photos in the same spot with the same lighting
   - Wear the same outfit each week
   - Same time of day (morning is best)
   - Don't stress about perfection

3. **Workout Tracking**:
   - Log immediately after completing your workout
   - Track progressive overload (increasing weight over time)
   - Aim for 2 workouts per week minimum

4. **Water & Steps**:
   - Log water intake throughout the day
   - Add step count in the evening
   - These two metrics are game-changers for lymph drainage

### Expected Timeline:

- **Week 1**: Less puffiness, legs feel lighter
- **Week 2**: Dimples softening, better glute tone
- **Week 3**: Visible smoothing in mirror
- **Week 4**: Clear reduction in cellulite appearance

---

## 🎨 Premium Features

### Celebrations & Gamification:
- 🎊 Confetti when completing all daily habits
- 🎉 Confetti when reaching weekly workout goal
- 🔥 Streak counter that celebrates consistency
- 🏆 Achievement insights based on your progress
- 💡 Daily motivational tips

### Smart UX:
- Auto-save on all forms (1-second debounce)
- Real-time progress indicators
- Color-coded feedback (green = complete, primary = in-progress)
- Loading skeletons instead of spinners
- Toast notifications for all actions
- Keyboard navigation support

### Mobile Optimized:
- Fully responsive design
- Hamburger menu on mobile
- Touch-friendly interface
- Optimized photo uploads
- Works on all screen sizes

---

## 🔐 Security Features

- JWT-based authentication with 7-day expiration
- Password hashing with bcrypt
- Protected API routes
- User data isolation
- Secure file uploads with validation
- CORS configuration
- XSS and injection protection

---

## 📱 Screenshots

The application features:
- Premium rose gold and coral color palette
- Playfair Display serif headings
- Inter sans-serif body text
- Generous spacing and premium shadows
- Smooth animations on all interactions

---

## 🛠️ Customization

### Changing Colors:
Edit `frontend/tailwind.config.js` to customize the color palette.

### Adding More Habits:
Edit `frontend/src/utils/constants.ts` and update the Prisma schema.

### Changing Workout Goals:
Modify the `targetPerWeek` value in workout stats logic.

---

## 📊 Database Schema

The application uses SQLite (development) with the following models:
- **User**: Account information
- **HabitCheckIn**: Daily habit tracking
- **WorkoutSession**: Workout logs
- **WorkoutExercise**: Individual exercises
- **WeeklyProgress**: Progress photos

For production, switch to PostgreSQL by updating `backend/prisma/schema.prisma`.

---

## 🚢 Deployment

### Backend Deployment (Railway/Render):
1. Push code to GitHub
2. Connect to Railway/Render
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify):
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set `VITE_API_URL` to your backend URL
4. Deploy

### Environment Variables for Production:
```bash
# Backend
DATABASE_URL="postgresql://..."  # Use PostgreSQL for production
JWT_SECRET="strong-random-secret"
NODE_ENV="production"
PORT=5000

# Frontend
VITE_API_URL="https://your-backend-url.com/api"
```

---

## 🎯 Roadmap (Future Enhancements)

Potential future features:
- Email notifications for streak milestones
- Export progress reports as PDF
- Social sharing (optional, with privacy controls)
- Coach/trainer collaboration features
- Calendar view for habits and workouts
- Custom habit creation
- Workout templates
- Progress charts and graphs
- Dark mode
- Multi-language support

---

## License

Private project

## Support

For questions or issues, please open an issue in the repository.
