export const HABIT_CATEGORIES = {
  MORNING: 'morning',
  DAYTIME: 'daytime',
  EVENING: 'evening',
  NUTRITION: 'nutrition',
} as const;

export const HABITS = {
  // Morning habits
  LEGS_UP_WALL: {
    key: 'legsUpWall',
    name: 'Legs Up the Wall',
    category: HABIT_CATEGORIES.MORNING,
    description: '5 minutes - drains lymph that pools overnight',
  },
  DRY_BRUSHING: {
    key: 'dryBrushing',
    name: 'Dry Brushing',
    category: HABIT_CATEGORIES.MORNING,
    description: '3-5 minutes - upward strokes toward groin',
  },
  CONTRAST_SHOWER: {
    key: 'contrastShower',
    name: 'Contrast Shower',
    category: HABIT_CATEGORIES.MORNING,
    description: '2-3 minutes - alternating warm and cold',
  },
  MORNING_HYDRATION: {
    key: 'morningHydration',
    name: 'Morning Hydration',
    category: HABIT_CATEGORIES.MORNING,
    description: '500ml water with electrolytes within 30 minutes',
  },

  // Daytime habits
  HOURLY_MOVEMENT: {
    key: 'hourlyMovement',
    name: 'Hourly Movement',
    category: HABIT_CATEGORIES.DAYTIME,
    description: 'Every 60-90 min: calf raises, glute squeezes, squats',
  },
  STEPS_COUNT: {
    key: 'stepsCount',
    name: 'Daily Steps',
    category: HABIT_CATEGORIES.DAYTIME,
    description: 'Target: 10,000 steps',
    trackable: true,
    goal: 10000,
  },
  DAILY_HYDRATION: {
    key: 'dailyHydration',
    name: 'Daily Water Intake',
    category: HABIT_CATEGORIES.DAYTIME,
    description: 'Target: 2.5 liters',
    trackable: true,
    goal: 2.5,
  },

  // Evening habits
  GLUTE_EXERCISES: {
    key: 'gluteExercises',
    name: 'Glute Activation',
    category: HABIT_CATEGORIES.EVENING,
    description: '10-12 min: bridges, wall sits, lunges, kickbacks',
  },
  TOE_PICKUPS: {
    key: 'toePickups',
    name: 'Toe Pick-ups',
    category: HABIT_CATEGORIES.EVENING,
    description: '2 minutes - activates calves and lymph return',
  },
  OIL_MASSAGE: {
    key: 'oilMassage',
    name: 'Oil Massage/Cupping',
    category: HABIT_CATEGORIES.EVENING,
    description: '5-8 minutes - slow upward movements',
  },
  MAGNESIUM_APP: {
    key: 'magnesiumApp',
    name: 'Magnesium Application',
    category: HABIT_CATEGORIES.EVENING,
    description: '2 minutes - magnesium oil or lotion on legs',
  },
  LEGS_ELEVATED: {
    key: 'legsElevated',
    name: 'Legs Elevated',
    category: HABIT_CATEGORIES.EVENING,
    description: 'Before bed - ankles above heart',
  },

  // Nutrition habits
  COLLAGEN_INTAKE: {
    key: 'collagenIntake',
    name: 'Collagen Supplement',
    category: HABIT_CATEGORIES.NUTRITION,
    description: '10-15g daily',
  },
  PROTEIN_MEALS: {
    key: 'proteinMeals',
    name: 'Protein at Meals',
    category: HABIT_CATEGORIES.NUTRITION,
    description: 'Include protein in every meal',
  },
  LOW_SUGAR: {
    key: 'lowSugar',
    name: 'Low Sugar Intake',
    category: HABIT_CATEGORIES.NUTRITION,
    description: 'Keep sugar consumption low',
  },
  AVOID_SEED_OILS: {
    key: 'avoidSeedOils',
    name: 'Avoid Seed Oils',
    category: HABIT_CATEGORIES.NUTRITION,
    description: 'No sunflower, canola, or corn oil',
  },
} as const;

export const WATER_GOAL = 2.5; // liters
export const STEPS_GOAL = 10000; // steps
