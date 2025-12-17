import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';
import Card from './Card';

const TIPS = [
  {
    title: 'Consistency Over Perfection',
    message: 'Tracking 70% of your habits daily is better than aiming for 100% and giving up. Progress, not perfection.',
  },
  {
    title: 'Hydration is Key',
    message: 'Water intake directly affects lymph drainage. Aim for 2.5L daily with electrolytes for best results.',
  },
  {
    title: 'Muscle Tone Matters',
    message: 'Building glute muscle creates a smoother appearance. Your 2 weekly workouts are transformative.',
  },
  {
    title: 'Photo Comparison Power',
    message: 'Your eyes adjust to gradual changes. Weekly photos show progress you might not notice in the mirror.',
  },
  {
    title: 'Lymph Movement Daily',
    message: 'Dry brushing and legs-up-the-wall drain accumulated lymph. These simple habits create visible change.',
  },
  {
    title: 'Evening Routine Matters',
    message: 'The oil massage and elevation before bed reduce overnight pooling. Morning puffiness will decrease.',
  },
  {
    title: 'Track Your Wins',
    message: 'Every streak day, every workout, every photo upload is progress. Celebrate small victories.',
  },
];

const MotivationalTip: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if tip was dismissed today
    const dismissedDate = localStorage.getItem('tip_dismissed_date');
    const today = new Date().toDateString();

    if (dismissedDate === today) {
      setIsDismissed(true);
    } else {
      // Show a random tip
      setCurrentTip(Math.floor(Math.random() * TIPS.length));
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('tip_dismissed_date', new Date().toDateString());
  };

  if (isDismissed) return null;

  const tip = TIPS[currentTip];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-l-4 border-l-accent">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Lightbulb size={20} className="text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-neutral-800 mb-1">
                💡 {tip.title}
              </h3>
              <p className="text-sm text-neutral-600">{tip.message}</p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default MotivationalTip;
