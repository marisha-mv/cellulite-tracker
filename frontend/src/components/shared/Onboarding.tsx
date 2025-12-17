import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckSquare, Dumbbell, Camera, Sparkles } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Sparkles size={48} className="text-primary" />,
      title: 'Welcome to Your Wellness Journey',
      description: 'Track your cellulite reduction progress with our premium tracking system. See real results in just 4 weeks with consistent tracking.',
      tips: [
        'Track 17 daily habits',
        'Log 2 glute workouts per week',
        'Upload weekly progress photos',
        'View your transformation',
      ],
    },
    {
      icon: <CheckSquare size={48} className="text-primary" />,
      title: 'Daily Habit Tracking',
      description: 'Build consistency by tracking your daily wellness habits. Complete at least 70% each day to maintain your streak.',
      tips: [
        'Morning routine: legs up wall, dry brushing, contrast shower',
        'Daytime: 10k steps, 2.5L water, hourly movement',
        'Evening: glute exercises, massage, magnesium',
        'Nutrition: collagen, protein, avoid seed oils',
      ],
    },
    {
      icon: <Dumbbell size={48} className="text-accent" />,
      title: 'Weekly Glute Workouts',
      description: 'Complete 2 full glute workouts each week. Track sets, reps, and weight for 5 exercises per session.',
      tips: [
        'Hip thrusts for glute activation',
        'Abductors for outer thigh',
        'Romanian deadlifts for hamstrings',
        'Add 2 custom exercises',
        'Celebrate when you hit 2/2 workouts!',
      ],
    },
    {
      icon: <Camera size={48} className="text-success" />,
      title: 'Progress Photos',
      description: 'Upload 3 photos (front, back, side) each week. Compare weeks side-by-side to see your transformation.',
      tips: [
        'Use the same lighting and location',
        'Wear form-fitting clothing',
        'Take photos at the same time of day',
        'Compare weeks to see progress',
      ],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <Modal isOpen={isOpen} onClose={handleComplete} size="lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="py-4"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
              {currentStepData.icon}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-serif text-neutral-800 mb-3">
              {currentStepData.title}
            </h2>
            <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
              {currentStepData.description}
            </p>
          </div>

          {/* Tips */}
          <div className="bg-secondary rounded-premium p-6 mb-6">
            <ul className="space-y-3">
              {currentStepData.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-0.5">
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
                  </div>
                  <span className="text-sm text-neutral-700">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-primary w-8'
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : ''}
            >
              <ChevronLeft size={18} className="mr-1" />
              Back
            </Button>

            <button
              onClick={handleComplete}
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              Skip tutorial
            </button>

            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight size={18} className="ml-1" />}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

export default Onboarding;
