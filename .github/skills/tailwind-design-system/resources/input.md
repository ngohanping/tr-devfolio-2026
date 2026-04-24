# Input Component Reference

## HTML Structure

```html
<div class="relative">
  <input
    type="text"
    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    placeholder="Enter text"
  />
  <!-- Error message shown conditionally -->
  <p id="input-error" class="mt-1 text-sm text-destructive" role="alert">
    Error message
  </p>
</div>
```

## Design Tokens

- **Height**: `h-10` (2.5rem)
- **Width**: `w-full` (100%)
- **Border**: `border border-input`
- **Padding**: `px-3 py-2`
- **Border Radius**: `rounded-md`
- **Focus States**: `focus-visible:ring-2 focus-visible:ring-ring`
- **Error Color**: `border-destructive text-destructive`
- **Disabled**: `disabled:opacity-50 disabled:cursor-not-allowed`

## Usage Examples

```html
<!-- Text input -->
<div class="relative">
  <input
    type="text"
    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    placeholder="Enter your name"
  />
</div>

<!-- Email input -->
<div class="relative">
  <input
    type="email"
    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    placeholder="your@email.com"
    aria-invalid="false"
  />
</div>

<!-- Input with error -->
<div class="relative">
  <input
    type="email"
    class="flex h-10 w-full rounded-md border border-destructive bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    placeholder="your@email.com"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" class="mt-1 text-sm text-destructive" role="alert">
    Invalid email address
  </p>
</div>
```

## Accessibility

- ARIA attributes for validation errors
- Focus ring for keyboard navigation
- Error messages with role="alert"
- Semantic HTML5 input types
