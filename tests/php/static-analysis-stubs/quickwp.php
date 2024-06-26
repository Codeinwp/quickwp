<?php
/**
 * QuickWP Constants.
 * 
 * Adds QuickWP constants for PHPStan to use.
 */

define( 'QUICKWP_APP_BASEFILE', __FILE__ );
define( 'QUICKWP_APP_URL', plugins_url( '/', __FILE__ ) );
define( 'QUICKWP_APP_PATH', dirname( __FILE__ ) );
define( 'QUICKWP_APP_VERSION', '1.0.0' );
define( 'QUICKWP_APP_API', 'quickwp/v1' );
