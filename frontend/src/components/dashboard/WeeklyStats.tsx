import React from 'react';
import { motion } from 'framer-motion';
import Card from '../shared/Card';
import { CheckSquare, Dumbbell, Camera, TrendingUp } from 'lucide-react';
import { HabitStats, WorkoutStats } from '../../types';

interface WeeklyStatsProps {
  habitStats: HabitStats;
  workoutStats: WorkoutStats;
  progressCount: number;
}

const WeeklyStats: React.FC<WeeklyStatsProps> = ({
  habitStats,
  workoutStats,
  progressCount,
}) => {
  const stats = [
    {
      title: 'Current Streak',
      value: `${habitStats.currentStreak} days`,
      icon: <CheckSquare size={24} />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Daily habit streak',
    },
    {
      title: 'Weekly Workouts',
      value: `${workoutStats.workoutsThisWeek}/${workoutStats.targetPerWeek}`,
      icon: <Dumbbell size={24} />,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'This week',
    },
    {
      title: 'Progress Photos',
      value: progressCount,
      icon: <Camera size={24} />,
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Weeks tracked',
    },
    {
      title: 'Success Rate',
      value: `${habitStats.completionRate}%`,
      icon: <TrendingUp size={24} />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Overall completion',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hover>
            <div className="flex items-start space-x-3">
              <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl font-bold text-neutral-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-neutral-700">
                  {stat.title}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {stat.description}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default WeeklyStats;
