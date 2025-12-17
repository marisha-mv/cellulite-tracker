import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ProgressPhotoUploader from '../components/dashboard/ProgressPhotoUploader';
import PhotoComparison from '../components/dashboard/PhotoComparison';
import { Plus, TrendingUp, Calendar } from 'lucide-react';
import api from '../services/api';
import { WeeklyProgress } from '../types';
import toast from 'react-hot-toast';

const Progress: React.FC = () => {
  const [progress, setProgress] = useState<WeeklyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await api.get('/progress');
      setProgress(response.data.progress);
    } catch (error) {
      console.error('Error loading progress:', error);
      toast.error('Failed to load progress photos');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  };

  const handleUpload = async (
    photos: { front: File; back: File; side: File },
    weekNumber: number,
    notes?: string
  ) => {
    try {
      const formData = new FormData();
      formData.append('frontPhoto', photos.front);
      formData.append('backPhoto', photos.back);
      formData.append('sidePhoto', photos.side);
      formData.append('weekNumber', weekNumber.toString());

      // Calculate week start and end dates
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const weekStart = new Date(startOfYear);
      weekStart.setDate(startOfYear.getDate() + (weekNumber - 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      formData.append('startDate', weekStart.toISOString());
      formData.append('endDate', weekEnd.toISOString());

      if (notes) {
        formData.append('notes', notes);
      }

      await api.post('/progress', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Progress photos uploaded successfully! 📸');
      setShowUploader(false);
      loadProgress();
    } catch (error) {
      toast.error('Failed to upload photos');
      throw error;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto">
          <Card className="flex justify-center py-12">
            <LoadingSpinner text="Loading your progress..." />
          </Card>
        </div>
      </Layout>
    );
  }

  if (showUploader) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <ProgressPhotoUploader
            onUpload={handleUpload}
            onCancel={() => setShowUploader(false)}
            currentWeek={getCurrentWeek()}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif text-neutral-800 mb-2">
              Progress Photos
            </h1>
            <p className="text-neutral-500">
              Track your visual progress with weekly photos
            </p>
          </div>
          <Button onClick={() => setShowUploader(true)}>
            <Plus size={18} className="mr-2" />
            Upload Photos
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card hover={false} className="bg-gradient-to-br from-success to-success/80">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <TrendingUp size={24} className="text-success" />
              </div>
              <div className="text-white">
                <div className="text-2xl font-bold">{progress.length}</div>
                <div className="text-sm opacity-90">Weeks Tracked</div>
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-800">
                  Week {getCurrentWeek()}
                </div>
                <div className="text-sm text-neutral-500">Current Week</div>
              </div>
            </div>
          </Card>

          <Card hover={false}>
            <div>
              <div className="text-sm text-neutral-500 mb-2">
                Total Progress Photos
              </div>
              <div className="text-2xl font-bold text-accent">
                {progress.length * 3}
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                {progress.length} weeks × 3 angles
              </div>
            </div>
          </Card>
        </div>

        {/* Photo Comparison */}
        {progress.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-serif text-neutral-800 mb-2">
                Start Your Progress Journey
              </h3>
              <p className="text-neutral-500 mb-6">
                Upload your first set of progress photos to begin tracking your transformation
              </p>
              <Button onClick={() => setShowUploader(true)}>
                <Plus size={18} className="mr-2" />
                Upload First Photos
              </Button>
            </div>
          </Card>
        ) : (
          <PhotoComparison progress={progress} />
        )}
      </div>
    </Layout>
  );
};

export default Progress;
