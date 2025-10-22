# Frontend Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layouts/            # Layout components (Header, Footer, Sidebar)
│   │   └── features/           # Feature-specific components
│   ├── lib/
│   │   ├── graphql/            # GraphQL client setup and queries
│   │   └── utils/              # Utility functions
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   ├── contexts/               # React Context providers
│   ├── services/               # API services and business logic
│   └── __tests__/              # Test files
├── public/                     # Static assets
├── jest.config.js              # Jest configuration
├── jest.setup.js               # Jest setup file
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Folder Descriptions

- **app/**: Next.js 13+ App Router - contains routes and page components
- **components/ui/**: Reusable UI components from shadcn/ui
- **components/layouts/**: Layout wrappers (header, footer, navigation)
- **components/features/**: Feature-specific components organized by domain
- **lib/graphql/**: GraphQL client configuration and query/mutation definitions
- **lib/utils/**: Helper functions and utilities
- **hooks/**: Custom React hooks for shared logic
- **types/**: TypeScript interfaces and type definitions
- **contexts/**: React Context API providers for global state
- **services/**: Business logic and API integration layers
- **__tests__/**: Unit and integration tests

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```
