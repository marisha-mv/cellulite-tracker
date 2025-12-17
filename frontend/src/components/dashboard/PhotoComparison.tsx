import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { WeeklyProgress } from '../../types';
import Card from '../shared/Card';
import Modal from '../shared/Modal';

interface PhotoComparisonProps {
  progress: WeeklyProgress[];
}

const PhotoComparison: React.FC<PhotoComparisonProps> = ({ progress }) => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [compareWeek, setCompareWeek] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'front' | 'back' | 'side'>('front');
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

  if (progress.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-neutral-500">No progress photos yet</p>
          <p className="text-sm text-neutral-400 mt-1">
            Upload your first set of photos to start tracking
          </p>
        </div>
      </Card>
    );
  }

  const currentProgress = progress[selectedWeek];
  const comparisonProgress = compareWeek !== null ? progress[compareWeek] : null;

  const getPhotoUrl = (photoPath: string) => {
    return `http://localhost:5000/uploads/${photoPath}`;
  };

  const getCurrentPhoto = () => {
    switch (viewMode) {
      case 'front':
        return currentProgress.frontPhoto;
      case 'back':
        return currentProgress.backPhoto;
      case 'side':
        return currentProgress.sidePhoto;
    }
  };

  const getComparisonPhoto = () => {
    if (!comparisonProgress) return null;
    switch (viewMode) {
      case 'front':
        return comparisonProgress.frontPhoto;
      case 'back':
        return comparisonProgress.backPhoto;
      case 'side':
        return comparisonProgress.sidePhoto;
    }
  };

  return (
    <div className="space-y-6">
      {/* Week Navigator */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedWeek(Math.min(selectedWeek + 1, progress.length - 1))}
            disabled={selectedWeek === progress.length - 1}
            className="p-2 hover:bg-neutral-100 rounded-premium transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-center">
            <h3 className="text-xl font-serif text-neutral-800">
              Week {currentProgress.weekNumber}
            </h3>
            <p className="text-sm text-neutral-500">
              {new Date(currentProgress.startDate).toLocaleDateString()} -{' '}
              {new Date(currentProgress.endDate).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={() => setSelectedWeek(Math.max(selectedWeek - 1, 0))}
            disabled={selectedWeek === 0}
            className="p-2 hover:bg-neutral-100 rounded-premium transition-colors disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center justify-center space-x-2">
          {(['front', 'back', 'side'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-premium capitalize transition-all ${
                viewMode === mode
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </Card>

      {/* Comparison Selector */}
      {progress.length > 1 && (
        <Card>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Compare with another week
          </label>
          <select
            value={compareWeek ?? ''}
            onChange={(e) =>
              setCompareWeek(e.target.value ? parseInt(e.target.value) : null)
            }
            className="input-field"
          >
            <option value="">No comparison</option>
            {progress.map((p, index) => (
              <option key={p.id} value={index} disabled={index === selectedWeek}>
                Week {p.weekNumber} -{' '}
                {new Date(p.startDate).toLocaleDateString()}
              </option>
            ))}
          </select>
        </Card>
      )}

      {/* Photo Display */}
      <div
        className={`grid ${
          comparisonProgress ? 'grid-cols-2' : 'grid-cols-1'
        } gap-6`}
      >
        <Card>
          <div className="relative group">
            <img
              src={getPhotoUrl(getCurrentPhoto())}
              alt={`Week ${currentProgress.weekNumber} - ${viewMode}`}
              className="w-full h-auto rounded-premium cursor-pointer"
              onClick={() => setFullscreenPhoto(getPhotoUrl(getCurrentPhoto()))}
            />
            <button
              onClick={() => setFullscreenPhoto(getPhotoUrl(getCurrentPhoto()))}
              className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-premium opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Maximize2 size={16} />
            </button>
            <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 text-white rounded-premium text-sm">
              Week {currentProgress.weekNumber}
            </div>
          </div>
        </Card>

        {comparisonProgress && (
          <Card>
            <div className="relative group">
              <img
                src={getPhotoUrl(getComparisonPhoto()!)}
                alt={`Week ${comparisonProgress.weekNumber} - ${viewMode}`}
                className="w-full h-auto rounded-premium cursor-pointer"
                onClick={() =>
                  setFullscreenPhoto(getPhotoUrl(getComparisonPhoto()!))
                }
              />
              <button
                onClick={() =>
                  setFullscreenPhoto(getPhotoUrl(getComparisonPhoto()!))
                }
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-premium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Maximize2 size={16} />
              </button>
              <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 text-white rounded-premium text-sm">
                Week {comparisonProgress.weekNumber}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Notes */}
      {currentProgress.notes && (
        <Card>
          <h3 className="text-sm font-medium text-neutral-700 mb-2">Notes</h3>
          <p className="text-neutral-600 italic">{currentProgress.notes}</p>
        </Card>
      )}

      {/* Fullscreen Modal */}
      <Modal
        isOpen={!!fullscreenPhoto}
        onClose={() => setFullscreenPhoto(null)}
        size="xl"
      >
        {fullscreenPhoto && (
          <div className="flex items-center justify-center">
            <img
              src={fullscreenPhoto}
              alt="Fullscreen view"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PhotoComparison;
