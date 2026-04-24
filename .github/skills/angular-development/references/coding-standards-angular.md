# Angular Coding Standards

This document outlines company-specific Angular coding standards. For general standards (file structure, naming, formatting, error handling, testing, security, performance, etc.), refer to the Base Coding Standards.

## 1. Feature Structure

- Use a **feature-based (vertical slice)** folder structure under `src/app/`, grouping all files for a domain or business capability together.
- Place feature-specific styles with their components; global styles go in `src/styles/`.
- Define models/interfaces inside the component or service file unless shared across the feature.

## 2. Naming Conventions

- Suffix Observable-returning methods with `$` (e.g., `getBooking$`).
- Use the `app-` prefix for selectors (as set in `angular.json`).
- **Components**: `feature.component.ts`, `feature.component.html`, `feature.component.scss`, `feature.component.spec.ts`
- **Services**: `feature.service.ts`, `feature.service.spec.ts`
- **Models/Interfaces**: `feature.model.ts`, `feature.interface.ts`
- **Directives**: `feature.directive.ts`, `feature.directive.spec.ts`
- **Pipes**: `feature.pipe.ts`, `feature.pipe.spec.ts`
- **Guards**: `feature.guard.ts`
- **Directories**: Use kebab-case (e.g., `src/app/feature-name/`)

## 3. TypeScript & Angular Usage

- Use Angular Dependency Injection for services (`@Injectable({ providedIn: 'root' })`).
- Use Observables for async data streams and RxJS operators for transformations.
- Use Angular lifecycle hooks appropriately; put initialization logic in `ngOnInit`.
- Prefer interfaces for data models.
- Use strict typing everywhere; avoid `any`.

## 4. Error Handling

- Use RxJS `catchError` for handling errors in Observables.
- Use Angular's global error handler for unhandled exceptions.

## 5. Dependency Injection

- Use constructor injection for dependencies.
- Prefer `providedIn: 'root'` for singleton services.

## 6. Testing

- Follow Test-Driven Development.
- Use Jest for unit testing.
- Mock dependencies using Jest mocks.
- Use parameterized tests for multiple scenarios, but keep assertions direct and explicit.

## 7. Build & Compilation Requirements

All code MUST compile without errors before marking complete:

- **TypeScript Strict Mode:** All code must pass strict mode (`"strict": true`)
  - No implicit `any` types
  - Async pipe returns `T | null` - handle null in templates
  - Property initialization order (use constructor or use `!` cautiously)
  - No unused variables
- **Template Compilation:** All Angular templates must compile
  - No unclosed HTML tags
  - No template syntax errors
  - Type-safe property bindings
- **Build Command Must Pass:**
  ```bash
  npm run build  # ZERO errors
  ```

## 8. Security

- Use Angular's built-in sanitization for HTML and URLs (`DomSanitizer`).
- Use authentication and authorization guards for protected routes.

## 9. Performance

- Use OnPush change detection for performance-sensitive components.
- Use `trackBy` in `*ngFor` for large lists.
- Lazy load feature modules.

## 10. Layout & Routing

- **Root Layout (`app.html`):** Place globally shared UI (headers, navigation, footers) in the root component template
- **Page Components:** Individual route components (login, home, etc.) should contain only page-specific content
- **Why:** Avoid duplicating shared UI across multiple page components. Use `<router-outlet></router-outlet>` to inject page content into the layout
- **Anti-pattern:** Adding header/footer to every page component instead of the root layout

## 11. General Angular Best Practices

- Use meaningful names and follow established Angular patterns in the codebase.
- Use reactive forms with `FormBuilder` for type-safe form handling.
- Implement comprehensive error handling and loading states.
- Always adhere to coding-standard-knowledge for maintainable and clean code.
- Always follow tailwind-design-system for styling and consistency.
