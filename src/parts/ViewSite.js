/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import { Button } from '@wordpress/components';

import { useDispatch } from '@wordpress/data';

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

const ViewSite = () => {
	const { createErrorNotice } = useDispatch( 'core/notices' );

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

			createErrorNotice( errorMessage, { type: 'snackbar' });
		}
	};

	return (
		<div className="flex flex-1 flex-row gap-8 items-center">
			<div className="flex flex-col basis-full gap-8 justify-center">
				<h2 className="text-fg text-4xl not-italic font-medium leading-10 max-w-5xl">
					{ __(
						'Your site is ready. Good job!',
						'quickwp'
					) }
				</h2>

				{ Boolean( window.quickwp.isGuidedMode ) && (
					<h3 className="text-fg text-2xl not-italic font-medium leading-10 max-w-5xl">
						{ __(
							'You can download the ZIP file and install it to your WordPress site.',
							'quickwp'
						) }
					</h3>
				) }

				<div className="flex flex-row gap-4">
					{ Boolean( window.quickwp.isGuidedMode ) && (
						<Button
							variant="primary"
							onClick={ handleExport }
						>
							{ __( 'Download ZIP', 'quickwp' ) }
						</Button>
					) }

					<Button
						variant="primary"
						href={ window.quickwp.siteUrl }
					>
						{ __( 'View Site', 'quickwp' ) }
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ViewSite;
