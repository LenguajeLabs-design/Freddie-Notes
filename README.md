# Quiet Notes

A fast, calm, cross-device notes app built with React, TypeScript, Vite, Firebase Authentication, Cloud Firestore, and PWA support.

## Local preview

```sh
npm install
npm run dev
```

Without Firebase values, the app runs in a small local demo mode so the interface and offline-first editing flow can be previewed immediately.

## Connect Firebase

1. Create a Firebase web app and enable Google sign-in and Cloud Firestore.
2. Copy `.env.example` to `.env.local` and fill in the web app config.
3. Apply `firestore.rules` to the project.

Notes are stored at `users/{uid}/notes/{noteId}`. Firestore's multi-tab local cache and realtime listeners handle offline edits and cross-device updates.
