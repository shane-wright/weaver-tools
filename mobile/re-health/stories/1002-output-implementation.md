# Output Screen Implementation

## Story Reference
Story ID: 1002
Title: Implement Output Screen for Physical Regimen

## Overview
Create the Output screen as a hub for the Animal Flow movement practice and physical regimen components of the re-health protocol. This screen will guide users through the recommended movements, provide demonstrations, and help users track their activity.

## Business Value
- Users can access guided Animal Flow movement patterns
- Clear visual demonstrations help users maintain proper form
- Daily workout recommendations sync with fasting/diet protocols
- Movement tracking helps users maintain accountability
- Synergy between fasting/diet and physical movement is emphasized

## Technical Solution
The implementation will follow a component-driven architecture with the following structure:

### Component Hierarchy
```
OutputScreen
├── AnimalFlow/
│   ├── FlowContainer
│   ├── MovementLibrary
│   ├── DailyFlowRecommendation
│   └── MovementDetail
├── WorkoutTracker/
│   ├── WorkoutTrackerContainer
│   ├── SessionLog
│   ├── ProgressStats
│   └── SessionTimer
└── MovementGuide/
    ├── GuideContainer
    ├── ExerciseCard
    ├── FormCues
    └── VideoPlayer
```

### Key Features
1. Animal Flow Library
   - Comprehensive library of Animal Flow movements
   - Visual demonstrations via images and videos
   - Detailed form cues for each movement
   - Progressive difficulty levels

2. Daily Workout Recommendations
   - Day-specific workout routines based on re-health protocol
   - Syncs with current diet day from the Intake screen
   - Appropriate intensity based on fasting status
   - Clear sequence instructions

3. Movement Tracking
   - Log completed workouts
   - Track duration and intensity
   - Record personal notes
   - Visualize progress over time

### Animal Flow Movement Details
Based on re-health.md, the following movements will be included:

1. **Foundational Flows**
   - Bear Crawl - Reset shoulder/scapula stability
   - Crab Reach - Open thoracic spine, counteract hunching
   - Ape Swings - Dynamic hip mobility + core tension
   - Scorpion Reach - Rotational spine health

2. **Advanced Rehab Movements**
   - Slow Eccentrics - 5-second descent in Crab walks for tendon strength
   - Paused Isometrics - Beast Pose holds for joint stabilization
   - Beast → Crab Reach → Ape → Scorpion flows
   - Bear → Lateral Undulation → Frogger sequences

### Workout Structure
The workout structure follows the flowchart from re-health.md:
1. Dynamic Warm-Up (2 min)
2. Core Flow (3 Rounds x 4 min)
3. Cooldown (1 min)

### Detailed Component Specifications

#### AnimalFlow Components

**FlowContainer**
- Purpose: Main container for all Animal Flow movement components
- Props:
  - `currentDay`: Current day of the week to determine recommended flows
  - `fastingStatus`: Current fasting status to adapt intensity
- State:
  - `selectedFlow`: Currently selected flow sequence
  - `flowHistory`: Record of completed flows

**MovementLibrary**
- Purpose: Repository of all Animal Flow movements with search/filter functionality
- Props:
  - `movements`: Array of movement data including videos and descriptions
  - `onSelectMovement`: Handler for selecting a movement
- State:
  - `filteredMovements`: Currently filtered movements
  - `searchQuery`: Current search term

**DailyFlowRecommendation**
- Purpose: Display recommended flows based on the current day and fasting state
- Props:
  - `currentDay`: Day of the week
  - `fastingStatus`: Current fasting status
  - `userLevel`: User's experience level
- State:
  - `recommendedFlows`: Array of recommended flow sequences

**MovementDetail**
- Purpose: Detailed view of a specific movement with video instructions
- Props:
  - `movement`: Movement data object
  - `onBack`: Handler for navigating back
- State:
  - `isVideoPlaying`: Video playback state
  - `currentSection`: Selected information section

#### WorkoutTracker Components

**WorkoutTrackerContainer**
- Purpose: Main container for tracking workout sessions
- Props:
  - `userData`: User profile data including history
- State:
  - `currentSession`: Data for active workout session
  - `sessionHistory`: Array of past workout sessions

**SessionLog**
- Purpose: Interface for logging workout details
- Props:
  - `onLogSession`: Handler for saving session data
- State:
  - `sessionData`: Current session information
  - `isEditing`: Edit mode toggle

**ProgressStats**
- Purpose: Visual representation of workout progress
- Props:
  - `sessionHistory`: Array of past sessions
  - `dateRange`: Time period to display
