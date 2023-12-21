<?php
/**
 * Main class.
 * 
 * @package Codeinwp/QuickWP
 */

namespace ThemeIsle\QuickWP;

/**
 * Main class.
 */
class Main {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->register_hooks();
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

		wp_enqueue_script(
			'quickwp',
			QUICKWP_URL . 'build/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		wp_set_script_translations( 'quickwp', 'quickwp' );
	}
}
