import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';

interface Exercise {
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  completed: boolean;
}

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onChange: (exercise: Exercise) => void;
  onDelete?: () => void;
  readOnly?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  onChange,
  onDelete,
  readOnly = false,
}) => {
  const handleChange = (field: keyof Exercise, value: any) => {
    onChange({
      ...exercise,
      [field]: value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-premium border-2 transition-all duration-200 ${
        exercise.completed
          ? 'border-success bg-success/5'
          : 'border-neutral-200 bg-white'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Exercise Number */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-medium">
          {index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Exercise Name */}
          <input
            type="text"
            value={exercise.exerciseName}
            onChange={(e) => handleChange('exerciseName', e.target.value)}
            placeholder="Exercise name (e.g., Hip Thrusts)"
            className="w-full px-3 py-2 border border-neutral-200 rounded-premium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-medium"
            disabled={readOnly}
          />

          {/* Sets, Reps, Weight */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Sets</label>
              <input
                type="number"
                value={exercise.sets || ''}
                onChange={(e) => handleChange('sets', parseInt(e.target.value) || 0)}
                placeholder="3"
                className="w-full px-3 py-2 border border-neutral-200 rounded-premium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                min="1"
                disabled={readOnly}
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-500 mb-1">Reps</label>
              <input
                type="number"
                value={exercise.reps || ''}
                onChange={(e) => handleChange('reps', parseInt(e.target.value) || 0)}
                placeholder="12"
                className="w-full px-3 py-2 border border-neutral-200 rounded-premium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                min="1"
                disabled={readOnly}
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-500 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={exercise.weight || ''}
                onChange={(e) => handleChange('weight', parseFloat(e.target.value) || undefined)}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-neutral-200 rounded-premium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                step="0.5"
                min="0"
                disabled={readOnly}
              />
            </div>
          </div>

          {/* Completed Checkbox */}
          {!readOnly && (
            <button
              onClick={() => handleChange('completed', !exercise.completed)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-premium transition-all ${
                exercise.completed
                  ? 'bg-success text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Check size={16} />
              <span className="text-sm font-medium">
                {exercise.completed ? 'Completed' : 'Mark as Complete'}
              </span>
            </button>
          )}
        </div>

        {/* Delete Button */}
        {!readOnly && onDelete && (
          <button
            onClick={onDelete}
            className="flex-shrink-0 p-2 text-neutral-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ExerciseCard;
