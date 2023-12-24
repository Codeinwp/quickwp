/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import { Button, TextControl } from '@wordpress/components';

import { useDispatch } from '@wordpress/data';

import { useState } from '@wordpress/element';

import { ENTER } from '@wordpress/keycodes';

const SiteTopic = () => {
	const [ value, setValue ] = useState( '' );

	const { onContinue } = useDispatch( 'quickwp/data' );

	const onEnter = ( e ) => {
		if ( ENTER === e.keyCode && !! value ) {
			onContinue();
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
				value={ value }
				onChange={ setValue }
				onKeyDown={ onEnter }
				hideLabelFromVision={ true }
				autoFocus={ true }
			/>

			<Button
				variant="primary"
				disabled={ ! value }
				onClick={ onContinue }
			>
				{ __( 'Continue', 'quickwp' ) }
			</Button>
		</div>
	);
};

export default SiteTopic;
