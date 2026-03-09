=== Hero Color Picker ===
Contributors: MarcDK
Tags: Gutenberg, Block Editor, Color Picker, Accessibility, WCAG
Requires at least: 5.9
Tested up to: 6.9
Stable tag: 1.0.11
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
- Applies selected colors to the editor post summary area for a closer backend preview
- Removes the featured image preview outline while a custom background color is active
- Accessibility check for `WCAG AAA Normal Text` with `PASS` / `FAILED` status
- Panel is shown only while editing posts (`post`), not in template editing contexts
- Adds a core-like posts list view `Hero Background` to show only posts with a custom hero background color
- Works on elements that have the CSS class `hero-colored`

Stored as post meta:
- `hero_color_picker_hero_color`
- `hero_color_picker_font_color`

Frontend output (only when values are set):

    .hero-colored {
        background-color: $background;
        color: $font;
    }

Important template setup:
- Open your block theme template (for example `Single`) in the Site Editor.
- Select the `Group` block that should receive the hero styles.
- In block settings, add `hero-colored` to `Additional CSS class(es)`.

== Installation ==

1. Place the plugin in `wp-content/plugins/hero-color-picker`.
2. Activate the plugin in WordPress.
3. Open `Appearance > Editor` and edit your post template (for example `Single`).
4. Select the target `Group` block and add the class `hero-colored` in `Additional CSS class(es)`.
5. Optional: open `Posts > All Posts` and click `Hero Background` to list posts with a custom hero background.

== Screenshots ==

1. Hero Color Picker sidebar panel with background color, font color, live preview, and WCAG status.

== Changelog ==

= 1.0.11 =
* Bumped plugin version to `1.0.11`.
* Removed unused WordPress.org banner assets.

= 1.0.10 =
* Bumped plugin version to `1.0.10`.

= 1.0.9 =
* Bumped plugin version to `1.0.9`.

= 1.0.8 =
* Bumped plugin version to `1.0.8`.
* Added release note entry for `1.0.8`.

= 1.0.7 =
* Added `Hero Background` view on `Posts > All Posts` to list posts with a custom hero background color.
* Editor preview now removes the featured image outline while a custom background color is active.
* Expanded documentation with newly added backend/editor features.

= 1.0.6 =
* Improved and expanded `Description` and `Installation` documentation.
* Added explicit setup steps for applying the `hero-colored` CSS class in block theme templates.

= 1.0.5 =
* Added a second sidebar color control for `Font Color`.
* Frontend output now applies both `background-color` and `color` to `.hero-colored`.
* Sidebar color picker is now shown on demand via dropdown popover.
* Added `WCAG AAA Normal Text` status with `PASS` / `FAILED`.
* Improved spacing in the color value button.
