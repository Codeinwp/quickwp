/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import { parse } from '@wordpress/blocks';

import {
	Button,
	Spinner
} from '@wordpress/components';

import {
	useDispatch,
	useSelect
} from '@wordpress/data';

/**
 * Internal dependencies.
 */
import TemplatePreview from '../components/TemplatePreview';

const Template = () => {
	const { onContinue } = useDispatch( 'quickwp/data' );

	const {
		template,
		hasLoaded
	} = useSelect( ( select ) => {
		const {
			getHomepage,
			getProcessStatus
		} = select( 'quickwp/data' );

		const homepage = getHomepage();

		return {
			template: homepage ? parse( homepage ) : [],
			hasLoaded: true === getProcessStatus( 'homepage' )
		};
	});

	if ( ! hasLoaded ) {
		return (
			<div className="flex flex-1 flex-row items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-row gap-8 items-center">
			<div className="flex flex-col basis-full gap-8 justify-center">
				<h2 className="text-fg text-4xl not-italic font-medium leading-10 max-w-5xl">
					{ __(
						'Pick a layout for your homepage.',
						'quickwp'
					) }
				</h2>

				<Button variant="primary" onClick={ onContinue }>
					{ __( 'Continue', 'quickwp' ) }
				</Button>
			</div>

			<TemplatePreview
				template={ template }
				canScroll={ true }
			/>
		</div>
	);
};

export default Template;
