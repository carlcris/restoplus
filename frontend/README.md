# RestoPlus Frontend

Modern restaurant management system frontend built with Next.js, React, and TypeScript.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **GraphQL Client**: urql
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your configuration

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed information about the project organization.

## GraphQL Integration

The application uses urql as the GraphQL client. The client is configured in `src/lib/graphql/client.ts` and provided globally via the `UrqlProvider` context.

### Example Query

```typescript
import { useQuery } from 'urql';

const MyComponent = () => {
  const [result] = useQuery({
    query: `
      query {
        restaurants {
          id
          name
        }
      }
    `,
  });

  if (result.fetching) return <p>Loading...</p>;
  if (result.error) return <p>Error: {result.error.message}</p>;

  return <div>{/* Render data */}</div>;
};
```

## Environment Variables

See `.env.example` for all available environment variables:

- `NEXT_PUBLIC_GRAPHQL_ENDPOINT` - GraphQL API endpoint
- `NEXT_PUBLIC_API_GATEWAY_URL` - Apollo Router gateway URL
- `NEXT_PUBLIC_APP_URL` - Application base URL

## Contributing

Please follow the established code structure and naming conventions. All features should include appropriate tests.

## License

Private - All rights reserved
