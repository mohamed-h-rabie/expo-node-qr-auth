# Expo Node.js QR Auth System

A full-stack mobile application built with Expo (React Native) and Node.js. The system features a robust authentication flow and a real-time rotating QR code system updated via both HTTP polling and WebSockets.

## 🚀 Features

- **Full Auth Flow**: Sign Up, Sign In, Fingerprint/FaceID login, and Password Reset with OTP.
- **Themed UI**: Complete Light and Dark mode support across all screens.
- **Rotating QR Code**: Secure UUID-based QR code that refreshes every 60 seconds.
- **Real-time Updates**: Dual implementation using HTTP Polling and WebSockets.
- **Security**: JWT-based authentication, bcrypt password hashing, and input validation with Zod.

---

## 🛠️ Tech Stack

### Frontend (Mobile)
- **Framework**: Expo SDK 55 (React Native)
- **Navigation**: Expo Router (File-based)
- **State Management**: Context API (SessionProvider)
- **Data Fetching**: TanStack Query (React Query)
- **Validation**: Zod + React Hook Form
- **Storage**: Expo SecureStore (Encrypted)
- **Real-time**: WebSocket API
- **Theming**: Custom ThemeProvider with Core Palette

### Backend (Server)
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: `ws` (WebSockets)
- **Authentication**: JWT (JSON Web Tokens)
- **Mailing**: Nodemailer (Gmail)

---

## 📦 Dependencies

### Backend
- `express`: ^4.21.2
- `mongoose`: ^8.19.1
- `jsonwebtoken`: ^9.0.2
- `bcrypt`: ^6.0.0
- `nodemailer`: ^7.0.10
- `ws`: ^8.20.0
- `otp-generator`: ^4.0.1

### Frontend
- `expo`: ~55.0.11
- `expo-router`: ~55.0.10
- `expo-secure-store`: ^55.0.11
- `@tanstack/react-query`: ^5.90.11
- `zod`: ^4.1.12
- `react-native-qrcode-svg`: ^6.3.21
- `lucide-react-native`: ^0.553.0

---

## ⚙️ Setup Instructions

### 1. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `config.env` file in the root of the `server` directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/qr-auth
   JWT_KEY=your_secret_key
   JWT_EXPIRES=1h
   JWT_EXPIRES_IN_MS=3600000
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASS=your-app-password
   ```
4. Start the server:
   ```bash
   pnpm run dev
   ```

### 2. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. **Important**: Update the API IP address in `api/index.ts` to match your machine's local IP. This single change will update all API calls in the application.
4. Start the app:
   ```bash
   npx expo start
   ```

---

## 📡 API Documentation

### Authentication (`/api/users`)

| Endpoint | Method | Body | Description |
| :--- | :--- | :--- | :--- |
| `/signUp` | POST | `{ name, email, password }` | Register a new user (triggers OTP) |
| `/signIn` | POST | `{ email, password }` | Authenticate user & get JWT |
| `/verifyUser` | POST | `{ email, otp }` | Verify account after registration |
| `/forgetPassword` | POST | `{ email }` | Request password reset OTP |
| `/verifyResetPassword` | POST | `{ email, otp }` | Verify OTP for password reset |
| `/resetPassword` | POST | `{ email, password }` | Set new password |
| `/me` | GET | `Headers: { Authorization: Bearer <token> }` | Get current user profile |

### QR Code (`/api/qr`)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/current` | GET | Get the currently active QR UUID (Protected) |

### WebSocket
- **URL**: `ws://<your-ip>:3000?token=<jwt-token>`
- **Behavior**: Broadcasts a new QR payload `{ uuid: string, generatedAt: number }` every 60 seconds to all connected clients.