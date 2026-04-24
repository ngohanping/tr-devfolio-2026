# Behavioral Traits & Knowledge Base

## Behavioral Traits

This skill enforces the following patterns and behaviors:

- **Enforces test-driven-development:** Writes failing tests first (RED phase), implements minimal code (GREEN phase), then refactors (REFACTOR phase)
- Enforces strict adherence to company Angular coding standards (see [coding-standards-angular.md](coding-standards-angular.md))
- Uses feature-based folder structure consistently across all development
- Writes Observable-returning methods with `$` suffix by convention
- Prioritizes constructor injection and `providedIn: 'root'` for DI
- Implements RxJS `catchError` for comprehensive error handling
- Uses Jest for all testing with explicit, direct assertions and Arrange-Act-Assert pattern
- Applies OnPush change detection and `trackBy` for performance optimization
- Follows Angular's built-in sanitization for security
- Uses strict TypeScript typing; avoids `any` type
- Writes reactive forms with `FormBuilder` for type-safe components
- Integrates accessibility and ARIA patterns from the design phase
- Always references coding-standard-knowledge, test-driven-development, and tailwind-design-system
- Documents components with clear inputs/outputs following standards

## Knowledge Base

Core knowledge domains for effective Angular development:

- **Angular Language & Framework**
  - Angular latest documentation and features
  - Angular lifecycle hooks and component initialization
  - Angular Dependency Injection and provider configuration
  - Angular routing, lazy loading, and guards
  - Angular sanitization and security best practices

- **TypeScript & Language Features**
  - TypeScript strict mode and advanced type patterns
  - Type-safe patterns and generic constraints
  - Interface design for scalable architectures

- **Reactive Programming**
  - RxJS operators and error handling with `catchError`
  - Observable composition patterns and marble testing
  - Subject patterns for component communication
  - Error handling and operator strategies

- **Forms & Validation**
  - Reactive forms and FormBuilder patterns
  - Custom validators and async validators
  - Type-safe form handling

- **Testing & Quality**
  - Jest testing framework and mocking strategies
  - Accessibility standards (WCAG 2.1/2.2) and ARIA patterns
  - Visual regression testing with Storybook

- **Performance & Optimization**
  - Web Performance optimization and Core Web Vitals
  - Memory management and subscription cleanup
  - Bundle analysis and lazy loading strategies

- **Design & Styling**
  - Modern CSS, Tailwind CSS, and design system integration
  - Feature-based architecture and vertical slice patterns
  - Design tokens and theming systems

## Referenced External Skills

This skill integrates with and references:

- **coding-standard-knowledge** — Base coding standards, maintainability, clean code principles
- **test-driven-development** — TDD workflow, RED-GREEN-REFACTOR phases, test-first approach
- **tailwind-design-system** — Styling patterns, design tokens, component libraries, responsive design
