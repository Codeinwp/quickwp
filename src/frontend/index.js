/**
 * WordPress dependencies.
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import './style.scss';

const downloadBlob = ( filename, content, contentType = '' ) => {
	if ( ! filename || ! content ) {
		return;
	}

	const file = new window.Blob([ content ], { type: contentType });
	const url = window.URL.createObjectURL( file );
	const anchorElement = document.createElement( 'a' );
	anchorElement.href = url;
	anchorElement.download = filename;
	anchorElement.style.display = 'none';
	document.body.appendChild( anchorElement );
	anchorElement.click();
	document.body.removeChild( anchorElement );
	window.URL.revokeObjectURL( url );
};

const handleExport = async() => {
	try {
		const response = await apiFetch({
			path: '/wp-block-editor/v1/export',
			parse: false,
			headers: {
				Accept: 'application/zip'
			}
		});
		const blob = await response.blob();
		const contentDisposition = response.headers.get(
			'content-disposition'
		);
		const contentDispositionMatches =
			contentDisposition.match( /=(.+)\.zip/ );
		const fileName = contentDispositionMatches[ 1 ] ?
			contentDispositionMatches[ 1 ] :
			'edit-site-export';

		downloadBlob( fileName + '.zip', blob, 'application/zip' );
	} catch ( errorResponse ) {
		let error = {};
		try {
			error = await errorResponse.json();
		} catch ( e ) {}
		const errorMessage =
			error.message && 'unknown_error' !== error.code ?
				error.message :
				__( 'An error occurred while creating the site export.', 'quickwp' );

		console.error( errorMessage );
	}
};

const toolbar = document.createElement( 'div' );

toolbar.classList.add( 'quickwp-toolbar' );

const paragraph = document.createElement( 'p' );
paragraph.textContent = 'You can download the ZIP file and install it to your WordPress site.';
toolbar.appendChild( paragraph );

const button = document.createElement( 'button' );
button.textContent = 'Download';
toolbar.appendChild( button );

button.addEventListener( 'click', handleExport );

document.body.appendChild( toolbar );
