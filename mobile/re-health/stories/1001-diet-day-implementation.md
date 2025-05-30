# Diet Day Tracking Implementation

## Story Reference
Story ID: 1001
Title: Implement Diet Day Tracking Components

## Overview
Create components to display the current day's diet plan and meals based on the weekly schedule outlined in the re-health protocol. The system will track which day of the week it is and show the corresponding diet information.

## Business Value
- Users can easily identify which day of the diet cycle they are on
- Clear display of the specific meals recommended for the current day
- Helps users maintain compliance with the structured diet plan
- Removes mental overhead of remembering what to eat on which day

## Technical Solution
The implementation will follow a component-driven architecture with the following structure:

### Component Hierarchy
```
DietStatus/
├── DietStatusContainer
├── DayIndicator
├── NextDayPreview
├── ProgressTracker
└── MealProtocol/
    ├── MealProtocolContainer
    ├── DailyMealList
    ├── MealCard
    └── ProtocolGuide
```

### Key Features
1. Diet Day Tracking
   - Track and display current day in the weekly diet cycle (Monday-Sunday)
   - Highlight fasting protocols for each day
   - Show a preview of the next day's requirements

2. Meal Protocol Display
   - Display detailed meal information for the current day
   - Show specific meal contents based on the weekly plan
   - Provide timing guidance based on fasting schedule

3. Diet Progress Tracking
   - Visual indicator of progress through the weekly cycle
   - Persistence of current day data

### Diet Plan Details
Based on re-health.md, the weekly diet plan is structured as follows:

#### Monday
- **Fasting Window**: 16/8 (Skip Breakfast)
- **Primary Focus**: Metabolic Reset
- **Meals**:
  - Meal 1: (Fasted)
  - Meal 2: Ribeye + Sweet Potato
  - Meal 3: Salmon + Asparagus
- **Note**: High-protein post-fast

#### Tuesday
- **Fasting Window**: 18/6 (Late Lunch)
- **Primary Focus**: Strength + Mobility
- **Meals**:
  - Meal 1: Venison + White Rice
  - Meal 2: Eggs + Kimchi + Almond Butter
- **Note**: Carbs post-lift

#### Wednesday
- **Fasting Window**: 16/8 (Skip Breakfast)
- **Primary Focus**: Power/Explosiveness
- **Meals**:
  - Meal 1: (Fasted)
  - Meal 2: Bison + Pineapple
  - Meal 3: Sardines + Squash
- **Note**: Glycogen replenishment

#### Thursday
- **Fasting Window**: 24h Fast (2 PM → 2 PM)
- **Primary Focus**: Deep Autophagy
- **Meals**:
  - Meal 1: (24h Fast Starts 2 PM)
  - Meal 2: Bone Broth (2 PM Fri)
  - Meal 3: Ribeye + Avocado
- **Note**: Break fast gently

#### Friday
- **Fasting Window**: 12h Fast (8 PM → 8 AM)
- **Primary Focus**: Refeed + Rebuild
- **Meals**:
  - Meal 1: Eggs + Avocado
  - Meal 2: Chicken + Jasmine Rice
- **Note**: Moderate carbs post-workout

#### Saturday
- **Fasting Window**: 14/10 (Overnight)
- **Primary Focus**: Feast + Play
- **Meals**:
  - All meals: Feast day/cheat day
- **Note**: Feast day for mental satisfaction

#### Sunday
- **Fasting Window**: Optional 36h Fast
- **Primary Focus**: Recharge
- **Meals**:
  - Meal 1: (Optional 36h Fast)
  - Meal 2: Bone Broth → Salmon
- **Note**: Prioritize omega-3s for recovery

## Technical Requirements
- Use React Native components
- Implement AsyncStorage for persistence
- Use JavaScript Date object for day tracking
- Follow component-driven design principles
- Maintain clean separation of concerns

## Acceptance Criteria

### Day Tracking
- [ ] Displays the correct day of the week
- [ ] Shows appropriate fasting protocol for the day
- [ ] Indicates the primary focus for the day
- [ ] Persists the day state across app restarts
- [ ] Transitions to next day at midnight

### Meal Display
- [ ] Lists all meals for the current day
- [ ] Shows detailed meal contents for each
- [ ] Differentiates between fasting periods and eating windows
- [ ] Displays notes for special considerations
- [ ] Updates when day changes

### Progress Tracking
- [ ] Shows visual progress through the week
- [ ] Indicates upcoming days
- [ ] Allows manual override for day selection
- [ ] Properly handles week transitions

### Component Requirements
- [ ] Each component has single responsibility
- [ ] Components communicate effectively
- [ ] State management is clean and efficient
- [ ] UI is consistent with design system

## Testing Requirements
- [ ] Verify correct day detection
- [ ] Test day transitions
- [ ] Confirm meal plan accuracy
- [ ] Test persistence
- [ ] Validate manual overrides

## Documentation Requirements
- [ ] Component documentation
- [ ] Props documentation
- [ ] State management documentation
- [ ] Day calculation logic documentation

## Dependencies
- React Native
- AsyncStorage
- Existing app components
- Date handling utilities

## Implementation Notes
- Ensure the day calculation accounts for timezone differences
- Consider edge cases like app installation on different days of the week
- Allow for future customization of the diet plan
- Make diet plan data structured for potential backend integration

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] UI/UX verified
- [ ] Persistence confirmed
- [ ] Day transition tested

