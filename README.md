# ULink Routine — 유링크 루틴

> 링크로 만드는 습관 관리

A calm, production-minded routine management app for iOS and Android.  
Built with **Expo React Native + TypeScript**.

---

## Overview

ULink Routine helps users build daily habits using YouTube links.  
The app is designed to feel calm, premium, and subtly encouraging — not gamified.

A soft plant-growth metaphor provides visual progress feedback without being dominant or arcade-like.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 51 (React Native 0.74) |
| Language | TypeScript (strict) |
| Navigation | React Navigation 6 |
| State | Local hooks (Firebase-ready) |
| Storage | AsyncStorage (local mock) |
| Future Backend | Firebase (Auth + Firestore + Functions) |
| Future Payments | RevenueCat |

---

## Project Structure

```
ulink-routine/
├── App.tsx                        # Entry point
├── app.json                       # Expo config (bundle IDs, icons)
├── src/
│   ├── assets/                    # Icons, fonts, splash
│   ├── components/                # Reusable UI components
│   │   ├── AppIconPreviewCard.tsx
│   │   ├── Badge.tsx
│   │   ├── LoginBanner.tsx
│   │   ├── PlantStatusCard.tsx
│   │   ├── PrimaryButton.tsx
│   │   ├── ProgressCard.tsx
│   │   ├── RoutineCard.tsx
│   │   ├── RoutineDayItem.tsx
│   │   ├── SecondaryButton.tsx
│   │   ├── SectionTitle.tsx
│   │   └── SimpleWidgetPreviewCard.tsx
│   ├── constants/                 # App-wide string/config constants
│   ├── data/                      # Mock data (replace with Firestore)
│   ├── hooks/                     # Business logic hooks
│   │   ├── usePlantProgress.ts
│   │   ├── useRoutines.ts
│   │   └── useUserState.ts
│   ├── navigation/
│   │   ├── AppNavigator.tsx       # Root stack navigator
│   │   ├── BottomTabNavigator.tsx # Bottom tab navigator
│   │   └── types.ts               # Navigation type definitions
│   ├── screens/
│   │   ├── AuthScreen.tsx         # Full sign-in screen
│   │   ├── DoneScreen.tsx         # Post-completion calm feedback
│   │   ├── HomeScreen.tsx         # Main dashboard
│   │   ├── LoginPromptSheet.tsx   # Soft login modal
│   │   ├── MyScreen.tsx           # Profile, settings, widget preview
│   │   ├── PlayScreen.tsx         # Routine execution + YouTube
│   │   ├── PremiumScreen.tsx      # Subscription upgrade
│   │   ├── ReportScreen.tsx       # Weekly/monthly report
│   │   └── RoutineListScreen.tsx  # Weekly routine list
│   ├── services/
│   │   ├── firebase/              # Firebase integration points
│   │   │   ├── auth.ts            # Auth service (mock → Firebase Auth)
│   │   │   └── firestore.ts       # Data repositories (mock → Firestore)
│   │   ├── premium/               # RevenueCat integration point
│   │   └── youtube/               # YouTube external link handler
│   ├── theme/                     # Design system
│   │   ├── colors.ts              # Color palette
│   │   ├── spacing.ts             # Spacing, radius, button heights
│   │   └── typography.ts          # Type scale
│   ├── types/                     # TypeScript domain types
│   └── utils/
│       ├── dateUtils.ts
│       └── plantUtils.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Install & Run

```bash
# Clone the repo
git clone https://github.com/yadorida1/ulink-routine.git
cd ulink-routine

# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

---

## Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary500` | `#7FAFA8` | Main brand, icons |
| `primary600` | `#5C8F89` | Interactive elements, CTAs |
| `primary100` | `#EAF4F2` | Backgrounds, badges |
| `background` | `#F7FAF9` | App background |
| `surface` | `#FFFFFF` | Cards, sheets |
| `textPrimary` | `#2F3E3D` | Main text |
| `textSecondary` | `#8A9B99` | Secondary text |

### Typography Scale

