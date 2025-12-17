import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Onboarding from '../components/shared/Onboarding';
import MotivationalTip from '../components/shared/MotivationalTip';
import WeeklyStats from '../components/dashboard/WeeklyStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import ProgressOverview from '../components/dashboard/ProgressOverview';
import {
  CheckSquare,
  Dumbbell,
  Camera,
  Flame,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import { HabitStats, WorkoutStats, HabitCheckIn, WorkoutSession, WeeklyProgress } from '../types';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [habitStats, setHabitStats] = useState<HabitStats>({
    totalDays: 0,
    completedDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
  });
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    currentWeek: 1,
    workoutsThisWeek: 0,
    targetPerWeek: 2,
  });
  const [progressCount, setProgressCount] = useState(0);
  const [recentHabits, setRecentHabits] = useState<HabitCheckIn[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSession[]>([]);
  const [recentProgress, setRecentProgress] = useState<WeeklyProgress[]>([]);
  const [todayHabitCompletion, setTodayHabitCompletion] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    loadDashboardData();

    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      const [habitsRes, workoutsRes, progressRes] = await Promise.all([
        api.get('/habits/stats'),
        api.get('/workouts/completion'),
        api.get('/progress'),
      ]);

      setHabitStats(habitsRes.data.stats);
      setWorkoutStats(workoutsRes.data.completion);
      setProgressCount(progressRes.data.progress.length);

      // Load recent activity
      const [recentHabitsRes, recentWorkoutsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/workouts'),
      ]);

      setRecentHabits(recentHabitsRes.data.habitCheckIns.slice(0, 5));
      setRecentWorkouts(recentWorkoutsRes.data.workouts.slice(0, 5));
      setRecentProgress(progressRes.data.progress.slice(0, 3));

      // Get today's habit completion
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const todayHabitsRes = await api.get(`/habits/${today}`);
        const todayData = todayHabitsRes.data.habitCheckIn;

        // Calculate completion
        let completed = 0;
        const booleanHabits = [
          'legsUpWall', 'dryBrushing', 'contrastShower', 'morningHydration',
          'hourlyMovement', 'gluteExercises', 'toePickups', 'oilMassage',
          'magnesiumApp', 'legsElevated', 'collagenIntake', 'proteinMeals',
          'lowSugar', 'avoidSeedOils'
        ];

        booleanHabits.forEach((habit) => {
          if (todayData[habit]) completed++;
        });

        if (todayData.stepsCount && todayData.stepsCount >= 10000) completed++;
        if (todayData.dailyHydration && todayData.dailyHydration >= 2.5) completed++;

        setTodayHabitCompletion(Math.round((completed / 17) * 100));
      } catch (error) {
        // Today's habits not logged yet
        setTodayHabitCompletion(0);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <Card className="flex justify-center py-12">
            <LoadingSpinner text="Loading your dashboard..." />
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Onboarding isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />

      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-neutral-800 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-neutral-500">
            Here's your wellness journey overview
          </p>
        </div>

        {/* Motivational Tip */}
        <div className="mb-6">
          <MotivationalTip />
        </div>

        {/* Weekly Stats */}
        <div className="mb-8">
          <WeeklyStats
            habitStats={habitStats}
            workoutStats={workoutStats}
            progressCount={progressCount}
          />
        </div>

        {/* Today's Progress */}
        <div className="mb-8">
          <Link to="/habits">
            <Card className="cursor-pointer bg-gradient-to-br from-primary-light to-accent-light border-0 hover:shadow-premium-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <CheckSquare size={28} className="text-primary" />
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-serif mb-1">Today's Progress</h3>
                    <p className="text-sm opacity-90">
                      {todayHabitCompletion === 0
                        ? "Haven't started today's habits yet"
                        : todayHabitCompletion === 100
                        ? 'All habits completed! Amazing work! 🎉'
                        : `${todayHabitCompletion}% complete - Keep going!`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-4xl font-bold text-white">
                      {todayHabitCompletion}%
                    </div>
                  </div>
                  <ArrowRight size={24} className="text-white opacity-70" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-neutral-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/habits">
              <Card className="cursor-pointer h-full hover:shadow-premium-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-premium bg-primary/10 flex items-center justify-center">
                    <CheckSquare size={24} className="text-primary" />
                  </div>
                  <h3 className="font-medium text-neutral-800 text-lg">
                    Log Daily Habits
                  </h3>
                </div>
                <p className="text-sm text-neutral-500">
                  Track your 17 daily wellness habits
                </p>
              </Card>
            </Link>

            <Link to="/workouts">
              <Card className="cursor-pointer h-full hover:shadow-premium-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-premium bg-accent/10 flex items-center justify-center">
                    <Dumbbell size={24} className="text-accent" />
                  </div>
                  <h3 className="font-medium text-neutral-800 text-lg">
                    Log Workout
                  </h3>
                </div>
                <p className="text-sm text-neutral-500">
                  Record your glute training session
                </p>
              </Card>
            </Link>

            <Link to="/progress">
              <Card className="cursor-pointer h-full hover:shadow-premium-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-premium bg-success/10 flex items-center justify-center">
                    <Camera size={24} className="text-success" />
                  </div>
                  <h3 className="font-medium text-neutral-800 text-lg">
                    Upload Photos
                  </h3>
                </div>
                <p className="text-sm text-neutral-500">
                  Add this week's progress photos
                </p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Overview - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ProgressOverview
              habitStats={habitStats}
              workoutStats={workoutStats}
              progressCount={progressCount}
            />
          </div>

          {/* Recent Activity - Takes 1 column */}
          <div>
            <RecentActivity
              recentHabits={recentHabits}
              recentWorkouts={recentWorkouts}
              recentProgress={recentProgress}
            />
          </div>
        </div>

        {/* Motivation Banner */}
        {habitStats.currentStreak === 0 && habitStats.totalDays === 0 && (
          <Card className="bg-gradient-to-br from-primary to-accent-dark border-0">
            <div className="flex items-center space-x-4 text-white">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Flame size={32} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-serif mb-2">
                  Ready to Start Your Transformation?
                </h3>
                <p className="text-sm opacity-90 mb-4">
                  Begin tracking your daily habits, workouts, and progress photos today. Consistency over 4 weeks will show incredible results!
                </p>
                <Link to="/habits">
                  <Button variant="secondary">Start Today</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
