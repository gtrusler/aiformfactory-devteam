# Contributing Guide

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase CLI
- Git

### Environment Setup
1. Clone the repository
```bash
git clone [repository-url]
cd aiformfactory
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

## Coding Standards

### TypeScript
- Enable strict mode
- Use interfaces for object shapes
- Avoid `any` type
- Document complex types

### React
- Use functional components
- Implement proper error boundaries
- Memoize expensive computations
- Type all props

### State Management
- Use React Query for server state
- Context for global UI state
- Local state for component-specific data

## Review Process

### Before Submitting
1. Run all tests
2. Update documentation
3. Format code
4. Check for type errors

### Pull Request Guidelines
- Clear description of changes
- Link to related issues
- Include test coverage
- Update relevant docs

## Tools and Requirements

### Required Extensions
- ESLint
- Prettier
- TypeScript

### Code Quality
```bash
# Format code
npm run format

# Check types
npm run type-check

# Run tests
npm run test
```

## Git Workflow

### Branches
- main: production
- develop: development
- feature/*: new features
- fix/*: bug fixes

### Commits
- Use conventional commits
- Include ticket numbers
- Keep commits focused

## Testing

### Unit Tests
- Jest for logic
- React Testing Library for components
- 80% coverage minimum

### E2E Tests
- Cypress for critical paths
- Test main user flows
- Cross-browser testing
