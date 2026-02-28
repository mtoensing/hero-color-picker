=== Hero Color Picker ===
Contributors: MarcDK
Tags: Gutenberg, Block Editor, Color Picker, Accessibility, WCAG
Requires at least: 5.9
Tested up to: 6.9
Stable tag: 1.0.5
Requires PHP: 7.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Donate link: https://marc.tv/out/donate

WordPress plugin for the block editor (Gutenberg) to set a hero color per post.

== Description ==

Sidebar panel in the editor: **Hero Color Picker**. The colors are stored as post meta:
  - `hero_color_picker_hero_color`
  - `hero_color_picker_font_color`
CSS is output on the frontend:
    `.hero-colored {
    background-color: $background; 
    color: $font;
    }`

== Installation ==

1. Place the plugin in `wp-content/plugins/hero-color-picker`.
2. Activate the plugin in WordPress.

== Changelog ==

= 1.0.5 =
* Added a second sidebar color control for `Font Color`.
* Frontend output now applies both `background-color` and `color` to `.hero-colored`.
* Sidebar color picker is now shown on demand via dropdown popover.
* Added `WCAG AAA Normal Text` status with `PASS` / `FAILED`.
* Improved spacing in the color value button.
