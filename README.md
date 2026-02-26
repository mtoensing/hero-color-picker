# Hero Color Picker

WordPress plugin for the block editor (Gutenberg) to set a hero color per post.

## Features

- Sidebar panel in the editor: **Hero Color Picker**
- Color is stored as post meta: `hero_color_picker_hero_color`
- A CSS variable is output on the frontend:
  - `--hero-color-picker-bg`

## Requirements

- WordPress with the block editor
- Node.js + npm (only for build/development)

## Installation

1. Place the plugin in `wp-content/plugins/hero-color-picker`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the assets:
   ```bash
   npm run build
   ```
4. Activate the plugin in WordPress.

## Development

- Watch mode:
  ```bash
  npm run start
  ```
- Production build:
  ```bash
  npm run build
  ```
- Lint:
  ```bash
  npm run lint:js
  ```

## Usage

1. Open a post in the block editor.
2. Use the **Hero Color Picker** panel in document settings.
3. Pick a color and save the post.

The CSS variable `--hero-color-picker-bg` is then available on the frontend.

Example:

```css
.hero {
  background-color: var(--hero-color-picker-bg, #111111);
}
```

## Notes

- The plugin only sets the variable, not the final theme styling.
- If the panel does not appear, run `npm run build` first and reload the page.
