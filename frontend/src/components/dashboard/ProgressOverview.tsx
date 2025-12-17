import React from 'react';
import { motion } from 'framer-motion';
import Card from '../shared/Card';
import { TrendingUp, Award, Target, Sparkles } from 'lucide-react';
import { HabitStats, WorkoutStats } from '../../types';

interface ProgressOverviewProps {
  habitStats: HabitStats;
  workoutStats: WorkoutStats;
  progressCount: number;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  habitStats,
  workoutStats,
  progressCount,
}) => {
  // Calculate overall progress
  const totalDaysActive = habitStats.totalDays;
  const currentStreak = habitStats.currentStreak;
  const workoutsCompleted = workoutStats.totalWorkouts;
  const weeksTracked = progressCount;

  // Generate insights
  const insights = [];

  if (currentStreak >= 7) {
    insights.push({
      icon: <Award size={20} className="text-success" />,
      title: 'Consistency Champion',
      description: `Amazing! You've maintained a ${currentStreak}-day streak. Consistency is key to results!`,
      color: 'from-success/20 to-success/10',
    });
  } else if (currentStreak >= 3) {
    insights.push({
      icon: <TrendingUp size={20} className="text-primary" />,
      title: 'Building Momentum',
      description: `Great start! ${currentStreak} days in a row. Keep it going to build lasting habits.`,
      color: 'from-primary/20 to-primary/10',
    });
  }

  if (workoutStats.workoutsThisWeek >= workoutStats.targetPerWeek) {
    insights.push({
      icon: <Target size={20} className="text-accent" />,
      title: 'Weekly Goal Achieved',
      description: `You've completed ${workoutStats.workoutsThisWeek}/${workoutStats.targetPerWeek} workouts this week. Your dedication shows!`,
      color: 'from-accent/20 to-accent/10',
    });
  }

  if (habitStats.completionRate >= 80) {
    insights.push({
      icon: <Sparkles size={20} className="text-primary" />,
      title: 'Excellence in Progress',
      description: `${habitStats.completionRate}% completion rate! You're absolutely crushing it.`,
      color: 'from-primary/20 to-primary/10',
    });
  }

  if (weeksTracked >= 4) {
    insights.push({
      icon: <TrendingUp size={20} className="text-success" />,
      title: '4-Week Milestone',
      description: `You've tracked ${weeksTracked} weeks of progress photos. Time to see the transformation!`,
      color: 'from-success/20 to-success/10',
    });
  }

  // Default insight if no specific achievements
  if (insights.length === 0) {
    insights.push({
      icon: <Sparkles size={20} className="text-primary" />,
      title: 'Starting Your Journey',
      description: 'Welcome! Track your daily habits, workouts, and progress photos consistently for best results.',
      color: 'from-primary/20 to-primary/10',
    });
  }

  // Quick stats
  const quickStats = [
    { label: 'Days Active', value: totalDaysActive },
    { label: 'Total Workouts', value: workoutsCompleted },
    { label: 'Best Streak', value: `${habitStats.longestStreak} days` },
    { label: 'Weeks Tracked', value: weeksTracked },
  ];

  return (
    <div className="space-y-6">
      {/* Insights */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-gradient-to-br ${insight.color} border-0`}>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-800 mb-1">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-neutral-600">{insight.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Grid */}
      <Card>
        <h3 className="text-lg font-serif text-neutral-800 mb-4">
          Your Journey So Far
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="text-center p-4 rounded-premium bg-neutral-50"
            >
              <div className="text-2xl font-bold text-neutral-800 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-neutral-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProgressOverview;
