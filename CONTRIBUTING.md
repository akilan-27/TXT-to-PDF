# Contributing to TXT to PDF Pro

First off, thank you for considering contributing to TXT to PDF Pro!

## Development Workflow

1. **Branching Strategy**
   - `main` - Production-ready code only
   - `development` - Active development and integration
   - `feature/*` - New features
   - `bugfix/*` - Bug fixes
   - `docs/*` - Documentation updates

2. **Making Changes**
   - Create a branch from `development`
   - Run `npm run dev` to start the local server
   - Make your changes following the coding standards

3. **Coding Standards**
   - ES Modules only
   - Follow Prettier formatting (`npm run format`)
   - Ensure ESLint passes (`npm run lint`)
   - Write Vitest unit tests for new logic
   - Use CSS custom properties for styling (no hardcoded colors)

4. **Committing**
   Follow Conventional Commits format:
   - `feat:` A new feature
   - `fix:` A bug fix
   - `docs:` Documentation only changes
   - `style:` Changes that do not affect the meaning of the code
   - `refactor:` A code change that neither fixes a bug nor adds a feature
   - `test:` Adding missing tests or correcting existing tests

5. **Pull Requests**
   - Push to your branch and open a PR against `development`
   - Ensure CI checks pass (lint, test, build)
   - Fill out the PR template describing your changes

## Definition of Done
Before a task is considered complete, ensure:
- [ ] Code is implemented
- [ ] Lint passes
- [ ] Tests pass
- [ ] No console errors
- [ ] Responsive and Accessible
- [ ] Feature tested across browsers
