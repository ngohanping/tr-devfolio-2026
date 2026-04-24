# Card Component Reference

## HTML Structure

```html
<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
  <!-- Card header -->
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-2xl font-semibold leading-none tracking-tight">Title</h3>
    <p class="text-sm text-muted-foreground">Description</p>
  </div>

  <!-- Card content -->
  <div class="p-6 pt-0">Content goes here</div>

  <!-- Card footer -->
  <div class="flex items-center p-6 pt-0">Footer content</div>
</div>
```

## Design Tokens

- **Border Radius**: `rounded-lg` (0.5rem)
- **Shadow**: `shadow-sm` (1px 1px 4px)
- **Header Padding**: `p-6` with `space-y-1.5` gap
- **Content Padding**: `p-6 pt-0`
- **Footer Padding**: `p-6 pt-0` with `flex items-center`

## Structure Layers

- **Root**: Container with border and shadow (`rounded-lg border shadow-sm`)
- **Header**: Section with title and description (`flex flex-col space-y-1.5 p-6`)
- **Title**: Heading text (`text-2xl font-semibold`)
- **Description**: Muted text (`text-sm text-muted-foreground`)
- **Content**: Main content area (`p-6 pt-0`)
- **Footer**: Footer with flexbox layout (`flex items-center p-6 pt-0`)

## Usage Examples

```html
<!-- Basic card -->
<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-2xl font-semibold leading-none tracking-tight">
      User Profile
    </h3>
  </div>
  <div class="p-6 pt-0">
    <p>User information goes here</p>
  </div>
</div>

<!-- Card with form -->
<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-2xl font-semibold leading-none tracking-tight">
      Edit Profile
    </h3>
    <p class="text-sm text-muted-foreground">Update your profile information</p>
  </div>
  <div class="p-6 pt-0">
    <form>
      <input
        type="text"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </form>
  </div>
  <div class="flex items-center p-6 pt-0">
    <button type="submit" class="...">Save</button>
  </div>
</div>
```

## Accessibility

- Semantic HTML structure (h3 for titles)
- Proper heading hierarchy
- Content projection for flexible layouts
- Support for nested interactive elements
