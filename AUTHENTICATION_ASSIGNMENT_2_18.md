# Assignment 2.18 Submission Guide

## Implemented Feature
- Username/password registration
- Username/password login
- JWT-based authenticated session
- Protected `GET /api/users/me` endpoint
- Protected file upload tied to logged-in user
- Frontend login/register panel with persisted session

## Main Files
- backend/models/User.js
- backend/middleware/auth.js
- backend/routes/user.js
- backend/routes/uploads.js
- backend/models/Upload.js
- frontend/client/src/components/AuthPanel.jsx
- frontend/client/src/components/TopBar.jsx
- frontend/client/src/components/ResourceUploader.jsx
- frontend/client/src/App.jsx
- frontend/client/src/App.css

## Verified Flow
1. User registration works.
2. User login returns a token.
3. Protected `/api/users/me` works with Bearer token.
4. Protected upload works only after authentication.
5. Frontend build passes.

## PR Link Pattern
Create PR from:
- compare: feat/auth-username-password
- base: main

## Codium Review Comment
Paste this exact line in PR comments:
@CodiumAI-Agent /review

## 3-Minute Video Flow
1. Show branch name feat/auth-username-password.
2. Show User model with username and hashed password setup.
3. Show register/login routes and JWT auth middleware.
4. Show frontend AuthPanel and TopBar session state.
5. Run backend and frontend.
6. Register a user in the UI.
7. Log in and show signed-in state.
8. Upload a file after login and show that it succeeds as an authenticated action.
9. Open the PR and paste @CodiumAI-Agent /review.
10. Merge PR to main.

## Important Reminder
- Merge the PR before submission.
- Keep the base branch as main.