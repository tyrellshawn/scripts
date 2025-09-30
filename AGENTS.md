# Agent Guidelines for Scripts Repository

## Build/Lint/Test Commands

### Testing
- **Run Firebase service account test**: `node firebase/test-service-account.js`
- **Run Firebase setup test**: `./firebase/test-firebase.sh`
- **Run single test file**: `node <test-file>.js` (e.g., `node firebase/test-service-account.js`)

### Build/Setup
- **Firebase service account setup**: `node firebase/setup-service-account.js <service-account.json>`
- **Quick Firebase setup**: `./firebase/firebase.sh <service-account.json>`

### Linting
- No specific linting tools configured. Follow code style guidelines below.

## Code Style Guidelines

### JavaScript/Node.js
- **Imports**: Use ES6 imports at top of file
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Error Handling**: Use try/catch blocks with descriptive error messages
- **Comments**: JSDoc style for functions, inline comments for complex logic
- **Formatting**: 2-space indentation, semicolons required
- **Async**: Use async/await pattern, proper error propagation

### Python
- **Imports**: Standard library first, then third-party, then local
- **Naming**: snake_case for variables/functions, PascalCase for classes
- **Functions**: Clear, descriptive names with docstrings
- **Error Handling**: Use try/except with specific exceptions
- **Formatting**: 4-space indentation, consistent spacing

### Bash/Shell Scripts
- **Shebang**: `#!/bin/bash` or `#!/usr/bin/env node`
- **Functions**: Use function declarations with clear names
- **Error Handling**: Check exit codes, use `set -e` for strict mode
- **Variables**: Use descriptive names, quote variables
- **Formatting**: Consistent indentation, clear structure

### Fish Shell
- **Abbreviations**: Use `abbr` for common commands
- **Functions**: Clear function definitions with proper scoping
- **Environment**: Use `set -gx` for global exports
- **Formatting**: Clean, readable configuration

### General Conventions
- **File Structure**: Logical organization by functionality
- **Documentation**: README files for complex directories
- **Security**: Never commit secrets or service account files
- **Testing**: Follow test levels framework (unit/integration/E2E)
- **Commits**: Clear, descriptive commit messages