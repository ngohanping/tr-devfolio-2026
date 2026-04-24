# Modal Component Reference

## HTML Structure

```html
<!-- Modal backdrop -->
<div class="fixed inset-0 z-50 bg-black/80">
  <!-- Modal content -->
  <div
    class="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg"
  >
    <!-- Header -->
    <div class="flex flex-col space-y-1.5">
      <h2 class="text-lg font-semibold leading-none tracking-tight">Title</h2>
      <p class="text-sm text-muted-foreground">Description</p>
    </div>

    <!-- Content -->
    <div class="grid gap-4 py-4">Modal content goes here</div>

    <!-- Footer -->
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <button>Cancel</button>
      <button>Confirm</button>
    </div>
  </div>
</div>
```

## Design Tokens

- **Backdrop**: `bg-black/80` with `z-50`
- **Container**: `z-50 max-w-lg w-full`
- **Positioning**: Centered with `fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]`
- **Padding**: `p-6`
- **Shadow**: `shadow-lg`
- **Border Radius**: `rounded-lg`
- **Gap**: `gap-4`

## Structure Layers

- **Backdrop**: Fixed overlay with semi-transparent black (`fixed inset-0 bg-black/80`)
- **Modal**: Centered container with max-width (`fixed left-[50%] top-[50%] max-w-lg`)
- **Header**: Title and description section (`flex flex-col space-y-1.5`)
- **Title**: Heading text (`text-lg font-semibold`)
- **Description**: Muted text (`text-sm text-muted-foreground`)
- **Content**: Main modal content (`grid gap-4 py-4`)
- **Footer**: Button layout with responsive flex (`flex flex-col-reverse sm:flex-row sm:justify-end`)

## Usage Examples

```html
<!-- Confirmation modal -->
<div class="fixed inset-0 z-50 bg-black/80">
  <div
    class="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg"
  >
    <div class="flex flex-col space-y-1.5">
      <h2 class="text-lg font-semibold leading-none tracking-tight">
        Delete Item
      </h2>
      <p class="text-sm text-muted-foreground">This action cannot be undone.</p>
    </div>
    <div class="grid gap-4 py-4">
      <p>Are you sure you want to delete this item?</p>
    </div>
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <button class="...">Cancel</button>
      <button class="bg-error-100 text-white hover:bg-error-20 ...">
        Delete
      </button>
    </div>
  </div>
</div>
```

## Accessibility

- Semantic HTML (h2 for titles)
- Fixed positioning for overlay
- Focus trap recommended (can be added with Angular CDK)
- Backdrop click handling for dismissal
- Keyboard escape support (recommended)
