# Yllure - Dress Rental Mobile App

A beautiful React Native + Expo mobile application for dress rental services, featuring elegant design and seamless user experience.

## 🚀 Getting Started

### Prerequisites

Before running the project locally, ensure you have the following installed:

1. **Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm or yarn** (npm comes with Node.js)
   - Verify installation: `npm --version`

3. **Expo CLI** (optional but recommended)
   ```bash
   npm install -g @expo/cli
   ```

4. **Expo Go app** on your mobile device
   - iOS: Download from App Store
   - Android: Download from Google Play Store

### Installation

1. **Clone or download the project** (if you haven't already)

2. **Navigate to the project directory**
   ```bash
   cd your-project-directory
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   or if you prefer yarn:
   ```bash
   yarn install
   ```

### Running the Project

#### Option 1: Using Expo CLI (Recommended)

1. **Start the development server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   npx expo start
   ```

2. **Choose your platform:**
   - **Web**: Press `w` in the terminal or visit the URL shown
   - **iOS Simulator**: Press `i` (requires Xcode on macOS)
   - **Android Emulator**: Press `a` (requires Android Studio)
   - **Physical Device**: Scan the QR code with Expo Go app

#### Option 2: Platform-Specific Commands

- **Web only**: `npm run web`
- **iOS only**: `npm run ios`
- **Android only**: `npm run android`

### Development Workflow

1. **Make changes** to your code
2. **Save files** - the app will automatically reload
3. **Use the development menu** by shaking your device or pressing `m` in terminal
4. **Debug** using React Native Debugger or browser dev tools

### Project Structure

```
├── app/                    # App routes (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth/              # Authentication screens
│   ├── dress/             # Dress detail screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── constants/             # Theme and constants
├── context/               # React Context providers
├── hooks/                 # Custom hooks
├── services/              # API services
├── store/                 # State management (Zustand)
├── types/                 # TypeScript type definitions
└── assets/                # Images and static files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build:web` - Build for web production
- `npm run lint` - Run ESLint

### Features

- 🎨 **Elegant Design** - Luxury fashion-focused UI
- 📱 **Cross-Platform** - iOS, Android, and Web
- 🔍 **Search & Filter** - Find dresses by size, availability
- ❤️ **Wishlist** - Save favorite dresses
- 📸 **Camera Integration** - Profile photo functionality
- 🔐 **Authentication** - User login/logout
- 💾 **Offline Support** - AsyncStorage for data persistence

### Troubleshooting

#### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **Node modules issues**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **iOS Simulator not opening**
   - Ensure Xcode is installed (macOS only)
   - Check iOS Simulator is available

4. **Android Emulator not opening**
   - Ensure Android Studio is installed
   - Create and start an Android Virtual Device (AVD)

5. **Expo Go connection issues**
   - Ensure your device and computer are on the same network
   - Try restarting the Expo development server

#### Platform-Specific Notes

- **Web**: Runs in browser, some native features may not work
- **iOS**: Requires macOS for iOS Simulator
- **Android**: Works on all platforms with Android Studio

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

### Building for Production

#### Web
```bash
npm run build:web
```

#### Mobile Apps
For mobile app builds, you'll need to use EAS Build:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Configure and build:
   ```bash
   eas build --platform all
   ```


### Support

If you encounter any issues:

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Search [Expo forums](https://forums.expo.dev/)
3. Check [React Native documentation](https://reactnative.dev/)
