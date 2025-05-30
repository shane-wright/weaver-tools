# FAB Navigation Implementation

## Story Reference
Story ID: 1004
Title: Implement Floating Action Button Navigation

## Overview
This story covers the implementation of a Floating Action Button (FAB) navigation system that will replace the current tab-based navigation in the Re-Health mobile application. The FAB will be present on all screens and expand to reveal three navigation options: Home, Intake, and Output. This update will simplify the app's navigation and provide a more modern, minimalist user experience.

## Business Value
- Provides a cleaner, more focused user interface by removing the persistent tab bar
- Increases usable screen space for content by eliminating bottom navigation
- Creates a more modern, gesture-driven user experience
- Simplifies navigation to only essential screens by removing the Explore tab
- Enhances visual appeal with attractive animations and transitions

## Technical Solution

### Current Navigation Implementation

The application currently uses Expo Router with a tab-based navigation structure:

- **File Structure**:
  - `/app/_layout.tsx` - Root layout component with ThemeProvider and Stack navigator
  - `/app/(tabs)/_layout.tsx` - Tab navigator configuration with 4 tabs (Home, Intake, Output, Explore)
  - `/app/(tabs)/index.tsx` - Home screen
  - `/app/(tabs)/intake.js` - Intake screen
  - `/app/(tabs)/output.js` - Output screen
  - `/app/(tabs)/explore.tsx` - Explore screen (to be removed)

- **Custom Components**:
  - `HapticTab` - Custom tab component with haptic feedback
  - `TabBarBackground` - Custom background for the tab bar with blur effects
  - `IconSymbol` - Icon component used for tab icons

- **Styling**:
  - Uses a Colors constant for theming
  - Implements a colorScheme hook for light/dark mode
  - Platform-specific styling for iOS and Android

### Component Hierarchy

**Current Structure**:
```
App
├── app/_layout.tsx (Root layout with ThemeProvider)
│   └── Stack.Navigator
│       └── (tabs)/_layout.tsx (Tab Navigator)
│           ├── HapticTab (Custom tab component with haptic feedback)
│           ├── TabBarBackground (Custom background for tab bar)
│           └── Tabs.Screen (Home, Intake, Output, Explore)
└── Screens
    ├── HomeScreen
    ├── IntakeScreen
    ├── OutputScreen
    └── ExploreScreen (to be removed)
```

**New Structure**:
```
App
├── app/_layout.tsx (Root layout with ThemeProvider)
│   ├── Stack.Navigator
│   │   └── Screens (without tabs group)
│   │       ├── index.js (Home)
│   │       ├── intake.js
│   │       └── output.js
│   └── FABNavigator (Overlay component)
│       ├── FABContainer
│       │   ├── MainButton (Primary FAB)
│       │   └── NavigationOptions (Expandable options)
│       │       ├── HomeOption
│       │       ├── IntakeOption
│       │       └── OutputOption
│       └── NavigationStateProvider (Context for navigation state)
└── Screens (Components remain unchanged)
    ├── HomeScreen
    ├── IntakeScreen
    └── OutputScreen
```

### Implementation Phases

#### Phase 1: Create the FAB Component
1. Create a new `FABNavigator` component in `src/components/navigation/`
2. Implement the main FAB button with styling matching the app's design language
3. Implement expandable options with animations using React Native Reanimated
4. Add haptic feedback using the existing `Haptics` implementation from `HapticTab`
5. Ensure proper positioning and z-index to appear above all content
6. Use the existing `IconSymbol` component for consistent iconography
7. Maintain theme support using the app's `useColorScheme` hook

#### Phase 2: Integrate Navigation
1. Create a new navigation layout structure:
   - Update `/app/_layout.tsx` to include the FABNavigator
   - Remove the tab group by restructuring routes directly under the Stack navigator
   - Move screen components from `/app/(tabs)/` to `/app/`
2. Implement a navigation state provider in the FABNavigator:
   - Use `useRouter()` from Expo Router for navigation
   - Track current route to highlight active FAB option
