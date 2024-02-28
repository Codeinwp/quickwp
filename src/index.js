/**
 * WordPress dependencies.
 */
import { createPortal } from '@wordpress/element';

import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies.
 */
import './style.scss';
import './store';
import App from './App';

const Render = () => {
	return createPortal( <App />, document.body );
};

// Check the URL for the quickwp query string.
const urlParams = new URLSearchParams( window.location.search );
const hasFlag = urlParams.get( 'quickwp' );

// If the quickwp query string is present, render the quickwp modal.
if ( 'true' === hasFlag ) {
	registerPlugin( 'quickwp', {
		render: Render
	});
}
