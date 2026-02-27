# LabDDB Explore Bangladesh - Setup Instructions

## 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project: `labddb-explore-bd`.
3. Enable **Authentication** and activate **Google Sign-In**.
4. Create a **Firestore Database**.
5. Set the following **Firestore Security Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Register a Web App and copy the config to your `.env` file.

## 2. Authorized Domains (CRITICAL)
Firebase Authentication will fail unless you authorize the domains where the app is hosted.
1. Go to **Authentication > Settings > Authorized domains**.
2. Add the following domains:
   - `ais-dev-bcl6z23pefklopk7rbf6jm-312952556547.asia-east1.run.app`
   - `ais-pre-bcl6z23pefklopk7rbf6jm-312952556547.asia-east1.run.app`

## 3. Cloudinary Setup
1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. Go to **Settings > Upload**.
3. Add a new **Upload Preset**:
   - Name: `labddb_unsigned` (or any name you prefer).
   - Signing Mode: **Unsigned**.
   - Folder: `labddb-explore`.
4. Copy your **Cloud Name** and **Upload Preset** name to your `.env` file.

## 3. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```
