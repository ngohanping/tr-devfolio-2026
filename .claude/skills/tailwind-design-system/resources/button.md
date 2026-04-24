# Button Component Reference

## HTML Structure

```html
<button
  class="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all rounded-m border focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
>
  Click Me
</button>
```

## Design Tokens

- **Base Height**: `h-9` (sm), `h-14` (md/lg)
- **Padding**: `px-4 py-2` (sm), `px-6 py-2` (md), `px-12 py-2` (lg)
- **Border Radius**: `rounded-m` (1.5rem)
- **Transition**: `transition-all`
- **Focus**: `focus-visible:outline-none`
- **Disabled**: `disabled:opacity-50 disabled:cursor-not-allowed`

## Variants

- **primary**: Yellow SCOOT theme - `bg-yellow-80`
- **secondary**: White with gray border - `bg-white border-gray-60`
- **kf**: KF blue theme - `bg-kf-80 hover:bg-kf-100`
- **error**: Red error state - `bg-error-100`
- **success**: Green success state - `bg-success-100`
- **ghost**: Transparent with hover - `bg-transparent hover:bg-gray-5`
- **outline**: Border only - `border-gray-40`

## Sizes

- **sm**: Height 2.25rem, padding 1rem
- **md**: Height 3.5rem, padding 1.5rem (default)
- **lg**: Height 3.5rem, padding 3rem

## Usage Examples

```html
<!-- Primary button -->
<button
  class="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all rounded-m border focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-yellow-80 text-gray-80 border-gray-40 hover:bg-yellow-20 h-14 px-6 py-2 text-base"
>
  Click Me
</button>

<!-- Error button, large -->
<button
  class="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all rounded-m border focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-error-100 text-white hover:bg-error-20 h-14 px-12 py-2 text-lg"
>
  Delete
</button>

<!-- Submit button -->
<button
  type="submit"
  class="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all rounded-m border focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-yellow-80 text-gray-80 border-gray-40 hover:bg-yellow-20 h-14 px-6 py-2 text-base"
>
  Submit
</button>

<!-- Disabled ghost button -->
<button
  disabled
  class="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all rounded-m border focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-transparent text-gray-80 hover:bg-gray-5 border-transparent h-14 px-6 py-2 text-base"
>
  Disabled
</button>
```

## Accessibility

- Semantic `<button>` element
- Type support (button, submit, reset)
- Disabled state properly handled
- Focus visible for keyboard navigation
