=== Hero Color Picker ===
Contributors: MarcDK
Tags: Gutenberg, Block Editor, Color Picker, Accessibility, WCAG
Requires at least: 5.9
Tested up to: 6.9
Stable tag: 1.0.6
Requires PHP: 7.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Donate link: https://marc.tv/out/donate

WordPress plugin for the block editor (Gutenberg) to set a hero color per post.

== Description ==

**Hero Color Picker** adds a focused design panel to the WordPress post editor for styling hero sections.

Features:
- Two color controls: `Background Color` and `Font Color`
- On-demand color pickers in compact dropdown popovers
- Live preview of both colors together directly in the sidebar
- Accessibility check for `WCAG AAA Normal Text` with `PASS` / `FAILED` status
- Panel is shown only while editing posts (`post`), not in template editing contexts
- Works on elements that have the CSS class `hero-colored`

Stored as post meta:
- `hero_color_picker_hero_color`
- `hero_color_picker_font_color`

Frontend output (only when values are set):

```css
.hero-colored {
	background-color: $background;
	color: $font;
}
```

Important template setup:
- Open your block theme template (for example `Single`) in the Site Editor.
- Select the `Group` block that should receive the hero styles.
- In block settings, add `hero-colored` to `Additional CSS class(es)`.

== Installation ==

1. Place the plugin in `wp-content/plugins/hero-color-picker`.
2. Activate the plugin in WordPress.
3. Open `Appearance > Editor` and edit your post template (for example `Single`).
4. Select the target `Group` block and add the class `hero-colored` in `Additional CSS class(es)`.

== Changelog ==

= 1.0.6 =
* Improved and expanded `Description` and `Installation` documentation.
* Added explicit setup steps for applying the `hero-colored` CSS class in block theme templates.

= 1.0.5 =
* Added a second sidebar color control for `Font Color`.
* Frontend output now applies both `background-color` and `color` to `.hero-colored`.
* Sidebar color picker is now shown on demand via dropdown popover.
* Added `WCAG AAA Normal Text` status with `PASS` / `FAILED`.
* Improved spacing in the color value button.
