## Automatico Application

This is a testing platform for running tests on the web. It allows users to create tests, run them, and view the results. The application is built with Next.js, Prisma, and PostgreSQL.

The test runner is an external service. The application sends the test data to the test runner, which runs the tests and sends the results back to the application.

# Running locally

1. Install dependencies. Run `npm install` in the root directory.
2. Update the application db schema from schema file, (only needed if changes to the schema are present). Run `npm run prisma:generate` in the root directory.
3. Start the application. Run `npm run dev` in the root directory.

Open http://localhost:3000/ in a browser to view the application.

# Code push Rules

- Husky pre-commit hooks are enabled to run linting and formatting checks before committing.
- `npm run format:write` to format all files.
- `npm run lint` to run linting checks.

# DB

- PostgreSQL.
- Managed by Prisma ORM.
- Shared schema file in `prisma/schema.prisma`.

# Authentication

- NextAuth.js with Google OAuth provider. https://next-auth.js.org/
