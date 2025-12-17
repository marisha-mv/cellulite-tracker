import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Dumbbell, Trash2 } from 'lucide-react';
import Card from '../shared/Card';
import { WorkoutSession } from '../../types';
import { format } from 'date-fns';

interface WorkoutHistoryProps {
  workouts: WorkoutSession[];
  onDelete: (id: string) => void;
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ workouts, onDelete }) => {
  if (workouts.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Dumbbell size={48} className="mx-auto text-neutral-300 mb-4" />
          <p className="text-neutral-500">No workouts logged yet</p>
          <p className="text-sm text-neutral-400 mt-1">
            Start logging your glute workouts to track your progress
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout, index) => (
        <motion.div
          key={workout.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card hover>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Dumbbell size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-800">
                      Workout #{workout.workoutNumber}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-neutral-500">
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{format(new Date(workout.date), 'MMM dd, yyyy')}</span>
                      </span>
                      {workout.duration && (
                        <span className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{workout.duration} min</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                        Week {workout.weekNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Exercises */}
                <div className="space-y-2">
                  {workout.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center space-x-3 text-sm"
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          exercise.completed
                            ? 'bg-success border-success'
                            : 'border-neutral-300'
                        }`}
                      >
                        {exercise.completed && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-neutral-700">{exercise.exerciseName}</span>
                      <span className="text-neutral-500">
                        {exercise.sets} × {exercise.reps}
                        {exercise.weight && ` @ ${exercise.weight}kg`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {workout.notes && (
                  <div className="mt-3 p-3 bg-neutral-50 rounded-premium">
                    <p className="text-sm text-neutral-600 italic">{workout.notes}</p>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this workout?')) {
                    onDelete(workout.id);
                  }
                }}
                className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default WorkoutHistory;
