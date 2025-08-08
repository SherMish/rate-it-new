# Testing Documentation

This document outlines the comprehensive testing strategy implemented for the Rate-It application.

## Testing Stack

- **Unit Testing**: Jest with React Testing Library
- **Integration Testing**: Jest with MongoDB Memory Server
- **End-to-End Testing**: Playwright
- **Performance Testing**: Lighthouse CI
- **CI/CD**: GitHub Actions

## Test Structure

```
__tests__/
├── api/                    # API endpoint tests
│   ├── tools.test.ts
│   ├── website-check.test.ts
│   └── reviews.test.ts
├── client/                 # Component and client-side tests
│   ├── components/
│   │   ├── website-card.test.tsx
│   │   └── search-input.test.tsx
│   └── utils/
│       └── url-validation.test.ts
e2e/                        # End-to-end tests
├── homepage.spec.ts
├── authentication.spec.ts
└── business-dashboard.spec.ts
```

## Running Tests

### All Tests

```bash
npm run test:all
```

### Unit Tests

```bash
npm test                    # Run once
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage
```

### End-to-End Tests

```bash
npm run test:e2e           # Run E2E tests
npm run test:e2e:ui        # Run with UI mode
```

### Individual Test Suites

```bash
# API tests only
npm test __tests__/api

# Component tests only
npm test __tests__/client

# Specific test file
npm test website-card.test.tsx
```

## Test Categories

### 1. Unit Tests

**API Endpoints:**

- `/api/tools` - Tool creation and validation
- `/api/website/check` - Website existence checking
- `/api/reviews/get` - Review retrieval and filtering

**Components:**

- `WebsiteCard` - Tool/website display component
- `SearchInput` - Search functionality

**Utilities:**

- URL validation and normalization
- Helper functions

### 2. Integration Tests

Tests that verify API endpoints work correctly with database operations:

- Database connection and queries
- Data validation and sanitization
- Error handling and edge cases
- Authentication and authorization

### 3. End-to-End Tests

**Homepage:**

- Page loading and navigation
- Search functionality
- Category browsing
- Responsive design
- Tool navigation

**Authentication:**

- Login/logout flows
- Registration process
- Protected route access
- Error handling

**Business Dashboard:**

- Dashboard metrics display
- Review management
- QR code generation
- Mobile navigation

### 4. Performance Tests

- Lighthouse CI audits for:
  - Performance (80%+ score)
  - Accessibility (90%+ score)
  - Best Practices (85%+ score)
  - SEO (90%+ score)

## CI/CD Pipeline

The GitHub Actions workflow (`test.yml`) runs on every push and pull request:

### Pipeline Stages:

1. **Code Quality**

   - ESLint checking
   - TypeScript compilation
   - Format validation

2. **Unit & Integration Tests**

   - Jest test suite
   - MongoDB in-memory database
   - Code coverage reporting

3. **Build Test**

   - Next.js build verification
   - Bundle size analysis

4. **End-to-End Tests**

   - Playwright across multiple browsers
   - Screenshot capture on failures
   - Test artifact upload

5. **Security Audit**

   - npm audit for vulnerabilities
   - Dependency security check

6. **Performance Test** (PR only)
   - Lighthouse CI audits
   - Performance regression detection

## Test Configuration

### Jest Configuration (`jest.config.js`)

- Separate environments for client/server tests
- MongoDB Memory Server for integration tests
- Coverage reporting and thresholds
- Module path mapping

### Playwright Configuration (`playwright.config.ts`)

- Multi-browser testing (Chrome, Firefox, Safari)
- Mobile device testing
- Screenshot and video capture
- Retry configuration

### GitHub Actions (`test.yml`)

- Matrix builds for different environments
- Parallel test execution
- Artifact collection
- Coverage reporting

## Writing Tests

### API Tests Example:

```typescript
import { POST } from "@/app/api/tools/route";
import { NextRequest } from "next/server";

describe("/api/tools", () => {
  it("should create a new tool", async () => {
    const request = new NextRequest("http://localhost:3000/api/tools", {
      method: "POST",
      body: JSON.stringify({
        url: "https://example.com",
        name: "Test Tool",
        categories: ["AI"],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

### Component Tests Example:

```typescript
import { render, screen } from "@testing-library/react";
import { WebsiteCard } from "@/components/website-card";

describe("WebsiteCard", () => {
  it("renders website information", () => {
    const mockWebsite = {
      name: "Test Tool",
      description: "A test tool",
      // ... other props
    };

    render(<WebsiteCard website={mockWebsite} />);
    expect(screen.getByText("Test Tool")).toBeInTheDocument();
  });
});
```

### E2E Tests Example:

```typescript
import { test, expect } from "@playwright/test";

test("homepage loads correctly", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Rate It/);
  await expect(page.locator("header")).toBeVisible();
});
```

## Coverage Goals

- **Unit Tests**: 80%+ line coverage
- **API Tests**: 90%+ endpoint coverage
- **E2E Tests**: All critical user journeys
- **Performance**: Meet Lighthouse thresholds

## Debugging Tests

### Jest Tests:

```bash
# Debug specific test
npm test -- --no-coverage website-card.test.tsx

# Run tests in watch mode with verbose output
npm run test:watch -- --verbose
```

### Playwright Tests:

```bash
# Run with browser UI
npm run test:e2e:ui

# Debug specific test
npx playwright test homepage.spec.ts --debug

# Generate test report
npx playwright show-report
```

## Mocking Strategy

### External Dependencies:

- MongoDB connections (Memory Server)
- Next.js router and navigation
- NextAuth sessions
- External API calls

### Component Dependencies:

- Complex child components
- Third-party libraries
- Browser APIs

## Test Data Management

### Fixtures:

- Sample website data
- Mock user accounts
- Test reviews and ratings

### Database Seeding:

- Automated test data creation
- Cleanup between tests
- Isolated test environments

## Performance Considerations

### Test Optimization:

- Parallel test execution
- Selective test running
- Efficient mocking
- Resource cleanup

### CI/CD Optimization:

- Caching dependencies
- Matrix builds
- Conditional job execution
- Artifact management

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Errors**

   - Ensure MongoDB Memory Server is properly configured
   - Check port conflicts

2. **Playwright Browser Issues**

   - Run `npx playwright install` to update browsers
   - Check system dependencies

3. **Mock Resolution Problems**

   - Verify mock paths match actual imports
   - Clear Jest cache: `npx jest --clearCache`

4. **CI/CD Failures**
   - Check environment variables
   - Verify GitHub Actions permissions
   - Review artifact upload limits

### Debug Commands:

```bash
# Clear all caches
npm run test -- --clearCache

# Run specific test with debugging
npm test -- --detectOpenHandles --forceExit

# Playwright debug mode
PWDEBUG=1 npm run test:e2e
```

## Continuous Improvement

### Metrics to Monitor:

- Test execution time
- Coverage trends
- Flaky test identification
- Performance regression detection

### Regular Tasks:

- Update testing dependencies
- Review and refactor test suites
- Add tests for new features
- Optimize CI/CD pipeline

For questions or issues with the testing setup, please refer to the project documentation or create an issue in the repository.
