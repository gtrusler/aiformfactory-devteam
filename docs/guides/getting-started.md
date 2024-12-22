# Getting Started with AI Form Factory

## Prerequisites

- Python 3.11 or higher
- Conda package manager
- Git

## Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/gtrusler/aiformfactory-devteam.git
cd aiformfactory-devteam
```

2. Create and activate the conda environment:

```bash
conda env create -f environment.yml
conda activate aiformfactory-env
```

## Project Structure

```
aiformfactory-devteam/
├── docs/            # Documentation
├── tests/           # Test files
├── scripts/         # Utility scripts
├── lib/             # Core library code
├── components/      # React components
└── types/          # TypeScript type definitions
```

## Development Workflow

1. Create a new branch for your feature
2. Make your changes
3. Run tests
4. Submit a pull request

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run test`: Run tests

## Environment Variables

Create a `.env` file in the root directory with:

```env
# Required variables will be listed here
```

## Additional Resources

- [API Documentation](../api/README.md)
- [Contributing Guide](../../CONTRIBUTING.md)
- [Code of Conduct](../../CODE_OF_CONDUCT.md)