- State:
  - `selectedMetric`: Currently viewed metric
  - `chartData`: Processed data for visualization

**SessionTimer**
- Purpose: Timer for tracking workout duration
- Props:
  - `onTimerComplete`: Handler for timer completion
- State:
  - `isRunning`: Timer running state
  - `elapsedTime`: Time elapsed in session
  - `intervals`: Array of interval timestamps

#### MovementGuide Components

**GuideContainer**
- Purpose: Main container for exercise guides and tutorials
- Props:
  - `movements`: Array of movement data
- State:
  - `selectedCategory`: Currently selected movement category
  - `viewType`: List or grid view toggle

**ExerciseCard**
- Purpose: Card display for individual exercises
- Props:
  - `exercise`: Exercise data object
  - `onSelect`: Handler for selecting the exercise
- State:
  - `isExpanded`: Expanded view toggle

**FormCues**
- Purpose: Display proper form instructions for movements
- Props:
  - `movement`: Movement data object
  - `difficulty`: User's current difficulty level
- State:
  - `currentCue`: Currently displayed form cue
  - `cueIndex`: Index of current cue in sequence

**VideoPlayer**
- Purpose: Component for playing exercise demonstration videos
- Props:
  - `videoUrl`: URL of video to play
  - `onError`: Handler for video loading errors
- State:
  - `isPlaying`: Playback state
  - `playbackPosition`: Current position in video
  - `isFullscreen`: Fullscreen mode toggle

### Exercise Data Structure

```typescript
interface ExerciseMovement {
  id: string;
  name: string;
  category: 'foundational' | 'advanced' | 'warmup' | 'cooldown';
  difficulty: 1 | 2 | 3; // 1=beginner, 2=intermediate, 3=advanced
  description: string;
  musclesTargeted: string[];
  benefits: string[];
  commonErrors: string[];
  imageUrl: string;
  videoUrl: string;
  formCues: string[];
  complementaryMovements: string[]; // ids of related movements
  progressions: string[]; // ids of progressive movements
  regressions: string[]; // ids of simpler versions
}
```

## Technical Requirements
- Use React Native components
- Implement video playback using Expo's video capabilities
- Use AsyncStorage for workout tracking
- Follow component-driven design principles
- Maintain clean separation of concerns
- Ensure integration with existing app architecture
- Synchronize with diet/fasting state from Intake screen

## Acceptance Criteria

### Screen Setup
- [ ] Screen is accessible via navigation
- [ ] Screen is properly named "Output"
- [ ] Layout is responsive and intuitive

### Animal Flow Library
- [ ] All specified movements are included
- [ ] Each movement has clear visual representation
- [ ] Detailed form cues are provided
- [ ] Videos load and play correctly
- [ ] Library is searchable/filterable

### Daily Workout Recommendations
- [ ] Shows appropriate workout for current day
- [ ] Adapts based on fasting status
- [ ] Clear sequence instructions
- [ ] Timer/counter functionality
- [ ] Exercise substitution options

### Workout Tracking
- [ ] Users can log completed workouts
- [ ] Duration tracking
- [ ] Calendar view of activity
- [ ] Notes and feedback entry
- [ ] Progress visualization

### Component Requirements
- [ ] Each component has single responsibility
- [ ] State is properly managed
- [ ] Videos and images load efficiently
- [ ] Components handle loading and error states

## Testing Requirements
- [ ] Verify video playback
- [ ] Test workout timer functionality
- [ ] Confirm proper day synchronization
- [ ] Validate workout logging and retrieval
- [ ] Test navigation between movement details

## Documentation Requirements
- [ ] Component documentation
- [ ] Movement execution guidelines
- [ ] State management documentation
- [ ] Image and video asset management

## Dependencies
- React Native
- Expo Video
- AsyncStorage
- Existing app components
- React Navigation

## Implementation Notes
- Focus on clear, instructive UI for movements
- Prioritize performance when loading video content
- Consider offline access to movement library
- Ensure workout recommendations align with fasting status
- Use consistent design patterns from existing screens

## Potential Pitfalls
- Video playback performance on older devices
- Synchronizing fasting state with workout recommendations
- Managing the potentially large library of movement data
- Ensuring accurate timing for workout intervals
- Maintaining state consistency between screens

## Open Questions
- How should we handle video downloads for offline access?
- Should we implement advanced metrics for workout tracking?
- What's the best way to visually represent workout progress?
- How detailed should the form feedback be for users?

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Performance verified
- [ ] Navigation working
- [ ] Video playback tested on multiple devices

