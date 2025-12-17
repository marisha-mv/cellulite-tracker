import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Dumbbell,
  Camera,
  User,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import { HabitStats, WorkoutStats } from '../../types';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

const Sidebar: React.FC = () => {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [habitsRes, workoutsRes] = await Promise.all([
        api.get('/habits/stats'),
        api.get('/workouts/completion'),
      ]);

      setHabitStats(habitsRes.data.stats);
      setWorkoutStats(workoutsRes.data.completion);
    } catch (error) {
      console.error('Error loading sidebar stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Daily Habits',
      path: '/habits',
      icon: <CheckSquare size={20} />,
      badge: 'New',
    },
    {
      name: 'Workouts',
      path: '/workouts',
      icon: <Dumbbell size={20} />,
    },
    {
      name: 'Progress Photos',
      path: '/progress',
      icon: <Camera size={20} />,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-100 min-h-screen sticky top-0 left-0">
      <div className="p-6">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-premium-lg bg-gradient-to-br from-primary-light to-accent-light relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full" />
          <div className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles size={16} className="text-white" />
              <span className="text-white text-sm font-medium">Premium</span>
            </div>
            <p className="text-white text-xs opacity-90">
              Track your wellness journey
            </p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-premium transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary text-white shadow-premium'
                      : 'text-neutral-600 hover:bg-secondary hover:text-primary'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span className="font-medium text-sm flex-1">{item.name}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-success text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 rounded-premium-lg bg-secondary border border-neutral-100"
        >
          <h3 className="text-sm font-medium text-neutral-700 mb-3">
            Quick Stats
          </h3>
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">Current Streak</span>
                <span className="text-sm font-bold text-accent">
                  {habitStats.currentStreak} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">Success Rate</span>
                <span className="text-sm font-bold text-primary">
                  {habitStats.completionRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">Workouts</span>
                <span className={`text-sm font-bold ${
                  workoutStats.workoutsThisWeek >= workoutStats.targetPerWeek
                    ? 'text-success'
                    : 'text-accent'
                }`}>
                  {workoutStats.workoutsThisWeek}/{workoutStats.targetPerWeek}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </aside>
  );
};

export default Sidebar;
