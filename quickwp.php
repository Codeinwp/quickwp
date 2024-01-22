<?php
/**
 * Plugin Name: QuickWP
 * Plugin URI: https://quickwp.ai
 * Description: A plugin to help you build websites quickly.
 * Author: ThemeIsle
 * Version: 1.0.0
 * Author URI: https://quickwp.ai
 * License: GPL3+
 * Text Domain: quickwp
 * 
 * @package Codeinwp/QuickWP
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'QUICKWP_APP_BASEFILE', __FILE__ );
define( 'QUICKWP_APP_URL', plugins_url( '/', __FILE__ ) );
define( 'QUICKWP_APP_PATH', __DIR__ );
define( 'QUICKWP_APP_VERSION', '1.0.0' );
define( 'QUICKWP_APP_API', 'https://aaf0-103-217-244-105.ngrok-free.app/api/' );

$vendor_file = QUICKWP_APP_PATH . '/vendor/autoload.php';

if ( is_readable( $vendor_file ) ) {
	require_once $vendor_file;
}

$quickwp = new \ThemeIsle\QuickWP\Main();
