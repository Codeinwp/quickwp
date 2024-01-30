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

		if ( QUICKWP_APP_GUIDED_MODE ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
			add_action( 'admin_init', array( $this, 'guided_access' ) );
			add_action( 'show_admin_bar', '__return_false' );
		}
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

		$asset_file = include QUICKWP_APP_PATH . '/build/backend/index.asset.php';

		wp_enqueue_style(
			'quickwp',
			QUICKWP_APP_URL . 'build/backend/style-index.css',
			array( 'wp-components' ),
			$asset_file['version']
		);

		wp_enqueue_script(
			'quickwp',
			QUICKWP_APP_URL . 'build/backend/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		wp_set_script_translations( 'quickwp', 'quickwp' );

		wp_localize_script(
			'quickwp',
			'quickwp',
			array(
				'api'          => $this->api->get_endpoint(),
				'siteUrl'      => get_site_url(),
				'isGuidedMode' => QUICKWP_APP_GUIDED_MODE
			)
		);
	}

	/**
	 * Enqueue frontend assets.
	 * 
	 * @return void
	 */
	public function enqueue_frontend_assets() {
		$asset_file = include QUICKWP_APP_PATH . '/build/frontend/frontend.asset.php';

		wp_enqueue_style(
			'quickwp-frontend',
			QUICKWP_APP_URL . 'build/frontend/style-index.css',
			array(),
			$asset_file['version']
		);

		wp_enqueue_script(
			'quickwp-frontend',
			QUICKWP_APP_URL . 'build/frontend/frontend.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}

	/**
	 * Guided access.
	 * 
	 * @return void
	 */
	public function guided_access() {
		global $pagenow;

		if ( defined( 'DOING_AJAX' ) && DOING_AJAX || defined( 'REST_REQUEST' ) && REST_REQUEST ) {
			return;
		}

		// Allow access to themes.php page only
		if ( 'site-editor.php' !== $pagenow ) {
			wp_redirect( admin_url( 'site-editor.php?quickwp=true&canvas=edit' ) );
			exit;
		}
	}
}
