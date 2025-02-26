# Big Splash Fishing Adventure

A story-driven fishing adventure game where players embark on a quest to find the legendary Golden Carp while exploring various locations, competing in challenges, and building their fishing collection.

## Features

- **Engaging Story Mode**: Follow an immersive narrative featuring colorful characters like the Old Fisherman, Evil Joe, and the mysterious Researcher.
- **Multiple Game Modes**:
  - Traditional fishing challenges
  - Boat racing obstacles
  - Puzzle sequences
- **Collection System**: Catch and collect various fish species
- **In-Game Economy**: Earn and spend coins to buy new fishing gear and items
- **Progressive Gameplay**: Unlock better equipment and discover new locations as you advance

## Technical Stack

- React Native
- MobX-State-Tree for state management
- TypeScript for type-safe code
- TailwindCSS for styling
- React Navigation for screen management

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. For iOS:
   ```bash
   cd ios
   pod install
   cd ..
   ```
4. Start the application:
   - For iOS: `npm run ios`
   - For Android: `npm run android`

## Game Mechanics

### Fishing System

- Cast your line in specific spots
- Use different types of gear and bait
- Collect various fish species

### Economy System

- Earn coins through fishing and completing challenges
- Purchase new equipment from the Fishing Store
- Sell caught fish for additional income

### Story Progression

1. Start as a novice fisherman
2. Learn basic fishing techniques from the Old Fisherman
3. Compete against Evil Joe in boat racing
4. Meet the mysterious Researcher
5. Finally hunt for the legendary Golden Carp

## Save System

The game automatically saves your progress, including:

- Owned fish collection
- Coin balance
- Story progression
- Unlocked equipment

## Development

This project uses:

- ESLint for code linting
- Prettier for code formatting
- Jest for testing

To run tests:

```bash
npm test
```
