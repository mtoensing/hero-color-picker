<?php
/**
 * Plugin Name:   Hero Color Picker
 * Plugin URI:    https://github.com/mtoensing/hero-color-picker
 * Description:   Adds a per-post color picker in the editor sidebar for hero styling.
 * Version:       1.0.6
 * Author:        Marc Tönsing
 * Author URI:    https://toensing.com
 * Text Domain:   hero-color-picker
 * License: GPL   v2 or later
 * License URI:   http://www.gnu.org/licenses/gpl-2.0.html
 *
 * @package hero-color-picker
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const HERO_COLOR_PICKER_META_KEY = 'hero_color_picker_hero_color';
const HERO_COLOR_PICKER_FONT_META_KEY = 'hero_color_picker_font_color';

/**
 * Register post meta so Gutenberg can read/write it via REST.
 */
add_action(
	'init',
	function () {
		register_post_meta(
			'post',
			HERO_COLOR_PICKER_META_KEY,
			array(
				'single'            => true,
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_hex_color',
				'show_in_rest'      => true,
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		register_post_meta(
			'post',
			HERO_COLOR_PICKER_FONT_META_KEY,
			array(
				'single'            => true,
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_hex_color',
				'show_in_rest'      => true,
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
);

/**
 * Load editor JS (Gutenberg sidebar panel).
 */
add_action(
	'enqueue_block_editor_assets',
	function () {
		$asset_file = __DIR__ . '/build/index.asset.php';
		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = include $asset_file;

		wp_enqueue_script(
			'hero-color-picker-editor',
			plugins_url( 'build/index.js', __FILE__ ),
			$asset['dependencies'],
			$asset['version'],
			true
		);
	}
);

/**
 * Frontend: output CSS variable for hero background.
 */
add_action(
	'wp_head',
	function () {
		if ( ! is_singular( 'post' ) ) {
			return;
		}

		$background_color = get_post_meta( get_queried_object_id(), HERO_COLOR_PICKER_META_KEY, true );
		$background_color = sanitize_hex_color( $background_color );

		$font_color = get_post_meta( get_queried_object_id(), HERO_COLOR_PICKER_FONT_META_KEY, true );
		$font_color = sanitize_hex_color( $font_color );

		if ( ! $background_color && ! $font_color ) {
			return;
		}

		$declarations = '';

		if ( $background_color ) {
			$declarations .= sprintf(
				'background-color: %s;',
				esc_html( $background_color )
			);
		}

		if ( $font_color ) {
			$declarations .= sprintf(
				'color: %s;',
				esc_html( $font_color )
			);
		}

		printf(
			'<style>.hero-colored {%s}</style>' . "\n",
			$declarations
		);
	}
);