| Style | Size | Weight |
|---|---|---|
| Display | 32 | SemiBold |
| Title 1 | 28 | SemiBold |
| Title 2 | 24 | SemiBold |
| Heading | 20 | SemiBold |
| Body 1 | 16 | Medium |
| Body 2 | 15 | Regular |
| Caption 1 | 13 | Medium |
| Caption 2 | 12 | Regular |

---

## App Flow

```
App Launch
└── HomeScreen (guest OK)
    ├── RoutineListScreen
    │   └── PlayScreen → DoneScreen → ReportScreen
    ├── ReportScreen
    ├── MyScreen
    │   ├── AuthScreen (sign in)
    │   └── PremiumScreen
    ├── LoginPromptSheet (modal, triggered on add topic / save progress)
    └── PremiumScreen
```

---

## Guest vs Signed-In Behavior

| Feature | Guest | Free (signed in) | Premium |
|---|---|---|---|
| 1 topic | ✓ | ✓ | ✓ |
| Multiple topics | ✗ → login prompt | ✗ → premium screen | ✓ |
| Local progress | ✓ | ✓ | ✓ |
| Cloud sync | ✗ | ✗ | ✓ |
| Detailed report | ✗ | Basic | Full + AI |
| Plant growth | ✓ | ✓ | Full stages |

---

## Plant Growth System

The plant is a **subtle encouragement layer**, not a game mechanic.

### Stages
`seed` → `sprout` → `youngPlant` → `bloom` → `harvest`

### States
| State | Meaning |
|---|---|
| `healthy` | Actively completing routines |
| `slowed` | Missed 1 day |
| `recovering` | Missed 3+ days |
| `resting` | Missed 5+ days |

**Never hard reset.** Recovery is gentle and encouraging.

---

## Firebase Integration Guide

All Firebase integration points are marked with `// INTEGRATION POINT:` comments.

### 1. Firebase Auth (`src/services/firebase/auth.ts`)

```bash
npm install @react-native-firebase/app @react-native-firebase/auth
npm install @invertase/react-native-apple-authentication
npm install @react-native-google-signin/google-signin
```

Replace mock `signInWithApple` / `signInWithGoogle` with real Firebase Auth calls.

### 2. Firestore (`src/services/firebase/firestore.ts`)

```bash
npm install @react-native-firebase/firestore
```

Replace each repository's mock return with real Firestore queries.

**Collection structure:**
```
users/{userId}/
  topics/{topicId}
  routines/{routineId}
  progress/{progressId}
  plant/current
```

### 3. Cloud Functions (`functions/`)

Create a `functions/` directory and implement:

```typescript
// onRoutineCompleted — triggered by progress Firestore write
// onDailySchedule   — scheduled: check missed days, update plant vitality
// onMonthlyHarvest  — scheduled: archive cycle, reset state
```

### 4. RevenueCat (`src/services/premium/index.ts`)

```bash
npm install react-native-purchases
```

Initialize in `App.tsx`:
```typescript
import Purchases from 'react-native-purchases';
Purchases.configure({ apiKey: 'YOUR_REVENUECAT_PUBLIC_KEY' });
```

Replace mock `getAvailablePackages` / `purchasePremium` / `restorePurchases`.

---

## Auth Setup

### Sign in with Apple
- Requires Apple Developer account
- Enable "Sign in with Apple" in App ID capabilities
- Add entitlement in Xcode

### Sign in with Google
- Create OAuth client in Google Cloud Console
- Add `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
- Set `webclientId` in `GoogleSignin.configure()`

---

## Build & Release

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

Update `extra.eas.projectId` in `app.json` with your EAS project ID.

---

## Future Roadmap

- [ ] Firebase Auth (Apple + Google)
- [ ] Firestore data sync
- [ ] Cloud Functions for server-side plant growth
- [ ] RevenueCat subscription
- [ ] AI routine recommendations
- [ ] Native widget support (iOS 16+)
- [ ] Push notifications for routine reminders
- [ ] Multiple language support

---

## License

Private — All rights reserved. © ULink
