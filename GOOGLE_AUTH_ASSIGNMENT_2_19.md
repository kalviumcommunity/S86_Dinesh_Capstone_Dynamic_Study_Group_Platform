# Assignment 2.19 Submission Guide

## Implemented Feature
- Google third-party authentication integration using Google Identity Services
- Backend Google ID token verification with `google-auth-library`
- JWT session issued after verified Google sign-in
- Existing app session and protected uploads work with Google-authenticated users

## Main Files
- backend/routes/user.js
- backend/models/User.js
- frontend/client/src/components/AuthPanel.jsx
- frontend/client/src/components/GoogleSignInButton.jsx
- frontend/client/src/components/TopBar.jsx
- frontend/client/.env.example
- backend/.env.example

## Configuration Required For Live Google Sign-In
- `backend/.env`: set `GOOGLE_CLIENT_ID`
- `frontend/client/.env`: set `VITE_GOOGLE_CLIENT_ID`

## PR Link Pattern
Create PR from:
- compare: feat/google-auth-integration
- base: main

## Codium Review Comment
Paste this exact line in PR comments:
@CodiumAI-Agent /review

## 3-Minute Video Flow
1. Show branch name feat/google-auth-integration.
2. Show Google auth backend route and token verification code.
3. Show GoogleSignInButton component and env example files.
4. Explain that GIS button becomes active when client IDs are configured.
5. Run the app and show the Google sign-in area in the auth panel.
6. If client IDs are configured, complete Google sign-in and show signed-in state.
7. Show that authenticated features remain available after Google login.
8. Open the PR and paste @CodiumAI-Agent /review.
9. Merge PR to main.

## Important Reminder
- Merge the PR before submission.
- Keep base branch as main.