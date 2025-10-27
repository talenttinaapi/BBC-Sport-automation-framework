# BBC Sport Front-End Automation Framework

## Overview
This project provides automated end-to-end testing for BBC Sport website using Behavior-Driven Development (BDD) approach with Cucumber, TypeScript, and Playwright.

## Technology Stack
- **Language**: TypeScript
- **Test Framework**: Cucumber (BDD)
- **Automation Tool**: Playwright
- **Assertions**: Chai
- **Reporting**: Cucumber HTML Reporter
- **CI/CD Ready**: GitHub Actions configuration included

## Project Structure
```
bbc-sport-automation/
├── .github/
│   └── workflows/
│       └── test.yml                 # GitHub Actions CI pipeline
├── src/
│   ├── features/
│   │   ├── las-vegas-gp-results.feature
│   │   └── sport-search.feature
│   ├── pages/
│   │   ├── BasePage.ts
│   │   ├── SportHomePage.ts
│   │   ├── FormulaOnePage.ts
│   │   └── SearchResultsPage.ts
│   ├── step-definitions/
│   │   ├── las-vegas-gp.steps.ts
│   │   └── sport-search.steps.ts
│   ├── support/
│   │   ├── hooks.ts
│   │   └── world.ts
│   └── utils/
│       ├── config.ts
│       └── logger.ts
├── test-results/
├── screenshots/
├── package.json
├── tsconfig.json
├── cucumber.js
├── .env.example
└── README.md
```

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd bbc-sport-automation
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install Playwright browsers
```bash
npx playwright install
```

### 4. Configure environment (optional)
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific feature
```bash
npm run test:feature -- --name "Las Vegas Grand Prix"
```

### Run with specific browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run in headed mode (see browser)
```bash
npm run test:headed
```

### Run with debugging
```bash
npm run test:debug
```

## Test Scenarios

### Scenario 1: Las Vegas Grand Prix Results Validation
**Feature**: Validate the top 3 finishers of the 2023 Las Vegas Grand Prix
- Navigates to BBC Sport Formula 1 section
- Locates the Las Vegas Grand Prix results
- Validates podium positions:
  - 1st: Max Verstappen
  - 2nd: George Russell
  - 3rd: Sergio Perez

### Scenario 2: Search Functionality
**Feature**: Ensure search returns at least 4 relevant results for "Sport in 2023"
- Performs search for "Sport in 2023"
- Validates minimum 4 results are returned
- Verifies results relevance

## Key Features

### Code Quality
- **TypeScript**: Strong typing for better code quality
- **Page Object Model**: Maintainable and reusable page classes
- **DRY Principles**: Shared utilities and base classes
- **ESLint & Prettier**: Code formatting and linting

### Error Handling
- Comprehensive try-catch blocks
- Custom error messages
- Screenshot capture on failure
- Detailed logging

### Reporting
- Cucumber HTML reports
- Screenshots on failure
- Execution logs
- JSON report for CI/CD integration

### CI/CD Ready
- GitHub Actions workflow included
- Parallel execution support
- Artifact upload (reports & screenshots)
- Multiple browser testing

## Configuration

### cucumber.js
```javascript
module.exports = {
  default: {
    require: ['src/step-definitions/**/*.ts', 'src/support/**/*.ts'],
    format: ['progress', 'html:test-results/cucumber-report.html', 'json:test-results/cucumber-report.json'],
    publishQuiet: true
  }
}
```

### Environment Variables (.env)
```
BASE_URL=https://www.bbc.com/sport
HEADLESS=true
BROWSER=chromium
TIMEOUT=30000
SCREENSHOT_ON_FAILURE=true
```

## CI/CD Integration

### GitHub Actions
The project includes a `.github/workflows/test.yml` file that:
- Runs tests on push and pull requests
- Tests across multiple browsers (Chromium, Firefox, WebKit)
- Uploads test reports and screenshots as artifacts
- Provides test status badges

### Running in CI
```bash
# Set environment variable for CI
export CI=true
npm test
```

## Best Practices Implemented

1. **Page Object Model**: Separation of page logic from test logic
2. **BDD Approach**: Human-readable test scenarios
3. **Explicit Waits**: Robust element handling with proper wait strategies
4. **Error Handling**: Graceful failure handling with detailed logs
5. **Reusability**: Shared utilities and base classes
6. **Assertions**: Clear and descriptive assertions
7. **Documentation**: Inline comments and comprehensive README
8. **Version Control**: Git-friendly structure with .gitignore

## Troubleshooting

### Tests failing due to element not found
- Check if BBC Sport website structure has changed
- Increase timeout in `.env` file
- Run in headed mode to debug visually

### Browser not launching
```bash
npx playwright install --force
```

### Module not found errors
```bash
npm install
npm rebuild
```

## Extending the Framework

### Adding new test scenarios
1. Create feature file in `src/features/`
2. Implement step definitions in `src/step-definitions/`
3. Add page objects in `src/pages/` if needed
4. Update hooks if required

### Adding new page objects
```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async performAction() {
    // Implementation
  }
}
```

## Reporting Issues
If you encounter any issues, please include:
- Test scenario that failed
- Error message and stack trace
- Screenshots (if available)
- Browser and OS information

## Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-test`)
3. Commit changes (`git commit -am 'Add new test scenario'`)
4. Push to branch (`git push origin feature/new-test`)
5. Create Pull Request

## License
MIT

## Contact
For questions or assistance, please contact: TechAsessment@securitease.com

## Acknowledgments
- BBC Sport for providing the test platform
- Playwright team for excellent automation tools
- Cucumber community for BDD framework