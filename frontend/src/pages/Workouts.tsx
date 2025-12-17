import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import Confetti from '../components/shared/Confetti';
import WorkoutLogger from '../components/workouts/WorkoutLogger';
import WorkoutHistory from '../components/workouts/WorkoutHistory';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Plus, Target, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { WorkoutSession, WorkoutSessionInput, WorkoutStats } from '../types';
import toast from 'react-hot-toast';

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    currentWeek: 1,
    workoutsThisWeek: 0,
    targetPerWeek: 2,
  });
  const [loading, setLoading] = useState(true);
  const [showLogger, setShowLogger] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [workoutsRes, statsRes] = await Promise.all([
        api.get('/workouts'),
        api.get('/workouts/completion'),
      ]);

      setWorkouts(workoutsRes.data.workouts);
      setStats(statsRes.data.completion);
    } catch (error) {
      console.error('Error loading workouts:', error);
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkout = async (workout: WorkoutSessionInput) => {
    try {
      const previousWorkoutsThisWeek = stats.workoutsThisWeek;

      await api.post('/workouts', workout);
      toast.success('Workout logged successfully! 💪');
      setShowLogger(false);
      await loadData();

      // Trigger confetti if weekly goal just reached
      if (previousWorkoutsThisWeek < 2 && previousWorkoutsThisWeek + 1 >= 2) {
        setShowConfetti(true);
        toast.success('Weekly workout goal achieved! 🎉', { duration: 4000 });
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      toast.error('Failed to save workout');
      throw error;
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await api.delete(`/workouts/${id}`);
      toast.success('Workout deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete workout');
    }
  };

  const completionPercentage = Math.round(
    (stats.workoutsThisWeek / stats.targetPerWeek) * 100
  );

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto">
          <Card className="flex justify-center py-12">
            <LoadingSpinner text="Loading your workouts..." />
          </Card>
        </div>
      </Layout>
    );
  }

  if (showLogger) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <WorkoutLogger
            onSave={handleSaveWorkout}
            onCancel={() => setShowLogger(false)}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Confetti trigger={showConfetti} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif text-neutral-800 mb-2">
              Glute Workouts
            </h1>
            <p className="text-neutral-500">
              Log your weekly glute workout sessions
            </p>
          </div>
          <Button onClick={() => setShowLogger(true)}>
            <Plus size={18} className="mr-2" />
            Log Workout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card hover={false} className="bg-gradient-to-br from-accent-light to-accent">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Target size={24} className="text-accent" />
              </div>
              <div className="text-white">
                <div className="text-2xl font-bold">
                  {stats.workoutsThisWeek}/{stats.targetPerWeek}
                </div>
                <div className="text-sm opacity-90">This Week</div>
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <TrendingUp size={24} className="text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-800">
                  {stats.totalWorkouts}
                </div>
                <div className="text-sm text-neutral-500">Total Workouts</div>
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div>
              <div className="flex items-baseline space-x-2 mb-2">
                <div className="text-2xl font-bold text-neutral-800">
                  {completionPercentage}%
                </div>
                <div className="text-sm text-neutral-500">Weekly Goal</div>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    completionPercentage >= 100 ? 'bg-success' : 'bg-accent'
                  }`}
                  style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Goal Message */}
        {stats.workoutsThisWeek < stats.targetPerWeek && (
          <Card className="mb-8 bg-gradient-to-br from-primary-light to-accent-light border-0">
            <div className="flex items-center space-x-4 text-white">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Target size={24} className="text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-serif mb-1">
                  {stats.targetPerWeek - stats.workoutsThisWeek} workout
                  {stats.targetPerWeek - stats.workoutsThisWeek > 1 ? 's' : ''} remaining
                </h3>
                <p className="text-sm opacity-90">
                  Complete {stats.targetPerWeek} glute workouts per week for best results
                </p>
              </div>
            </div>
          </Card>
        )}

        {stats.workoutsThisWeek >= stats.targetPerWeek && (
          <Card className="mb-8 bg-gradient-to-br from-success to-success/80 border-0">
            <div className="flex items-center space-x-4 text-white">
              <div className="text-4xl">🎉</div>
              <div className="flex-1">
                <h3 className="text-lg font-serif mb-1">Weekly Goal Achieved!</h3>
                <p className="text-sm opacity-90">
                  Great job! You've completed your {stats.targetPerWeek} workouts this week.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Workout History */}
        <div className="mb-4">
          <h2 className="text-2xl font-serif text-neutral-800 mb-4">Workout History</h2>
        </div>
        <WorkoutHistory workouts={workouts} onDelete={handleDeleteWorkout} />
      </div>
    </Layout>
  );
};

export default Workouts;
