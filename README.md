# DH-Reporting Mobile App

A React Native mobile application for time tracking and project management, designed for Israeli companies with 5,000+ B2B employees. Built with Expo for cross-platform iOS and Android support.

## 📱 Features

- **Offline-First**: Full functionality without internet connection
- **Time Tracking**: Log work hours with project assignment
- **Project Management**: View assigned projects and track progress
- **Authentication**: Email-based OTP authentication with biometric support
- **Multi-Location**: Track work from Office, Home, Client Site, or Remote
- **Data Sync**: Automatic cloud synchronization when online
- **Real-time Reports**: View time entries and project analytics

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+ LTS** ([Download here](https://nodejs.org))
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Installation

```bash
# Clone the repository
git clone https://bitbucket.org/your-username/dh-reporting-mobile.git
cd dh-reporting-mobile

# Install dependencies
npm install

# Install shared library (local development)
npm install ../dh-reporting-shared

# Start the development server
npx expo start
```

### Running on Devices

```bash
# iOS Simulator (macOS only)
npx expo start --ios

# Android Emulator  
npx expo start --android

# Physical device with Expo Go
# Scan QR code from terminal with your phone
npx expo start
```

## 🏗️ Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/        # Shared components (Button, Input, Card)
│   ├── forms/         # Form-specific components
│   └── navigation/    # Navigation components
├── screens/           # Application screens
│   ├── auth/         # Authentication screens
│   │   ├── SignInScreen.js
│   │   ├── SignUpScreen.js
│   │   └── OTPScreen.js
│   └── main/         # Main app screens
│       ├── DashboardScreen.js
│       ├── TimeEntryScreen.js
│       └── ProfileScreen.js
├── services/          # Business logic and API calls
│   ├── authService.js
│   ├── projectService.js
│   ├── timeEntryService.js
│   └── syncService.js
├── database/          # Local SQLite database
│   ├── database.js
│   ├── migrations/
│   ├── services/
│   └── seeds/
├── stores/           # Zustand state management
│   ├── authStore.js
│   ├── projectStore.js
│   └── appStore.js
├── navigation/       # Navigation configuration
│   ├── AppNavigator.js
│   ├── AuthNavigator.js
│   └── MainNavigator.js
├── styles/           # Styling and themes
│   ├── theme.js
│   ├── globalStyles.js
│   └── colors.js
├── utils/            # Utility functions
│   ├── storage.js
│   ├── dateHelpers.js
│   └── validators.js
├── constants/        # App constants
│   ├── config.js
│   ├── routes.js
│   └── strings.js
└── assets/           # Images, fonts, icons
    ├── images/
    ├── icons/
    └── fonts/
```

## 🛠️ Technology Stack

### Core Technologies
- **React Native 0.72+** - Cross-platform mobile framework
- **Expo ~49.0** - Development platform and toolkit
- **JavaScript ES6+** - Programming language

### Navigation & State
- **React Navigation 6** - Screen routing and navigation
- **Zustand** - Lightweight state management
- **React Query** - Server state and caching

### Database & Storage
- **SQLite** (Expo SQLite) - Local database
- **AsyncStorage** - Key-value storage
- **Expo SecureStore** - Secure credential storage

### UI & Interaction
- **React Native Safe Area Context** - Safe area handling
- **React Native Gesture Handler** - Touch gestures
- **React Native SVG** - Vector graphics and charts
- **Expo Vector Icons** - Icon library

### Development Tools
- **Jest** - Testing framework
- **ESLint + Prettier** - Code quality
- **React Native Testing Library** - Component testing

## 🔧 Development

### Environment Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your configuration
   ```

3. **Initialize database**:
   ```bash
   # Database will be created automatically on first run
   # Sample data will be seeded in development mode
   ```

### Development Workflow

```bash
# Start development server
npm start

# Start with specific platform
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser (for testing)

# Run tests
npm test           # Run all tests
npm run test:watch # Run tests in watch mode

# Code quality
npm run lint       # ESLint checking
npm run format     # Prettier formatting
```

### Building the App

```bash
# Development build
npx eas build --profile development --platform all

# Production build  
npx eas build --profile production --platform all

# Local build (for testing)
npx expo run:ios
npx expo run:android
```

## 📊 Development Phases

### Phase 1: Offline Mobile (Current)
- ✅ Local SQLite database
- ✅ Mock authentication system
- ✅ Complete offline functionality
- ✅ Time tracking and project management

### Phase 2: Cloud Integration (Next)
- 🔄 AWS Cognito authentication
- 🔄 Real email OTP delivery
- 🔄 Cloud API integration
- 🔄 Data synchronization

### Phase 3: Production (Future)
- 📱 App Store deployment
- 📊 Analytics and monitoring
- 🔔 Push notifications
- 🌐 Multi-language support

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm test

# Component tests
npm run test:components

# Integration tests  
npm run test:integration

# E2E tests (when available)
npm run test:e2e
```

### Testing Strategy

- **Unit Tests**: Individual functions and utilities
- **Component Tests**: React Native components
- **Integration Tests**: Database operations and services
- **Manual Testing**: User flows on physical devices

## 📱 Device Support

### iOS
- **Minimum**: iOS 12.0+
- **Recommended**: iOS 15.0+
- **Devices**: iPhone 8 and newer

### Android
- **Minimum**: Android API 21 (5.0)
- **Recommended**: Android API 28+ (9.0+)
- **Devices**: Most Android devices from 2016+

## 🔐 Security Features

- **Biometric Authentication**: Touch ID / Face ID support
- **Secure Storage**: Encrypted credential storage
- **Data Encryption**: Local data encryption
- **OTP Verification**: Email-based authentication
- **Offline Security**: Local data protection

## 🌐 Environment Configuration

### Development
```javascript
// Local SQLite database
// Mock authentication
// Debug logging enabled
// Hot reload enabled
```

### Production
```javascript
// AWS cloud services
// Real authentication
// Analytics enabled
// Optimized performance
```

## 📋 Scripts

```json
{
  "start": "expo start",
  "ios": "expo start --ios", 
  "android": "expo start --android",
  "web": "expo start --web",
  "test": "jest",
  "test:watch": "jest --watch",
  "lint": "eslint src/ --ext .js,.jsx",
  "format": "prettier --write 'src/**/*.{js,jsx,json}'",
  "build:ios": "eas build --platform ios",
  "build:android": "eas build --platform android"
}
```

## 🐛 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx expo start --clear
```

**iOS simulator not starting:**
```bash
# Reset iOS simulator
npx expo start --ios --clear
```

**Android emulator issues:**
```bash
# Start Android emulator manually from Android Studio
# Then run: npx expo start --android
```

**Dependencies issues:**
```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install
```

### Performance Issues

- **Check bundle size**: Use `npx expo build:web` to analyze
- **Optimize images**: Use WebP format for better compression
- **Database queries**: Monitor SQLite query performance
- **Memory usage**: Use React DevTools for profiling

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** with appropriate tests
4. **Run tests**: `npm test`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**

### Code Standards

- Follow **ESLint** configuration
- Use **Prettier** for formatting
- Write **tests** for new features
- Update **documentation** as needed
- Use **conventional commits**

## 📄 License

Private - Internal company use only

## 🔗 Related Repositories

- [dh-reporting-shared](../dh-reporting-shared) - Shared utility library
- [dh-reporting-web](../dh-reporting-web) - Web dashboard (future)

## 📞 Support

For technical support or questions:

1. **Check documentation** and troubleshooting guide
2. **Search existing issues** in the repository  
3. **Create new issue** with detailed description
4. **Contact development team** for urgent matters

## 🎯 Roadmap

- ✅ **Q1 2024**: Offline mobile app with local database
- 🔄 **Q2 2024**: Cloud integration and real-time sync
- 📱 **Q3 2024**: App Store deployment and production launch
- 🌐 **Q4 2024**: Web dashboard and advanced analytics

---

**Built with ❤️ using React Native and Expo**