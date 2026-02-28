# UserAuthenticationApp

React Native authentication demo app with:
- Login and Signup flows
- Global auth state via React Context API
- Persistent session/user data using AsyncStorage
- Navigation between Login, Signup, and Home screens
- Form handling with React Hook Form

## Implemented Features

### 1) Authentication Context

`src/context/AuthContext.tsx` provides:
- `user`: current logged-in user (`name`, `email`)
- `isLoading`: startup session restore state
- `login(data)`
- `signup(data)`
- `logout()`

Behavior:
- Restores session from AsyncStorage on app startup
- Stores registered users in AsyncStorage
- Stores current logged-in user in AsyncStorage
- On logout, clears current session

### 2) Login Screen

`src/screens/Login/index.tsx`
- Fields: Email, Password
- Used React Hook Form validation
- Password visibility toggle (eye icon)
- Focus highlight on active field
- Error handling:
	- Invalid email format
	- Password too short
	- User not found
	- Incorrect credentials
- Navigation to Signup

### 3) Signup Screen

`src/screens/Signup/index.tsx`
- Fields: Name, Email, Password
- Used React Hook Form validation
- Password visibility toggle (eye icon)
- Focus highlight on active field
- Error handling:
	- Missing fields
	- Invalid email format
	- Password length < 6
	- Duplicate email account
- Navigation back to Login

### 4) Home Screen

`src/screens/Home/index.tsx`
- Displays logged-in user `name` and `email`
- Logout button to end session and return to auth flow

### 5) Navigation

`src/navigation/AppNavigator.tsx`
- If `user` exists: shows Home
- If `user` is null: shows Login/Signup stack

## Setup Instructions

## 1) Install dependencies
From project root: npm install

## 2) iOS only: install pods
cd ios && bundle install && bundle exec pod install && cd ..

## 3) Start Metro
npm start

## 4) Run the app
Android: npm run android
iOS: npm run ios

## Project Structure

src/
	context/
		AuthContext.tsx
	navigation/
		AppNavigator.tsx
		types.ts
	screens/
		Login/
			index.tsx
			styles.tsx
		Signup/
			index.tsx
			styles.tsx
		Home/
			index.tsx
			styles.tsx

## Notes

- This app stores credentials in AsyncStorage for demo purposes only.
- In production, we use secure storage and proper backend authentication.