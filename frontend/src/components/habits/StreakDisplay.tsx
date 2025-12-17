import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Award, TrendingUp } from 'lucide-react';
import Card from '../shared/Card';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  completionRate: number;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
  totalDays,
  completionRate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Current Streak */}
      <Card padding="md" hover={false} className="bg-gradient-to-br from-primary-light to-primary">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Flame size={24} className="text-primary" />
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>
        </div>
      </Card>

      {/* Longest Streak */}
      <Card padding="md" hover={false} className="bg-gradient-to-br from-accent-light to-accent">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Award size={24} className="text-accent" />
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold">{longestStreak}</div>
            <div className="text-sm opacity-90">Best Streak</div>
          </div>
        </div>
      </Card>

      {/* Total Days */}
      <Card padding="md" hover={false}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
            <TrendingUp size={24} className="text-success" />
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-800">{totalDays}</div>
            <div className="text-sm text-neutral-500">Total Days</div>
          </div>
        </div>
      </Card>

      {/* Completion Rate */}
      <Card padding="md" hover={false}>
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex items-baseline space-x-2 mb-1">
              <div className="text-2xl font-bold text-neutral-800">{completionRate}%</div>
              <div className="text-sm text-neutral-500">Success Rate</div>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-success"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StreakDisplay;
