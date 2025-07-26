# DH-Reporting Shared Library

A shared utility library for the DH-Reporting mobile time tracking application. This package contains common functions, types, and constants used across the mobile and web applications.

## 📋 Overview

This shared library provides:
- **Validation functions** for user input and business rules
- **Date/time utilities** for work hours calculation and formatting
- **Business logic functions** for time tracking and project management
- **Type definitions** for common data structures
- **Constants** for application-wide configuration

## 🚀 Quick Start

### Installation

```bash
# For local development (from parent directory)
npm install ../dh-reporting-shared

# For published package (future)
npm install @dh-reporting/shared
```

### Basic Usage

```javascript
// Import validation functions
import { validateEmail, validateTimeEntry } from '@dh-reporting/shared';

// Import date utilities
import { formatWorkHours, calculateDuration } from '@dh-reporting/shared';

// Import types
import { User, Project, TimeEntry } from '@dh-reporting/shared';

// Import constants
import { APP_CONSTANTS, TIME_FORMATS } from '@dh-reporting/shared';
```

## 📁 Project Structure

```
src/
├── validation/          # Input validation functions
│   ├── userValidation.js
│   ├── timeValidation.js
│   └── projectValidation.js
├── utils/              # Utility functions
│   ├── dateUtils.js
│   ├── timeUtils.js
│   └── formatUtils.js
├── business-logic/     # Business rules and calculations
│   ├── timeCalculations.js
│   ├── projectLogic.js
│   └── overtimeRules.js
├── types/              # Type definitions
│   ├── commonTypes.js
│   ├── userTypes.js
│   └── projectTypes.js
├── constants/          # Application constants
│   ├── appConstants.js
│   ├── errorCodes.js
│   └── timeFormats.js
├── testing/            # Testing utilities
│   ├── testUtils.js
│   ├── mockData.js
│   └── testHelpers.js
└── index.js           # Main export file
```

## 🛠️ Available Functions

### Validation Functions

```javascript
import { validateEmail, validateEmployeeCode, validateTimeEntry } from '@dh-reporting/shared';

// Email validation
const isValidEmail = validateEmail('user@example.com'); // true/false

// Employee code validation  
const isValidCode = validateEmployeeCode('EMP001'); // true/false

// Time entry validation
const isValidEntry = validateTimeEntry({
  projectId: 'proj-123',
  date: '2024-01-15',
  duration: 480 // minutes
}); // true/false
```

### Date/Time Utilities

```javascript
import { formatWorkHours, calculateDuration, isBusinessDay } from '@dh-reporting/shared';

// Format work hours for display
const formatted = formatWorkHours(480); // "8.0 hours"

// Calculate duration between times
const duration = calculateDuration('09:00', '17:30'); // 510 minutes

// Check if date is a business day
const isBusiness = isBusinessDay(new Date()); // true/false
```

### Business Logic Functions

```javascript
import { calculateOvertime, validateWorkSchedule, getProjectProgress } from '@dh-reporting/shared';

// Calculate overtime hours
const overtime = calculateOvertime(dailyHours, 8); // hours over standard

// Validate work schedule
const isValid = validateWorkSchedule(timeEntries); // true/false

// Calculate project progress
const progress = getProjectProgress(timeEntries, allocatedHours); // percentage
```

## 🏗️ Development

### Setup

```bash
# Clone the repository
git clone https://bitbucket.org/your-username/dh-reporting-shared.git
cd dh-reporting-shared

# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build
```

### Development Workflow

1. **Make changes** to source files in `src/`
2. **Add tests** for new functionality
3. **Run tests** to ensure everything works: `npm test`
4. **Update version** in package.json if needed
5. **Commit changes** with descriptive commit messages
6. **Push to repository**

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Usage in Projects

### Mobile App (dh-reporting-mobile)

```javascript
// In React Native components
import { validateEmail, formatWorkHours } from '@dh-reporting/shared';

const SignUpScreen = () => {
  const handleEmailChange = (email) => {
    const isValid = validateEmail(email);
    // Handle validation result
  };
};
```

### Web App (dh-reporting-web)

```javascript
// In React components
import { calculateOvertime, getProjectProgress } from '@dh-reporting/shared';

const ProjectDashboard = () => {
  const progress = getProjectProgress(timeEntries, allocatedHours);
  // Display progress
};
```

## 🔄 Version Management

This library follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions  
- **PATCH** version for backwards-compatible bug fixes

### Updating Consuming Apps

When updating the shared library:

```bash
# In mobile app
cd ../dh-reporting-mobile
npm install ../dh-reporting-shared

# In web app  
cd ../dh-reporting-web
npm install ../dh-reporting-shared
```

## 🧪 Testing Strategy

- **Unit tests** for all validation functions
- **Integration tests** for business logic
- **Mock data generators** for testing consuming applications
- **Type checking** for TypeScript compatibility

## 📋 Contributing

1. **Create a feature branch** from `develop`
2. **Make your changes** with appropriate tests
3. **Ensure all tests pass**
4. **Update documentation** if needed
5. **Create a pull request** to `develop`
6. **Wait for code review** and approval

## 📄 License

Private - Internal company use only

## 🔗 Related Repositories

- [dh-reporting-mobile](../dh-reporting-mobile) - React Native mobile app
- [dh-reporting-web](../dh-reporting-web) - React web dashboard

## 📞 Support

For questions or issues related to the shared library:

1. **Check existing issues** in the repository
2. **Create a new issue** with detailed description
3. **Contact the development team** for urgent matters

---

**Built with ❤️ for the DH-Reporting time tracking system**