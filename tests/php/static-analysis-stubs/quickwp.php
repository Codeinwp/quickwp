<?php
/**
 * QuickWP Constants.
 * 
 * Adds QuickWP constants for PHPStan to use.
 */

define( 'QUICKWP_BASEFILE', __FILE__ );
define( 'QUICKWP_URL', plugins_url( '/', __FILE__ ) );
define( 'QUICKWP_PATH', dirname( __FILE__ ) );
define( 'QUICKWP_VERSION', '1.0.0' );
define( 'QUICKWP_API', 'quickwp/v1' );