/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import {
	Button,
	TextareaControl
} from '@wordpress/components';

import {
	useDispatch,
	useSelect
} from '@wordpress/data';

/**
 * Internal dependencies.
 */
import { generateImages } from '../utils';

const SiteDescription = () => {
	const { siteDescription } = useSelect( select => {
		return {
			siteDescription: select( 'quickwp/data' ).getSiteDescription()
		};
	});

	const {
		onContinue,
		setSiteDescription
	} = useDispatch( 'quickwp/data' );

	const onSubmit = async() => {
		if ( 4 > siteDescription?.length ) {
			return;
		}

		generateImages();

		onContinue();
	};

	return (
		<div className="flex flex-1 flex-col justify-center gap-8">
			<h2 className="text-fg text-4xl not-italic font-medium leading-10 max-w-5xl">
				{ __(
					'Great! We\'d love to learn more about your brand to create a tailor-made website just for you.',
					'quickwp'
				) }
			</h2>

			<TextareaControl
				label={ __( 'Site Description', 'quickwp' ) }
				placeholder={ __(
					'e.g. Our brand, LifeUp, specializes in life coaching seminars targeted towards businesses in the UK. In addition to group seminars, we offer personal training and one-on-one calls to cater to a variety of needs.',
					'quickwp'
				) }
				value={ siteDescription }
				onChange={ setSiteDescription }
				hideLabelFromVision={ true }
				autoFocus={ true }
			/>

			<Button
				variant="primary"
				disabled={ ! 4 > siteDescription?.length }
				onClick={ onSubmit }
			>
				{ __( 'Continue', 'quickwp' ) }
			</Button>
		</div>
	);
};

export default SiteDescription;
