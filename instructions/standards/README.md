# Coding Standards

## TypeScript

- Use strict type checking
- Avoid 'any' type
- Use interface for objects
- Use type for unions/intersections

## React

- Functional components with FC type
- Custom hooks for shared logic
- Memoization for expensive operations
- Props interface for each component

## State Management

- Use hooks for local state
- Context for shared state
- Avoid prop drilling

## Styling

- Use Tailwind utility classes
- shadcn/ui components
- Custom components extend shadcn

## File Organization

- Feature-based structure
- Shared components in /ui
- Utilities in /lib
- Types in types.ts

## Git Practices

- Conventional commits
- Feature branches
- PR templates
- Linear history

## Testing

- Unit tests for utilities
- Component testing with Vitest
- E2E with Playwright
