import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, X } from 'lucide-react';
import ExerciseCard from './ExerciseCard';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { WorkoutSessionInput } from '../../types';
import toast from 'react-hot-toast';

interface WorkoutLoggerProps {
  onSave: (workout: WorkoutSessionInput) => Promise<void>;
  onCancel: () => void;
  initialData?: WorkoutSessionInput;
}

const DEFAULT_EXERCISES = [
  'Hip Thrusts',
  'Abductors',
  'Romanian Deadlifts',
  'Bulgarian Split Squats',
  'Glute Kickbacks',
];

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [workout, setWorkout] = useState<WorkoutSessionInput>(
    initialData || {
      date: new Date(),
      weekNumber: Math.ceil(
        (new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) /
          (1000 * 60 * 60 * 24 * 7)
      ),
      workoutNumber: 1,
      exercises: DEFAULT_EXERCISES.map((name) => ({
        exerciseName: name,
        sets: 3,
        reps: 12,
        weight: undefined,
        completed: false,
      })),
      completed: false,
    }
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleExerciseChange = (index: number, exercise: any) => {
    const newExercises = [...workout.exercises];
    newExercises[index] = exercise;
    setWorkout({ ...workout, exercises: newExercises });
  };

  const handleAddExercise = () => {
    if (workout.exercises.length >= 10) {
      toast.error('Maximum 10 exercises per workout');
      return;
    }

    setWorkout({
      ...workout,
      exercises: [
        ...workout.exercises,
        {
          exerciseName: '',
          sets: 3,
          reps: 12,
          weight: undefined,
          completed: false,
        },
      ],
    });
  };

  const handleDeleteExercise = (index: number) => {
    if (workout.exercises.length <= 1) {
      toast.error('At least one exercise is required');
      return;
    }

    const newExercises = workout.exercises.filter((_, i) => i !== index);
    setWorkout({ ...workout, exercises: newExercises });
  };

  const handleSave = async () => {
    // Validate
    if (workout.exercises.some((ex) => !ex.exerciseName.trim())) {
      toast.error('Please fill in all exercise names');
      return;
    }

    if (workout.exercises.some((ex) => ex.sets <= 0 || ex.reps <= 0)) {
      toast.error('Sets and reps must be greater than 0');
      return;
    }

    // Ensure completed is always a boolean
    const workoutToSave = {
      ...workout,
      exercises: workout.exercises.map((ex) => ({
        ...ex,
        completed: ex.completed ?? false,
      })),
    };

    setIsSaving(true);
    try {
      await onSave(workoutToSave);
    } finally {
      setIsSaving(false);
    }
  };

  const completedExercises = workout.exercises.filter((ex) => ex.completed).length;
  const totalExercises = workout.exercises.length;
  const completionPercentage = Math.round((completedExercises / totalExercises) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-serif text-neutral-800">
              Log Workout #{workout.workoutNumber}
            </h3>
            <p className="text-sm text-neutral-500">Week {workout.weekNumber}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-accent">{completionPercentage}%</div>
            <div className="text-xs text-neutral-500">
              {completedExercises}/{totalExercises} exercises
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-accent"
          />
        </div>
      </Card>

      {/* Exercises */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif text-neutral-800">Exercises</h3>
          <button
            onClick={handleAddExercise}
            className="flex items-center space-x-2 text-accent hover:text-accent-dark transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Add Exercise</span>
          </button>
        </div>

        <div className="space-y-3">
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard
              key={index}
              exercise={exercise}
              index={index}
              onChange={(ex) => handleExerciseChange(index, ex)}
              onDelete={() => handleDeleteExercise(index)}
            />
          ))}
        </div>
      </Card>

      {/* Workout Details */}
      <Card>
        <h3 className="text-lg font-serif text-neutral-800 mb-4">Workout Details</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={workout.duration || ''}
              onChange={(e) =>
                setWorkout({ ...workout, duration: parseInt(e.target.value) || undefined })
              }
              placeholder="e.g., 45"
              className="input-field"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={workout.notes || ''}
              onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
              placeholder="How did the workout feel? Any observations..."
              className="w-full px-4 py-3 border border-neutral-200 rounded-premium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
          <X size={18} className="mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSave} loading={isSaving}>
          <Save size={18} className="mr-2" />
          Save Workout
        </Button>
      </div>
    </div>
  );
};

export default WorkoutLogger;
