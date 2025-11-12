# Framez

A modern social media mobile application built with React Native and Expo, featuring real-time updates and secure authentication.

## 📱 Features

- **User Authentication** - Secure signup and login with Convex Auth
- **Social Feed** - Browse and interact with posts from other users
- **Create Posts** - Share content with text and images
- **User Profiles** - Personalized user profiles with avatars
- **Real-time Updates** - Live data synchronization across devices
- **Cross-Platform** - Works on iOS, Android, and Web

## 🛠️ Tech Stack

- **Frontend Framework**: React Native 0.81.5 with Expo ~54.0
- **Navigation**: Expo Router ~6.0 (File-based routing)
- **Backend & Database**: Convex (Real-time database)
- **Authentication**: Convex Auth with @auth/core
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **UI Components**: 
  - React Native Reanimated (Animations)
  - React Native Gesture Handler
  - Expo Image & Image Picker
- **State Management**: React hooks with Convex queries
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator
- Convex account ([convex.dev](https://convex.dev))

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd framez
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Convex

```bash
npx convex dev
```

This will:
- Create a new Convex project (if needed)
- Generate your deployment URL
- Initialize the development environment

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
# Convex
EXPO_PUBLIC_CONVEX_URL=<your-convex-deployment-url>

# Convex Auth (optional, for OAuth providers)
AUTH_GITHUB_ID=<your-github-oauth-id>
AUTH_GITHUB_SECRET=<your-github-oauth-secret>
AUTH_GOOGLE_ID=<your-google-oauth-id>
AUTH_GOOGLE_SECRET=<your-google-oauth-secret>
```

> **Note**: Your Convex URL will be automatically generated when you run `npx convex dev`

### 5. Push Convex schema

```bash
npx convex dev
```

Keep this running in a separate terminal - it watches for changes to your Convex functions.

## 🚀 Running Locally

### Start the development server

```bash
npm start
```

### Run on specific platforms

```bash
# iOS (Mac only)
npm run ios

# Android
npm run android

# Web
npm run web
```

### Development workflow

1. Keep `npx convex dev` running in one terminal
2. Run `npm start` in another terminal
3. Press `i` for iOS, `a` for Android, or `w` for Web

## 📁 Project Structure

```
framez/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/            # Main tab navigation
│   │   ├── index.tsx      # Feed screen
│   │   ├── profile.tsx    # Profile screen
│   │   └── _layout.tsx
│   └── (modals)/          # Modal screens
│       └── createPostModal.tsx
├── components/            # Reusable components
│   └── ThemedComponents/  # Themed UI components
├── convex/               # Convex backend
│   ├── lib/
│   │   └── users.ts      # User queries/mutations
│   ├── posts.ts          # Post schema & functions
│   └── auth.config.ts    # Auth configuration
├── assets/               # Images and static files
└── package.json
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_CONVEX_URL` | Your Convex deployment URL | ✅ Yes |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID | ❌ Optional |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Secret | ❌ Optional |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | ❌ Optional |
| `AUTH_GOOGLE_SECRET` | Google OAuth Secret | ❌ Optional |


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Web version may have limited functionality with native modules
- Image picker requires physical device for full functionality

