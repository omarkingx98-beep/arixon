# Arixon — Official Web Platform & Software Architecture

Precision software architecture engineered for modern business. Includes POS cashier platforms, educational center hubs, e-examination studios, and AI business suites.

---

## 1. Firebase Collections & Schema Overview

This application interacts with Cloud Firestore using the following collections and schemas:

1. **`users`**:
   - Path: `users/{userId}`
   - Fields: `uid`, `name`, `username`, `email`, `photoURL`, `birthdate`, `age`, `country`, `countryCode`, `countryFlag`, `phone`, `phoneDialCode`, `fullPhone`, `password`, `role` (`'admin'` | `'user'`), `profileCompleted`, `createdAt`, `lastLogin`.
   - Security: Users read/update their own profile document. Administrators have full access.

2. **`conversations` & subcollection `messages`**:
   - Path: `conversations/{userId}` and `conversations/{userId}/messages/{messageId}`
   - Fields: `userId`, `userName`, `userEmail`, `lastMessage`, `updatedAt`, `unreadByAdmin`, `unreadByUser`.
   - Security: Users only read/write messages in their own conversation. Admin communicates as `'admin'`.

3. **`projectRequests`**:
   - Path: `projectRequests/{requestId}`
   - Fields: `userId`, `name`, `email`, `phone`, `appType`, `budgetRange`, `timeline`, `description`, `status` (`'new'` | `'in_progress'` | `'done'`), `createdAt`.
   - Security: Authenticated clients submit requests tied to their `userId`. The project owner/admin reviews and updates statuses from `/admin`.

4. **`updates`**:
   - Path: `updates/{updateId}`
   - Fields: `titleAR`, `titleEN`, `bodyAR`, `bodyEN`, `createdAt`.
   - Security: Publicly readable by all visitors. Publishing, editing, and deletion is restricted to verified administrators (`isAdmin()`).

---

## 2. How to Deploy & Publish Firestore Security Rules

### Option A: Using Firebase CLI (Recommended)
1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in with your Google account:
   ```bash
   firebase login
   ```
3. Initialize or link your project:
   ```bash
   firebase use arixon-d5b4a
   ```
4. Deploy the rules directly:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option B: Via Firebase Console
1. Navigate to the [Firebase Console](https://console.firebase.google.com).
2. Select your project: **`arixon-d5b4a`**.
3. In the left navigation, click on **Firestore Database** > **Rules** tab.
4. Copy the exact contents of `firestore.rules` and paste it into the editor.
5. Click **Publish**.

---

## 3. How to Deploy the Application

### Deploying to Firebase Hosting
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Initialize Firebase Hosting (if not already initialized):
   ```bash
   firebase init hosting
   ```
   - Specify your public directory as: `dist`
   - Configure as a single-page app: `Yes`
   - Set up automatic builds: `No`
3. Deploy to production:
   ```bash
   firebase deploy --only hosting
   ```

### Deploying to Vercel / Netlify / Cloudflare Pages
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+ or 20+

---

## 4. How to Connect a Custom Domain & Add to Firebase Authorized Domains

To ensure Google Sign-In and Firebase Authentication work seamlessly with your custom domain (e.g. `arixon.app` or `www.arixon.app`):

### Step 1: Add Custom Domain to Firebase Hosting
1. In the [Firebase Console](https://console.firebase.google.com), open **Hosting**.
2. Click **Add custom domain** and enter your domain name (e.g. `arixon.app`).
3. Follow the DNS instructions to add the required `A` or `CNAME` records at your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.).
4. Firebase will automatically provision a free SSL certificate.

### Step 2: Add to Firebase Authorized Domains for Authentication
**CRITICAL**: Without this step, Google Sign-In will reject authentication from your custom domain with an `auth/unauthorized-domain` error.
1. Open the [Firebase Console](https://console.firebase.google.com).
2. Go to **Authentication** > **Settings** tab > **Authorized domains**.
3. Click **Add domain**.
4. Enter your exact domains:
   - `arixon.app`
   - `www.arixon.app`
   - Any staging/development domains (e.g. `*.run.app` or preview URLs).
5. Click **Save**.

---

## 5. Official Contacts & Channels
- **Founder**: Omar Shorab (عمر شراب)
- **Email**: `omarsharrabx99@gmail.com`
- **WhatsApp**: `+970 594 399 472`
- **GitHub**: `https://github.com/omarkingx98-beep`
- **Instagram**: `https://www.instagram.com/omarshurrab.1`
- **Facebook**: `https://www.facebook.com/share/1JB2eN8tBr/`
