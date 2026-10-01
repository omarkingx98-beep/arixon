# Erikson — Firebase Setup & Deployment Guide

This application is connected to the project: `arixon-d5b4a`.

## 1. Firebase Authentication Settings
In your [Firebase Console](https://console.firebase.google.com/project/arixon-d5b4a/authentication/providers):
1. Enable **Email/Password** sign-in provider.
2. Enable **Google** sign-in provider.
   - Authorized domains: Ensure your domains (e.g., `arixon-d5b4a.firebaseapp.com`, `localhost`, and any custom domain) are listed under Authorized domains.

## 2. Cloud Firestore Rules
1. Go to [Firestore Database > Rules](https://console.firebase.google.com/project/arixon-d5b4a/firestore/rules).
2. Copy and paste the contents of `firestore.rules`.
3. Click **Publish**.

## 3. Administrator Access
- The designated admin email is: `omarkingx99@gmail.com`.
- When signed in with this email, the **Admin Dashboard** button appears in the navbar menu and at the `/admin` or `#admin` route.
- The admin dashboard features live 2-way real-time messaging, unread notifications, and a full searchable users database with age, country, phone, and username.

## 4. Deploying to Firebase Hosting
```bash
# 1. Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Build the production bundle
npm run build

# 4. Deploy hosting & rules
firebase deploy
```
