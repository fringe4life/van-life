# Git Commit Message Template

## Usage

Supply this file to the AI to generate a git commit message based on changes since the last commit. Messages use emoji bullet points for clarity and visual appeal.

## Format

The AI should:

1. Analyze the git diff to understand changes
2. Use the format: `type:\n` followed by emoji bullet points
3. Each change gets its own line with an appropriate emoji
4. Start with the commit type (feat, fix, refactor, docs, etc.) followed by a colon
5. Add a newline, then list changes as emoji bullets
6. Choose emojis that match the type of change
7. Keep each bullet point concise and descriptive
8. Prioritize the most impactful changes first

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

## Common Emojis

- 🔀 Routing, navigation, parallel/interception routes
- 🎯 Features, functionality
- 📝 Documentation, structure, updates
- 🔧 Configuration, setup
- ⚡ Performance, optimization
- 🐛 Bug fixes
- 🎨 UI, styling, components
- 📛 Badges, metadata
- 🔐 Auth, security
- 📦 Dependencies, packages
- ♻️ Refactoring, code quality
- 🗑️ Removal, deletion
- ✨ New functionality

## Examples

### Small Changes (1-5 files)

```
docs:
📛 Added tech stack badges with package versions
📝 Updated project structure documentation
```

```
fix:
🐛 Resolved session type inference errors
🔧 Updated auth helper types
```

### Medium Changes (6-15 files)

```
feat:
✨ Implemented password reset flow
📧 Added email verification with React Email
🔐 Created forgot-password action and form
```

### Large Changes (16-30 files)

```
refactor:
♻️ Converted all components to arrow functions
🎨 Migrated AlertDialog to Dialog component
🔀 Created shared auth content components
🎯 Preserved state on interception route refresh
📦 Updated dependencies
```

### Extensive Changes (30+ files)

```
refactor:
♻️ Converted 35+ components from function declarations to arrow functions
🔀 Implemented interception routes for auth modals with state preservation
🎯 Created shared page content components (sign-in, sign-up, forgot-password)
🎨 Applied 16 canonical CSS class optimizations (data-disabled, data-inset, min-w-32)
🔧 Configured Biome useArrowFunction linter rule in complexity group
🗑️ Removed AlertDialog component in favor of Dialog
📦 Updated project dependencies (bun.lock, package.json)
```

## Instructions for AI

1. Run `git diff` to see unstaged changes
2. Run `git diff --cached` to see staged changes
3. Run `git diff --stat` to see change summary
4. Analyze the changes and categorize them
5. Count files changed and lines modified
6. Generate a commit message:
   - Start with commit type and colon (e.g., `feat:`, `refactor:`, `docs:`)
   - Add a newline
   - List changes as emoji bullet points
   - Each change on its own line
   - Use relevant emojis from the common emojis list
   - Order by importance (most impactful first)
   - Keep bullet points concise and descriptive
7. Scale based on change size:
   - Small (1-5 files): 2-3 bullet points
   - Medium (6-15 files): 3-4 bullet points
   - Large (16-30 files): 5-7 bullet points
   - Extensive (30+ files): 7-10 bullet points
