<?php

/**
 * Plugin Name: GB CSS Tooltip
 * Description: Adds a tooltip field to links in the Gutenberg editor.
 * Version: 1.2.0
 * Author: @cobianzo
 * Author URI: https://github.com/cobianzo
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 * package @gutenberg-tooltip
 */

namespace GutenbergTooltip;

class Plugin {



	/**
	 * Call hooks
	 *
	 * @return void
	 */
	public static function init(): void {

		// editor (backend)
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'enqueue_gutenberg_tooltip_script' ) );

		// frontend
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_additional_block_styles' ) );
	}

	/**
	 * Enqueue script compiled in /build
	 *
	 * @return void
	 */
	public static function enqueue_gutenberg_tooltip_script(): void {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

		wp_enqueue_script(
			'gutenberg-tooltip-script',
			plugins_url( 'build/index.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		wp_enqueue_style(
			'gutenberg-tooltip-style',
			plugins_url( 'build/style-index.css', __FILE__ ),
			array(),
			$asset_file['version']
		);
	}

	/**
	 * Style for the frontend.
	 *
	 * @return void
	 */
	public static function enqueue_additional_block_styles(): void {

		if ( ! is_singular() || is_front_page() ) {
			return;
		}

		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/front-style.asset.php';

		wp_enqueue_style(
			'gutenberg-tooltip-frontend-style',
			plugins_url( 'build/front-style.css', __FILE__ ),
			array(),
			$asset_file['version']
		);
	}
}

Plugin::init();