3. Remove the Explore tab/screen:
   - Delete `/app/(tabs)/explore.tsx`
   - Remove references to Explore in navigation
4. Update route structure:
   - Update imports in affected files
   - Ensure backward compatibility during transition
5. Preserve existing navigation features:
   - Maintain screen transitions and animations
   - Keep header configuration and styling

### FAB Component Specifications

#### MainButton
- Circular button with a diameter of 56dp (standard FAB size)
- Primary color: `#4A90E2` with white icon
- Icon: Navigation/menu icon (hamburger or similar)
- Drop shadow for elevated appearance
- Fixed position at bottom right of screen (24dp from edges)
- Haptic feedback on press
- Accessibility considerations:
  - Proper labeling for screen readers
  - Minimum touch target size of 48dp

#### Expanded Options
- Three circular buttons appearing above the main FAB
- Animation: Staggered fade-in with upward movement
- Option spacing: 16dp between options
- Icons and labels:
  - Home: house icon with "Home" label
  - Intake: fork/knife icon with "Intake" label
  - Output: figure/walking icon with "Output" label
- Background scrim to dim the rest of the UI when expanded
- Tap outside to collapse

#### Animations
- Expand/collapse animation: 300ms duration with custom easing
- Rotation of main FAB icon (45 degrees) during expansion
- Staggered appearance of options (50ms delay between each)
- Scale effect on options when pressed

### Navigation Integration
- Use Expo Router's `useRouter()` and `usePathname()` hooks for navigation and route tracking
- Leverage existing navigation patterns from the current implementation
- Implement a custom navigation handler in the FAB component that maintains the current navigation UX
- Preserve existing navigation state management
- Modify the Expo Router configuration:
  - Remove `app/(tabs)/_layout.tsx` tab navigator
  - Flatten the route structure by moving screens from `(tabs)` to the root
  - Update `app/_layout.tsx` to include the FABNavigator as an overlay

### Styling Details
- Integrate with existing styling system:
  - Use the existing `Colors` constant from `/constants/Colors.js`
  - Leverage the `useColorScheme()` hook for theme support
  - Match the visual language of the current UI

- Color palette (synchronized with existing colors):
  - Primary FAB: Use the existing tint color - `Colors[colorScheme].tint` (currently `#4A90E2`)
  - Home option: Match the home tab icon color
  - Intake option: Match the intake tab icon color
  - Output option: Match the output tab icon color

- Shadow properties (consistent with existing components):
  - Shadow color: `#000000`
  - Shadow opacity: 0.25
  - Shadow radius: 4
  - Shadow offset: { width: 0, height: 2 }
  - Elevation (Android): 6

- Typography:
  - Use the existing font styles from the app
  - Option labels: 12pt, semi-bold, white
  - Maintain consistency with current tab labels

- Platform-specific styling:
  - iOS: Utilize blur effects consistent with current TabBarBackground
  - Android: Use solid backgrounds with appropriate elevation

- Accessibility:
  - Maintain existing accessibility patterns from HapticTab
  - High contrast ratios for all elements
  - Support for dynamic text sizes
  - Voice-over/screen reader support

### Technical Requirements
- Integrate with existing components:
  - Use `IconSymbol` for consistent iconography across the app
  - Leverage existing haptic feedback from `HapticTab`
  - Maintain theme support via `useColorScheme` hook

- Animation and interactions:
  - Implement using React Native Reanimated for smooth animations
  - Add gesture handling with React Native Gesture Handler
  - Match the animation style and timing of existing UI components
  - Preserve the tactile feel of the current interface

- Cross-platform considerations:
  - Maintain the platform-specific styling from current TabLayout
  - Ensure proper performance on both iOS and Android
  - Support landscape and portrait orientations
  - Handle safe area insets properly using existing patterns

- Theming:
  - Support light and dark themes using the existing theme system
  - Ensure proper color contrast in both themes
  - Adapt background blur effects to match the current implementation on iOS

