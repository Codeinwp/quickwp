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

define( 'QUICKWP_BASEFILE', __FILE__ );
define( 'QUICKWP_URL', plugins_url( '/', __FILE__ ) );
define( 'QUICKWP_PATH', __DIR__ );
define( 'QUICKWP_VERSION', '1.0.0' );

$vendor_file = QUICKWP_PATH . '/vendor/autoload.php';

if ( is_readable( $vendor_file ) ) {
	require_once $vendor_file;
}

$quickwp = new \ThemeIsle\QuickWP\Main();
