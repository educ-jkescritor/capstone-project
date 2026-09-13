# Capstone Project Conventions

## Tech Stack
- **Runtime**: Node.js (LTS)
- **Language**: JavaScript/TypeScript
- **Version Control**: Git & GitHub

## Gemini Rules
- Always format Git commits using Conventional Commits guidelines (e.g., `feat:`, `fix:`, `docs:`, `build:`).
- Keep responses concise and focused on the deliverables.
- Use explicit markdown links for files and resources.
- For this project, any suggested code changes should strictly adhere to modern ES6+ standards.

## Frontend & Form Validation Rules
- **Robust Validation**: Always combine native HTML5 constraints (like `min` or `max`) with React state-driven validation (`useEffect` hooks) to ensure strict data correctness.
- **Accessible Feedback**: Provide explicit, inline text error messages (e.g., in red text below inputs) instead of relying on default browser popups, and visually disable submit buttons when forms are invalid.
- **Edge Case Handling**: Explicitly manage data edge cases in JavaScript logic (e.g., stripping time/hours when comparing local dates) to prevent false validation errors.
