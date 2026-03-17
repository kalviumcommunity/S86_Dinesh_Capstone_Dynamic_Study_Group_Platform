# Assignment 2.17 Submission Guide

## Implemented Feature
- Backend file upload API using Multer and MongoDB metadata storage
- Static serving for uploaded files
- Frontend upload form with uploaded resource list

## Main Files
- backend/server.js
- backend/routes/uploads.js
- backend/models/Upload.js
- frontend/client/src/components/ResourceUploader.jsx
- frontend/client/src/App.jsx
- frontend/client/src/App.css

## Verified Behavior
- Upload POST works
- Upload list GET works
- Uploaded file URL opens successfully
- Frontend production build passes

## PR Link Pattern
Create PR from:
- compare: feat/file-upload-functionality
- base: main

## Codium Review Comment
Paste this exact comment in PR comments:
@CodiumAI-Agent /review

## 3-Minute Video Flow
1. Show branch name feat/file-upload-functionality.
2. Show backend upload route and Multer setup.
3. Show frontend ResourceUploader component.
4. Run backend and frontend.
5. Upload a sample file in the app.
6. Show uploaded file list and open the uploaded file.
7. Open PR page and paste @CodiumAI-Agent /review.
8. Merge PR after review.

## Important Reminder
- Merge the PR before submission.
- Ensure the base branch is main.