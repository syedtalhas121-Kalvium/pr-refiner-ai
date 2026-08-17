## The Problem
As a developer shipping features rapidly, I constantly found myself staring at the pull request creation box after finishing a coding session, typing lazy one-line descriptions like "Fixed stuff". This tool solves that exact friction by automatically generating professional release notes from a git diff.

## Live Deployment
- **Frontend:** https://syedtalhas121-kalvium.github.io/pr-refiner-ai
- **Backend:** https://pr-refiner-ai-backend.onrender.com

## Security Confirmation
- **API Key:** The OpenAI API key is stored strictly in process.env on the backend (backend/server.js) and is never exposed or referenced in any frontend file.
