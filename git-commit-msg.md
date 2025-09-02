# Git Commit Message Template

## Usage
Supply this file to the AI to generate a 140-character git commit message based on changes since the last commit.

## Format
The AI should:
1. Analyze the git diff to understand changes
2. Create a concise commit message under 140 characters
3. Use conventional commit format: `type: description`
4. Focus on the most significant changes
5. Use commas instead of dashes between items (per user preference)

## Commit Types
- `feat`: New features
- `fix`: Bug fixes
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes
- `test`: Test changes
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

## Examples
- `refactor: remove duplicate metadata titles, update deps, restructure auth routes`
- `feat: add user authentication, implement password reset flow`
- `fix: resolve type errors, update component props, improve error handling`

## Instructions for AI
1. Run `git diff` to see unstaged changes
2. Run `git diff --cached` to see staged changes
3. Analyze the changes and categorize them
4. Generate a concise, descriptive commit message
5. Ensure the message is under 140 characters
6. Use conventional commit format with appropriate type
7. Focus on the most impactful changes
