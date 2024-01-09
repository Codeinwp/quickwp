<?php
/**
 * Main class.
 * 
 * @package Codeinwp/QuickWP
 */

namespace ThemeIsle\QuickWP;

use ThemeIsle\QuickWP\API;

/**
 * Main class.
 */
class Main {
	/**
	 * API instance.
	 *
	 * @var API
	 */
	private $api;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->register_hooks();

		$this->api = new API();
	}

	/**
	 * Register hooks and actions.
	 * 
	 * @return void
	 */
	private function register_hooks() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Enqueue assets.
	 * 
	 * @return void
	 */
	public function enqueue_assets() {
		$current_screen = get_current_screen();

		if (
			! current_user_can( 'manage_options' ) ||
			! isset( $current_screen->id ) ||
			'site-editor' !== $current_screen->id
		) {
			return;
		}

		$asset_file = include QUICKWP_PATH . '/build/index.asset.php';

		wp_enqueue_style(
			'quickwp',
			QUICKWP_URL . 'build/style-index.css',
			array( 'wp-components' ),
			$asset_file['version']
		);

		wp_enqueue_script(
			'quickwp',
			QUICKWP_URL . 'build/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		wp_set_script_translations( 'quickwp', 'quickwp' );

		wp_localize_script(
			'quickwp',
			'quickwp',
			array(
				'api' => $this->api->get_endpoint(),
			)
		);
	}
}
