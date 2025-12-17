import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Habit } from '../../utils/constants';

interface HabitCardProps {
  habit: Habit;
  checked: boolean;
  value?: number;
  onChange: (checked: boolean, value?: number) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  checked,
  value,
  onChange,
}) => {
  const handleCheckboxChange = () => {
    onChange(!checked, value);
  };

  const handleValueChange = (newValue: number) => {
    onChange(checked, newValue);
  };

  const isComplete = habit.trackable
    ? value !== undefined && habit.goal && value >= habit.goal
    : checked;

  const progress = habit.trackable && value !== undefined && habit.goal
    ? Math.min((value / habit.goal) * 100, 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-premium border-2 transition-all duration-200 ${
        isComplete
          ? 'border-success bg-success/5'
          : 'border-neutral-200 hover:border-primary/30 bg-white'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        {!habit.trackable && (
          <button
            onClick={handleCheckboxChange}
            className={`flex-shrink-0 w-6 h-6 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
              checked
                ? 'bg-success border-success'
                : 'border-neutral-300 hover:border-primary'
            }`}
          >
            {checked && <Check size={16} className="text-white" />}
          </button>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className={`font-medium ${checked || isComplete ? 'text-neutral-800' : 'text-neutral-700'}`}>
              {habit.name}
            </h4>
          </div>

          <p className="text-sm text-neutral-500 mb-2">{habit.description}</p>

          {/* Trackable Input */}
          {habit.trackable && (
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={value || ''}
                  onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
                  placeholder={`Enter ${habit.key === 'stepsCount' ? 'steps' : 'liters'}`}
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  step={habit.key === 'stepsCount' ? '100' : '0.1'}
                  min="0"
                />
                <span className="text-sm text-neutral-500 whitespace-nowrap">
                  / {habit.goal} {habit.key === 'stepsCount' ? 'steps' : 'L'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full ${
                    progress >= 100 ? 'bg-success' : 'bg-primary'
                  }`}
                />
              </div>

              <div className="flex justify-between text-xs text-neutral-500">
                <span>{progress.toFixed(0)}% complete</span>
                {progress >= 100 && (
                  <span className="text-success font-medium">Goal reached! 🎉</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HabitCard;
