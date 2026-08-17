# GitDiff → PR Description Writer

## The Problem
As a developer shipping features rapidly, I constantly found myself staring at the pull request creation box after finishing a coding session, typing lazy one-line descriptions like "Fixed stuff" or "Updated server code". Writing detailed release notes, bullet points of changes, and testing instructions felt like tedious friction after hours of deep work. My team lead consistently rejected these pull requests, demanding proper context. I built this tool so that developers can paste their raw `git diff` and instantly receive a professional, structured pull request description explaining what changed, why it was done, and how to test it.

## What It Does
The application provides a seamless workflow where the user pastes a raw `git diff` into the frontend interface. The frontend securely transmits the diff to an Express backend server. The backend invokes the OpenAI API (`openai/gpt-4o-mini`) with a specialized technical prompt designed to parse code modifications. The AI parses the patch, extracts the underlying intent, and generates a structured Markdown pull request description comprising conventional commit titles, change summaries, engineering rationale, and review instructions, which the user can copy with a single click.

## AI Integration
The core AI processing relies on the OpenAI API utilizing the `openai/gpt-4o-mini` model. The API call is strictly executed on the backend within `backend/server.js` inside the `POST /api/generate-pr` route handler, ensuring that API keys and sensitive credentials remain secure and never exposed on the frontend client. The AI transforms raw git diff code patches into professional, structured Markdown pull request descriptions.

## What I Intentionally Excluded
I intentionally omitted user accounts and authentication because the application is stateless and session-based, and adding authentication would triple development time without adding core value to a quick pull request description generator. Furthermore, direct GitHub API integration to automatically open pull requests was excluded to maintain a focused, lightweight workflow centered on instant diff summarization. Finally, a complex multi-file visual diff viewer was omitted in favor of a clean text input area to keep the product robust and performant.

## Monthly Cost Calculation
Economic viability and engineering foresight require calculating the exact operational cost of AI integration before deployment. The arithmetic for running the model is structured as follows.

| Cost Component | Parameter Value | Calculation |
| :--- | :--- | :--- |
| **Model & Rates** | `openai/gpt-4o-mini` | Input: $0.15 / 1M tokens, Output: $0.60 / 1M tokens |
| **Token Usage / Call** | ~800 input + ~300 output | 1,100 total tokens per invocation |
| **Cost Per Call** | Input + Output cost | $(800 \times 0.00000015) + (300 \times 0.00000060) = \$0.000300$ |
| **Monthly Volume** | 200 requests / month | Estimated developer usage |
| **Monthly Total** | Volume $\times$ Cost per call | $200 \times \$0.000300 = \$0.06$ per month |

## Live Deployment
Both the frontend and backend components are deployed and accessible via public URLs:
* **Frontend:** `https://pr-refiner-ai.onrender.com`
* **Backend:** `https://pr-refiner-ai-backend.onrender.com`
