import React from 'react';
import { motion } from 'framer-motion';
import Card from '../shared/Card';
import { CheckSquare, Dumbbell, Camera, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { HabitCheckIn, WorkoutSession, WeeklyProgress } from '../../types';

interface RecentActivityProps {
  recentHabits: HabitCheckIn[];
  recentWorkouts: WorkoutSession[];
  recentProgress: WeeklyProgress[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  recentHabits,
  recentWorkouts,
  recentProgress,
}) => {
  // Combine and sort activities
  const activities = [
    ...recentHabits.slice(0, 3).map((habit) => ({
      type: 'habit' as const,
      date: new Date(habit.date),
      data: habit,
    })),
    ...recentWorkouts.slice(0, 3).map((workout) => ({
      type: 'workout' as const,
      date: new Date(workout.date),
      data: workout,
    })),
    ...recentProgress.slice(0, 2).map((progress) => ({
      type: 'progress' as const,
      date: new Date(progress.createdAt),
      data: progress,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'habit':
        return <CheckSquare size={20} className="text-primary" />;
      case 'workout':
        return <Dumbbell size={20} className="text-accent" />;
      case 'progress':
        return <Camera size={20} className="text-success" />;
      default:
        return <Calendar size={20} className="text-neutral-400" />;
    }
  };

  const getActivityDescription = (activity: any) => {
    switch (activity.type) {
      case 'habit':
        const completedCount = Object.values(activity.data).filter(
          (v) => typeof v === 'boolean' && v === true
        ).length;
        return `Completed ${completedCount} daily habits`;
      case 'workout':
        return `Logged Workout #${activity.data.workoutNumber} - ${activity.data.exercises.length} exercises`;
      case 'progress':
        return `Uploaded Week ${activity.data.weekNumber} progress photos`;
      default:
        return 'Activity';
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-serif text-neutral-800 mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <Calendar size={40} className="mx-auto text-neutral-300 mb-3" />
          <p className="text-neutral-500 text-sm">
            No recent activity yet. Start logging your habits, workouts, or progress photos!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-serif text-neutral-800 mb-4">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities.slice(0, 5).map((activity, index) => (
          <motion.div
            key={`${activity.type}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start space-x-3 p-3 rounded-premium hover:bg-neutral-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-700 font-medium">
                {getActivityDescription(activity)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {formatDistanceToNow(activity.date, { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
