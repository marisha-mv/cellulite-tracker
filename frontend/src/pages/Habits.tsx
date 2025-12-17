import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Layout from '../components/layout/Layout';
import Card from '../components/shared/Card';
import HabitCheckIn from '../components/habits/HabitCheckIn';
import StreakDisplay from '../components/habits/StreakDisplay';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import api from '../services/api';
import { HabitStats } from '../types';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { formatDate } from '../utils/helpers';

const Habits: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState<HabitStats>({
    totalDays: 0,
    completedDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/habits/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isFuture = selectedDate > new Date();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-neutral-800 mb-2">
            Daily Habits
          </h1>
          <p className="text-neutral-500">
            Track your daily wellness habits and build consistency
          </p>
        </div>

        {/* Stats */}
        {loading ? (
          <Card className="flex justify-center py-12">
            <LoadingSpinner text="Loading your stats..." />
          </Card>
        ) : (
          <div className="mb-8">
            <StreakDisplay
              currentStreak={stats.currentStreak}
              longestStreak={stats.longestStreak}
              totalDays={stats.totalDays}
              completionRate={stats.completionRate}
            />
          </div>
        )}

        {/* Date Selector */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousDay}
              className="p-2 hover:bg-neutral-100 rounded-premium transition-colors"
            >
              <ChevronLeft size={20} className="text-neutral-600" />
            </button>

            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-primary" />
              <div className="text-center">
                <div className="text-xl font-serif text-neutral-800">
                  {formatDate(selectedDate)}
                </div>
                {isToday && (
                  <div className="text-xs text-primary font-medium">Today</div>
                )}
              </div>
            </div>

            <button
              onClick={handleNextDay}
              disabled={isFuture}
              className={`p-2 rounded-premium transition-colors ${
                isFuture
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-neutral-100'
              }`}
            >
              <ChevronRight size={20} className="text-neutral-600" />
            </button>
          </div>

          {!isToday && (
            <div className="mt-4 text-center">
              <button
                onClick={handleToday}
                className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Back to Today
              </button>
            </div>
          )}
        </Card>

        {/* Habit Check-In */}
        <HabitCheckIn date={selectedDate} onSave={loadStats} />
      </div>
    </Layout>
  );
};

export default Habits;
