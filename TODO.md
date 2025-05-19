# PWA Drink Counter App - TODO List

## PWA Setup
- [x] Install next-pwa package
- [x] Create manifest.json in public folder
- [x] Add PWA icons in various sizes
- [x] Configure service worker
- [x] Update next.config.js for PWA support

## Database Schema
- [x] Update User model with profile information
- [x] Create UserProfile model (age, gender, weight)
- [x] Create DrinkSession model (date, user reference)
- [x] Create DrinkEntry model (type, volume, timestamp, session reference)

## UI Implementation
- [x] Create Onboarding/Profile Screen
  - [x] Form for user details (name, age, gender, weight)
  - [x] "Get Started" button
- [x] Create Main Tracking Screen
  - [x] Big "+1 Beer" button
  - [x] Drink type selector (Beer, Wine, Cocktail, Shot)
  - [x] Drink size selector (ml)
  - [x] Recent entries list
  - [x] Link to Statistics Screen
- [x] Create Statistics Screen
  - [x] Timeline Bar Chart
  - [x] Pie Chart for drink types
  - [x] Numerical stats (total drinks, estimated alcohol, avg per hour)
  - [ ] Optional: Leaderboard

## Backend Implementation
- [x] Create tRPC routes for user profile
- [x] Create tRPC routes for drink sessions
- [x] Create tRPC routes for drink entries
- [x] Create tRPC routes for statistics

## Data Visualization
- [x] Install and configure chart library (recharts)
- [x] Implement Timeline Bar Chart
- [x] Implement Pie Chart
- [x] Calculate and display numerical stats

## Mobile-First Design
- [x] Ensure responsive design for all screens
- [ ] Test on various device sizes
- [x] Implement touch-friendly UI elements

## Testing
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Test data persistence
- [ ] Test UI on mobile devices

## Future Enhancements
- [ ] Add social features (leaderboard)
- [ ] Add BAC estimation
- [ ] Add drink history calendar view
- [ ] Add export functionality
- [ ] Add notifications/reminders