import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

interface PhotoUploaderProps {
  onUpload: (photos: { front: File; back: File; side: File }, weekNumber: number, notes?: string) => Promise<void>;
  onCancel: () => void;
  currentWeek: number;
}

const ProgressPhotoUploader: React.FC<PhotoUploaderProps> = ({
  onUpload,
  onCancel,
  currentWeek,
}) => {
  const [photos, setPhotos] = useState<{
    front?: File;
    back?: File;
    side?: File;
  }>({});
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const createDropzone = (type: 'front' | 'back' | 'side') => {
    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          setPhotos((prev) => ({ ...prev, [type]: acceptedFiles[0] }));
        }
      },
      [type]
    );

    return useDropzone({
      onDrop,
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
    });
  };

  const frontDropzone = createDropzone('front');
  const backDropzone = createDropzone('back');
  const sideDropzone = createDropzone('side');

  const removePhoto = (type: 'front' | 'back' | 'side') => {
    setPhotos((prev) => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
  };

  const handleUpload = async () => {
    if (!photos.front || !photos.back || !photos.side) {
      toast.error('Please upload all three photos');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(
        {
          front: photos.front,
          back: photos.back,
          side: photos.side,
        },
        currentWeek,
        notes
      );
    } finally {
      setIsUploading(false);
    }
  };

  const renderDropzone = (
    type: 'front' | 'back' | 'side',
    label: string,
    dropzone: ReturnType<typeof useDropzone>
  ) => {
    const photo = photos[type];
    const preview = photo ? URL.createObjectURL(photo) : null;

    return (
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
        <div
          {...dropzone.getRootProps()}
          className={`relative border-2 border-dashed rounded-premium p-4 transition-all cursor-pointer ${
            dropzone.isDragActive
              ? 'border-primary bg-primary/5'
              : photo
              ? 'border-success bg-success/5'
              : 'border-neutral-300 hover:border-primary/50'
          }`}
        >
          <input {...dropzone.getInputProps()} />

          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt={label}
                className="w-full h-48 object-cover rounded-premium"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(type);
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-2 left-2 px-3 py-1 bg-success text-white rounded-premium text-sm flex items-center space-x-1">
                <Check size={14} />
                <span>Uploaded</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload
                size={32}
                className={`mx-auto mb-3 ${
                  dropzone.isDragActive ? 'text-primary' : 'text-neutral-400'
                }`}
              />
              <p className="text-sm text-neutral-600 mb-1">
                {dropzone.isDragActive
                  ? 'Drop the photo here'
                  : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-neutral-400">
                JPEG, PNG, WebP (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const allPhotosUploaded = photos.front && photos.back && photos.side;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <ImageIcon size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-serif text-neutral-800">
              Upload Progress Photos
            </h3>
            <p className="text-sm text-neutral-500">Week {currentWeek}</p>
          </div>
        </div>

        <div className="p-4 bg-secondary rounded-premium mb-6">
          <p className="text-sm text-neutral-700">
            <strong>Tips for best results:</strong>
          </p>
          <ul className="text-sm text-neutral-600 mt-2 space-y-1 list-disc list-inside">
            <li>Use the same lighting and location each week</li>
            <li>Wear form-fitting clothing</li>
            <li>Stand in the same pose and distance from camera</li>
            <li>Take photos at the same time of day</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderDropzone('front', 'Front View', frontDropzone)}
          {renderDropzone('back', 'Back View', backDropzone)}
          {renderDropzone('side', 'Side View', sideDropzone)}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-serif text-neutral-800 mb-3">
          Notes (Optional)
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this week's progress..."
          className="w-full px-4 py-3 border border-neutral-200 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          rows={3}
        />
      </Card>

      <div className="flex items-center justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          loading={isUploading}
          disabled={!allPhotosUploaded}
        >
          <Upload size={18} className="mr-2" />
          Upload Photos
        </Button>
      </div>
    </div>
  );
};

export default ProgressPhotoUploader;
