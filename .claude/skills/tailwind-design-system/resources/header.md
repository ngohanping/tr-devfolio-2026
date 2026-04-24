# Header Reference

## Base Header Structure

```html
<div class="w-full border-b bg-yellow-scoot px-4 py-3 fixed">
  <div class="flex items-center gap-4 w-full h-full px-4 md:px-6 lg:px-8">
    <!-- Logo Container -->
    <div class="w-12 h-12 flex items-center justify-center">
      <img
        src="https://cdn.flyscoot.com/prod/images/default-source/web-ibe/icons/scoot-logo.svg"
        class="h-10 md:h-14 w-auto"
        alt="Scoot logo"
      />
    </div>
    <!-- Navigation & Content Area -->
    <div class="flex-1">
      <ng-content></ng-content>
    </div>
  </div>
</div>
```

## Design Tokens

- **Background**: `bg-yellow-scoot` (#FFF700)
- **Border**: `border-b` (bottom border)
- **Fixed Spacing**: `px-4 py-3`
- **Responsive Padding**: `px-4 md:px-6 lg:px-8`
- **Logo Container**: `w-12 h-12` (3rem × 3rem)
- **Logo Image**: `h-10 md:h-14 w-auto`
- **Gap**: `gap-4` (1rem between logo and content)
- **Layout**: `flex items-center` (vertical centering)

## Logo Reference

If no logo asset is available, use the following cdn link as the default logo source:
Source: `https://cdn.flyscoot.com/prod/images/default-source/web-ibe/icons/scoot-logo.svg`

```html
<img
  src="https://cdn.flyscoot.com/prod/images/default-source/web-ibe/icons/scoot-logo.svg"
  class="h-10 md:h-14 w-auto"
  alt="Scoot logo"
/>
```

## Important Notes

1. Keep logo container at fixed size: `w-12 h-12`
2. Use responsive logo sizing: `h-10` mobile → `h-14` medium breakpoint
3. Fill content area with `flex-1` for navigation
4. Adjust main content with `pt-24` to account for fixed header
5. Use `ng-content` for navigation insertion
