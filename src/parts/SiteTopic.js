/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import {
	Button,
	TextControl
} from '@wordpress/components';

import {
	useDispatch,
	useSelect
} from '@wordpress/data';

import { ENTER } from '@wordpress/keycodes';

/**
 * Internal dependencies.
 */
import { generateColorPalette } from '../utils';

const SiteTopic = () => {
	const { siteTopic } = useSelect( select => {
		return {
			siteTopic: select( 'quickwp/data' ).getSiteTopic()
		};
	});

	const {
		onContinue,
		setSiteTopic
	} = useDispatch( 'quickwp/data' );

	const onSubmit = async() => {
		if ( 4 > siteTopic?.length ) {
			return;
		}

		// At this point, we start the color palette generation process.
		generateColorPalette();
		onContinue();
	};

	const onEnter = ( e ) => {
		if ( ENTER === e.keyCode && !! siteTopic ) {
			onSubmit();
		}
	};

	return (
		<div className="flex flex-1 flex-col justify-center gap-8">
			<h2 className="text-fg text-4xl not-italic font-medium leading-10 max-w-5xl">
				{ __(
					'Welcome. What kind of site are you building?',
					'quickwp'
				) }
			</h2>

			<TextControl
				label={ __( 'Site Topic', 'quickwp' ) }
				placeholder={ __(
					'e.g. Web Agency, Tech Reviewer',
					'quickwp'
				) }
				value={ siteTopic }
				onChange={ setSiteTopic }
				onKeyDown={ onEnter }
				hideLabelFromVision={ true }
				autoFocus={ true }
			/>

			<Button
				variant="primary"
				disabled={ ! 4 > siteTopic?.length }
				onClick={ onSubmit }
			>
				{ __( 'Continue', 'quickwp' ) }
			</Button>
		</div>
	);
};

export default SiteTopic;
