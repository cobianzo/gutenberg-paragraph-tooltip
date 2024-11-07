<?php
/**
 * Plugin Name: Gutenberg Tooltip
 * Description: Adds a tooltip field to links in the Gutenberg editor.
 * Version: 1.0
 * Author: @cobianzo
 * Author URI: https://github.com/cobianzo
 */

// Enqueue el script de Gutenberg
function enqueue_gutenberg_tooltip_script() {
  $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

  wp_enqueue_script(
    'gutenberg-tooltip-script',
    plugins_url( 'build/index.js', __FILE__ ),
    $asset_file['dependencies'],
    $asset_file['version']
  );
}
add_action( 'enqueue_block_editor_assets', 'enqueue_gutenberg_tooltip_script' );