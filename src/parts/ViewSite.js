/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import { Button } from '@wordpress/components';

const ViewSite = () => {
	return (
		<div className="flex flex-1 flex-row gap-8 items-center">
			<div className="flex flex-col basis-full gap-8 justify-center">
				<h2 className="text-fg text-4xl not-italic font-medium leading-10 max-w-5xl">
					{ __(
						'Your site is ready. Good job!',
						'quickwp'
					) }
				</h2>

				<h3 className="text-fg text-2xl not-italic font-medium leading-10 max-w-5xl">
					{ __(
						'You can download the ZIP file and install it to your WordPress site.',
						'quickwp'
					) }
				</h3>

				<div className="flex flex-row gap-4">
					<Button
						variant="primary"
						onClick={ () => {} }
					>
						{ __( 'Download ZIP', 'quickwp' ) }
					</Button>

					<Button
						variant="primary"
						onClick={ () => {} }
					>
						{ __( 'View Site', 'quickwp' ) }
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ViewSite;
