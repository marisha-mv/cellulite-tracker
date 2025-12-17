import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sun, Moon, UtensilsCrossed, Save, CheckCircle } from 'lucide-react';
import HabitCard from './HabitCard';
import Card from '../shared/Card';
import Confetti from '../shared/Confetti';
import { HABITS_BY_CATEGORY, HABIT_CATEGORIES } from '../../utils/constants';
import { HabitCheckIn as HabitCheckInType } from '../../types';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { calculateCompletionPercentage } from '../../utils/helpers';

interface HabitCheckInProps {
  date: Date;
  onSave?: () => void;
}

const HabitCheckIn: React.FC<HabitCheckInProps> = ({ date, onSave }) => {
  const [checkIn, setCheckIn] = useState<Partial<HabitCheckInType>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load existing check-in data
  useEffect(() => {
    loadCheckIn();
  }, [date]);

  const loadCheckIn = async () => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await api.get(`/habits/${dateStr}`);
      setCheckIn(response.data.habitCheckIn);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Error loading check-in:', error);
      }
      // Initialize empty check-in for new day
      setCheckIn({});
    }
  };

  const saveCheckIn = useCallback(async (data: Partial<HabitCheckInType>) => {
    try {
      setIsSaving(true);
      await api.post('/habits', {
        date: date.toISOString(),
        ...data,
      });
      setLastSaved(new Date());
      if (onSave) onSave();
    } catch (error) {
      toast.error('Failed to save habits');
      console.error('Error saving check-in:', error);
    } finally {
      setIsSaving(false);
    }
  }, [date, onSave]);

  const handleHabitChange = (habitKey: string, checked: boolean, value?: number) => {
    const updatedCheckIn = {
      ...checkIn,
      [habitKey]: habitKey === 'stepsCount' || habitKey === 'dailyHydration' ? value : checked,
    };

    setCheckIn(updatedCheckIn);

    // Check if 100% completed and trigger confetti
    const newCompletion = calculateCompletionPercentage(updatedCheckIn as HabitCheckInType);
    if (newCompletion === 100 && completion < 100) {
      setShowConfetti(true);
      toast.success('All habits completed! Amazing work! 🎉', { duration: 4000 });
      setTimeout(() => setShowConfetti(false), 3000);
    }

    // Auto-save with debounce
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(() => {
      saveCheckIn(updatedCheckIn);
    }, 1000); // Save after 1 second of inactivity

    setSaveTimeout(timeout);
  };

  const completion = calculateCompletionPercentage(checkIn as HabitCheckInType);

  const categoryIcons: Record<string, JSX.Element> = {
    [HABIT_CATEGORIES.MORNING]: <Sunrise size={20} />,
    [HABIT_CATEGORIES.DAYTIME]: <Sun size={20} />,
    [HABIT_CATEGORIES.EVENING]: <Moon size={20} />,
    [HABIT_CATEGORIES.NUTRITION]: <UtensilsCrossed size={20} />,
  };

  const categoryTitles: Record<string, string> = {
    [HABIT_CATEGORIES.MORNING]: 'Morning Routine',
    [HABIT_CATEGORIES.DAYTIME]: 'Throughout the Day',
    [HABIT_CATEGORIES.EVENING]: 'Evening Routine',
    [HABIT_CATEGORIES.NUTRITION]: 'Nutrition',
  };

  const categoryColors: Record<string, string> = {
    [HABIT_CATEGORIES.MORNING]: 'text-primary',
    [HABIT_CATEGORIES.DAYTIME]: 'text-accent',
    [HABIT_CATEGORIES.EVENING]: 'text-primary-dark',
    [HABIT_CATEGORIES.NUTRITION]: 'text-success',
  };

  return (
    <div className="space-y-6">
      <Confetti trigger={showConfetti} />

      {/* Completion Progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-serif text-neutral-800">Today's Progress</h3>
            <p className="text-sm text-neutral-500">Complete at least 70% for a streak day</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">{completion}%</div>
            <div className="text-xs text-neutral-500 mt-1">
              {isSaving ? (
                <span className="flex items-center space-x-1 text-primary">
                  <Save size={12} className="animate-pulse" />
                  <span>Saving...</span>
                </span>
              ) : lastSaved ? (
                <span className="flex items-center space-x-1 text-success">
                  <CheckCircle size={12} />
                  <span>Saved</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full ${
              completion >= 70 ? 'bg-success' : 'bg-primary'
            }`}
          />
        </div>
      </Card>

      {/* Habit Categories */}
      {Object.entries(HABITS_BY_CATEGORY).map(([category, habits]) => (
        <Card key={category}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`${categoryColors[category]}`}>
              {categoryIcons[category]}
            </div>
            <h3 className="text-xl font-serif text-neutral-800">
              {categoryTitles[category]}
            </h3>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.key}
                habit={habit}
                checked={!!checkIn[habit.key as keyof HabitCheckInType]}
                value={
                  habit.trackable
                    ? (checkIn[habit.key as keyof HabitCheckInType] as number | undefined)
                    : undefined
                }
                onChange={(checked, value) => handleHabitChange(habit.key, checked, value)}
              />
            ))}
          </div>
        </Card>
      ))}

      {/* Notes Section */}
      <Card>
        <h3 className="text-lg font-serif text-neutral-800 mb-3">Notes (Optional)</h3>
        <textarea
          value={checkIn.notes || ''}
          onChange={(e) => {
            const updatedCheckIn = { ...checkIn, notes: e.target.value };
            setCheckIn(updatedCheckIn);

            if (saveTimeout) clearTimeout(saveTimeout);
            const timeout = setTimeout(() => {
              saveCheckIn(updatedCheckIn);
            }, 1500);
            setSaveTimeout(timeout);
          }}
          placeholder="Add any notes about your day..."
          className="w-full px-4 py-3 border border-neutral-200 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          rows={3}
        />
      </Card>
    </div>
  );
};

export default HabitCheckIn;
