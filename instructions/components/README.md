# Component Structure Guidelines

## Folder Structure

- One component per file
- Index.ts for exports
- Styles in component file using Tailwind
- Types in separate types.ts

## Naming Conventions

- PascalCase for component files
- camelCase for utilities
- kebab-case for CSS classes

## Component Template

```tsx
import { type FC } from 'react'

interface ComponentProps {
  // Props here
}

export const Component: FC<ComponentProps> = ({ /* props */ }) => {
  return (
    // JSX here
  )
}
```
