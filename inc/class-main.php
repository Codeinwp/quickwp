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

		if ( defined( 'QUICKWP_APP_GUIDED_MODE' ) && QUICKWP_APP_GUIDED_MODE ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
			add_action( 'admin_init', array( $this, 'guided_access' ) );
			add_filter( 'show_admin_bar', '__return_false' ); // phpcs:ignore WordPressVIPMinimum.UserExperience.AdminBarRemoval.RemovalDetected
		}

		add_action( 'wp_print_footer_scripts', array( $this, 'print_footer_scripts' ) );
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
				'isGuidedMode' => defined( 'QUICKWP_APP_GUIDED_MODE' ) && QUICKWP_APP_GUIDED_MODE,
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
	 * Print footer scripts.
	 * 
	 * @return void
	 */
	public function print_footer_scripts() {
		if ( ! is_admin() ) {
			return;
		} 

		$current_screen = get_current_screen();
	
		if (
			! current_user_can( 'manage_options' ) ||
			! isset( $current_screen->id ) ||
			'site-editor' !== $current_screen->id
		) {
			return;
		}

		?>
		<script>
			/**
			 * We use this script to adjust the vh units in the DOM to match the actual viewport height in the editor.
			 * This is necessary because the editor's viewport height is not the same as the browser's viewport height.
			 * In some blocks we use the vh unit to set the height of elements, and we need to adjust it to match the editor's viewport height.
			 */
			const adjustVHUnits = () => {
				const parentVHValue = getComputedStyle( document.documentElement).getPropertyValue( '--parent-vh' );
				const parentVH = parseInt( parentVHValue, 10 );

				if ( isNaN( parentVH ) ) {
					return;
				}

				const convertVHtoPixels = ( vhValue ) => ( vhValue / 100 ) * parentVH;

				document.querySelectorAll( '*' ).forEach( el => {
					const style = el.getAttribute( 'style' );

					if ( style && style.includes( 'vh' ) ) {
						const updatedStyle = style.replace( /(\d+(\.\d+)?)vh/g, ( match, vhValue ) => {
							const pixelValue = convertVHtoPixels( parseFloat( vhValue ) );
							return `${ pixelValue }px`;
						});

						el.setAttribute( 'style', updatedStyle );
					}
				});
			}

			document.addEventListener( 'DOMContentLoaded', adjustVHUnits );
		</script>
		<?php
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

		if ( 'site-editor.php' !== $pagenow ) {
			wp_safe_redirect( admin_url( 'site-editor.php?quickwp=true&canvas=edit' ) );
			exit;
		}
	}
}