## Acceptance Criteria

### FAB Implementation
- [ ] FAB appears on all app screens in consistent position
- [ ] FAB expands to reveal three navigation options when pressed
- [ ] FAB collapses when an option is selected or when tapped outside
- [ ] Animations are smooth and match specifications
- [ ] Each option has appropriate icon and label
- [ ] FAB respects safe areas on different devices
- [ ] FAB appearance adapts to light/dark mode

### Navigation Integration
- [ ] Selecting Home option navigates to the Home screen
- [ ] Selecting Intake option navigates to the Intake screen
- [ ] Selecting Output option navigates to the Output screen
- [ ] Current screen is visually indicated in the expanded options
- [ ] Navigation state is maintained appropriately
- [ ] Explore tab and screen are completely removed
- [ ] Back navigation functions properly with the new system

### Technical Requirements
- [ ] No performance issues or frame drops during animations
- [ ] Properly handles different screen sizes and orientations
- [ ] Works consistently across iOS and Android platforms
- [ ] Animations are hardware accelerated for smooth performance
- [ ] Haptic feedback works correctly on supported devices
- [ ] Component is properly documented with JSDoc

### Accessibility
- [ ] All FAB elements are accessible with screen readers
- [ ] Proper accessibility labels are implemented
- [ ] Touch targets meet minimum size requirements
- [ ] Support for dynamic text sizing
- [ ] Color contrast ratios meet WCAG standards

## Implementation Notes
- File structure changes:
  - Create new files:
    - `/src/components/navigation/FABNavigator.js`
    - `/src/components/navigation/FABButton.js`
    - `/src/components/navigation/NavigationOptions.js`
  - Modify existing files:
    - `/app/_layout.tsx` - Add FABNavigator
    - Move screens from `/app/(tabs)/` to `/app/`
  - Remove files:
    - `/app/(tabs)/_layout.tsx`
    - `/app/(tabs)/explore.tsx`

- Integration with existing components:
  - Reuse the `IconSymbol` component for consistent iconography
  - Maintain the haptic feedback mechanism from `HapticTab`
  - Preserve the color scheme and theming system

- Animation techniques:
  - Use React Native Reanimated's worklet functions for UI thread animations
  - Match animation timing and curves with existing UI elements
  - Implement proper cleanup of animation values and event listeners

- Performance considerations:
  - Optimize render cycles in the FAB component
  - Use memoization for stable callbacks and derived values
  - Test performance on lower-end devices to ensure smooth animations
  - Ensure navigation transitions are seamless when navigating via FAB

- Navigation state:
  - Properly handle deep linking and direct URL navigation
  - Maintain backward navigation stack
  - Preserve existing navigation patterns and behaviors

## Dependencies
All required dependencies are already in the project:
- React Native Reanimated - Used for advanced animations
- React Native Gesture Handler - Used for touch handling
- Expo Haptics - Already used in HapticTab for haptic feedback
- Expo Router - Currently used for navigation
- @react-navigation/native - Used for navigation context
- react-native-safe-area-context - For safe area handling

## Testing Requirements
- Test on both iOS and Android devices
- Test on different screen sizes (phone and tablet)
- Test with various animation settings on the device
- Test with screen readers enabled
- Test with different text size settings
- Test with different theme settings (light/dark)

## Definition of Done
- [ ] All acceptance criteria met
- [ ] FAB appears and functions correctly on all screens
- [ ] Navigation works as expected with new FAB system
- [ ] Explore tab/screen completely removed
- [ ] Existing app functionality is preserved
- [ ] Theming and color scheme support maintained
- [ ] Haptic feedback works as in the current implementation
- [ ] Safe area insets are handled properly
- [ ] Animations are smooth and match specifications
- [ ] Code is well-documented with JSDoc comments (matching existing style)
- [ ] Component is tested on both iOS and Android
- [ ] Accessibility requirements are met
- [ ] Performance is comparable or better than the current navigation
- [ ] Code is reviewed and approved

