# ⚙️ Setup Instructions

Follow these steps to get the application running on your local machine.

## 📋 Prerequisites
- **Node.js**: v18 or higher.
- **pnpm**: Recommended package manager.
- **MongoDB**: Running locally or a MongoDB Atlas URI.
- **Expo Go**: Installed on your mobile device for testing.

---

## 🖥️ 1. Backend Setup (Server)

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Configure Environment Variables**:
   Create a file named `config.env` in the `server` directory and add your configurations:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/qr-auth  # Your DB URI
   JWT_KEY=your_secret_key                     # Any secure string
   JWT_EXPIRES=1h
   JWT_EXPIRES_IN_MS=3600000                   # Matches JWT_EXPIRES
   GMAIL_USER=your-email@gmail.com             # For OTP emails
   GMAIL_PASS=your-app-password                # Gmail App Password
   ```
4. **Start the server**:
   ```bash
   pnpm run dev
   ```
   The server will start on `http://localhost:3000`.

---

## 📱 2. Frontend Setup (Expo Client)

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Configure the Server IP**:
   Open `client/api/index.ts` and set the `BASE_IP` to your machine's local IP address (e.g., `192.168.1.5`). 
   > **Note**: Do not use `localhost` if you are testing on a physical device or Android emulator.
   ```typescript
   export const BASE_IP = "YOUR_LOCAL_IP";
   ```
4. **Start the Expo project**:
   ```bash
   npx expo start
   ```
5. **Run the app**:
   - Use the **Expo Go** app to scan the QR code from the terminal.
   - Or press `a` for Android or `i` for iOS to start the emulator.
