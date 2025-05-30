/**
 * Weekly diet plan data based on the re-health protocol
 * This data structure defines the diet for each day of the week
 */

const DIET_PLAN = {
  // Day indexes are 0-based (0 = Sunday, 1 = Monday, etc.) to match JavaScript Date's getDay()
  0: { // Sunday
    name: 'Sunday',
    fastingWindow: 'Optional 36h Fast',
    primaryFocus: 'Recharge',
    meals: [
      { title: 'Meal 1', content: '(Optional 36h Fast)' },
      { title: 'Meal 2', content: 'Bone Broth → Salmon' }
    ],
    note: 'Prioritize omega-3s for recovery'
  },
  1: { // Monday
    name: 'Monday',
    fastingWindow: '16/8 (Skip Breakfast)',
    primaryFocus: 'Metabolic Reset',
    meals: [
      { title: 'Meal 1', content: '(Fasted)' },
      { title: 'Meal 2', content: 'Ribeye + Sweet Potato' },
      { title: 'Meal 3', content: 'Salmon + Asparagus' }
    ],
    note: 'High-protein post-fast'
  },
  2: { // Tuesday
    name: 'Tuesday',
    fastingWindow: '18/6 (Late Lunch)',
    primaryFocus: 'Strength + Mobility',
    meals: [
      { title: 'Meal 1', content: 'Venison + White Rice' },
      { title: 'Meal 2', content: 'Eggs + Kimchi + Almond Butter' }
    ],
    note: 'Carbs post-lift'
  },
  3: { // Wednesday
    name: 'Wednesday',
    fastingWindow: '16/8 (Skip Breakfast)',
    primaryFocus: 'Power/Explosiveness',
    meals: [
      { title: 'Meal 1', content: '(Fasted)' },
      { title: 'Meal 2', content: 'Bison + Pineapple' },
      { title: 'Meal 3', content: 'Sardines + Squash' }
    ],
    note: 'Glycogen replenishment'
  },
  4: { // Thursday
    name: 'Thursday',
    fastingWindow: '24h Fast (2 PM → 2 PM)',
    primaryFocus: 'Deep Autophagy',
    meals: [
      { title: 'Meal 1', content: '(24h Fast Starts 2 PM)' },
      { title: 'Meal 2', content: 'Bone Broth (2 PM Fri)' },
      { title: 'Meal 3', content: 'Ribeye + Avocado' }
    ],
    note: 'Break fast gently'
  },
  5: { // Friday
    name: 'Friday',
    fastingWindow: '12h Fast (8 PM → 8 AM)',
    primaryFocus: 'Refeed + Rebuild',
    meals: [
      { title: 'Meal 1', content: 'Eggs + Avocado' },
      { title: 'Meal 2', content: 'Chicken + Jasmine Rice' }
    ],
    note: 'Moderate carbs post-workout'
  },
  6: { // Saturday
    name: 'Saturday',
    fastingWindow: '14/10 (Overnight)',
    primaryFocus: 'Feast + Play',
    meals: [
      { title: 'All meals', content: 'Feast day/cheat day' }
    ],
    note: 'Feast day for mental satisfaction'
  }
};

export default DIET_PLAN;
