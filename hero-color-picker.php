<?php
/**
 * Plugin Name:   Hero Color Picker
 * Plugin URI:    https://github.com/mtoensing/hero-color-picker
 * Description:   Adds per-post color selection in the editor sidebar for hero styling via CSS.
 * Version:       1.0.18
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
const HERO_COLOR_PICKER_HAS_BG_QUERY_VAR = 'hero_color_picker_has_bg';

/**
 * Posts list: add a core-like view to show posts that have a hero background.
 */
add_filter(
	'views_edit-post',
	function ( $views ) {
		$has_bg_filter = isset( $_GET[ HERO_COLOR_PICKER_HAS_BG_QUERY_VAR ] ) ? sanitize_text_field( wp_unslash( $_GET[ HERO_COLOR_PICKER_HAS_BG_QUERY_VAR ] ) ) : '';
		$is_current    = ( '1' === $has_bg_filter );

		$count_query = new WP_Query(
			array(
				'post_type'              => 'post',
				'post_status'            => array( 'publish', 'future', 'draft', 'pending', 'private' ),
				'fields'                 => 'ids',
				'posts_per_page'         => 1,
				'update_post_meta_cache' => false,
				'update_post_term_cache' => false,
				'cache_results'          => false,
				'meta_query'             => array(
					array(
						'key'     => HERO_COLOR_PICKER_META_KEY,
						'value'   => '',
						'compare' => '!=',
					),
				),
			)
		);

		$views['hero_color_picker_has_bg'] = sprintf(
			'<a href="%1$s"%2$s>%3$s <span class="count">(%4$d)</span></a>',
			esc_url(
				add_query_arg(
					array(
						'post_type'                         => 'post',
						HERO_COLOR_PICKER_HAS_BG_QUERY_VAR => '1',
					),
					admin_url( 'edit.php' )
				)
			),
			$is_current ? ' class="current" aria-current="page"' : '',
			esc_html__( 'Hero Background', 'hero-color-picker' ),
			(int) $count_query->found_posts
		);

		return $views;
	}
);

/**
 * Posts list: apply the hero background filter when custom view is active.
 */
add_action(
	'pre_get_posts',
	function ( $query ) {
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return;
		}

		$post_type = $query->get( 'post_type' );
		if ( $post_type && 'post' !== $post_type ) {
			return;
		}

		$has_bg_filter = isset( $_GET[ HERO_COLOR_PICKER_HAS_BG_QUERY_VAR ] ) ? sanitize_text_field( wp_unslash( $_GET[ HERO_COLOR_PICKER_HAS_BG_QUERY_VAR ] ) ) : '';
		if ( '1' !== $has_bg_filter ) {
			return;
		}

		$meta_query   = (array) $query->get( 'meta_query' );
		$meta_query[] = array(
			'key'     => HERO_COLOR_PICKER_META_KEY,
			'value'   => '',
			'compare' => '!=',
		);

		$query->set( 'meta_query', $meta_query );
	}
);

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

		wp_set_script_translations(
			'hero-color-picker-editor',
			'hero-color-picker'
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
