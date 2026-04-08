# 📡 API Documentation

This document provides details for all the REST endpoints and WebSocket behavior of the application.

## 🔑 Authentication (`/api/users`)

All authentication routes are prefixed with `/api/users`.

### 1. Register User
- **Endpoint**: `/signUp`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **Description**: Creates a new user account. Triggers a 6-digit OTP to be sent to the user's email.

### 2. Sign In
- **Endpoint**: `/signIn`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **Response**:
  ```json
  {
    "message": "You are successfully Logined",
    "token": "jwt_token_here",
    "expiresInMs": 3600000
  }
  ```

### 3. Verify Account
- **Endpoint**: `/verifyUser`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```
- **Description**: Verifies the user's email address using the OTP code.

### 4. Forgot Password
- **Endpoint**: `/forgetPassword`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Description**: Requests a password reset OTP code.

### 5. Verify Reset Password
- **Endpoint**: `/verifyResetPassword`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```
- **Description**: Validates the OTP for a password reset request.

### 6. Reset Password
- **Endpoint**: `/resetPassword`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "NewPassword123!"
  }
  ```
- **Description**: Updates the user's password. Requires prior OTP verification.

---

## 📱 QR Code (`/api/qr`)

### 1. Get Current QR
- **Endpoint**: `/current`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "data": {
      "uuid": "e4534944-21b1-47b8-9b21-8a9159f1c6fe",
      "generatedAt": 1775606007000
    }
  }
  ```

---

## ⚡ WebSocket
- **URL**: `ws://<your-ip>:3000?token=<jwt-token>`
- **Behavior**: Broadcasts a new QR payload every 60 seconds to all connected authenticated clients.
- **Payload Format**:
  ```json
  {
    "uuid": "random-uuid-here",
    "generatedAt": 1775606445000
  }
  ```
