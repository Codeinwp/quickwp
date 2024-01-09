/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import {
	Button,
	ColorIndicator,
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

const ColorPalette = () => {
	const { onContinue } = useDispatch( 'quickwp/data' );

	const {
		palette,
		template,
		hasLoaded
	} = useSelect( ( select ) => {
		const { getBlocks } = select( 'core/block-editor' );

		const {
			getColorPalette,
			getProcessStatus
		} = select( 'quickwp/data' );

		return {
			palette: getColorPalette(),
			template: getBlocks(),
			hasLoaded: true === getProcessStatus( 'color_palette' )
		};
	});

	const onSubmit = async() => {
		onContinue();
	};

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
						'Let\'s give your site a color that fits to your brand.',
						'quickwp'
					) }
				</h2>

				<div className="flex items-center gap-4 mt-8">
					{ palette.map( ( color ) => (
						<ColorIndicator
							colorValue={ color.color }
							className="w-12 h-12"
						/>
					) ) }
				</div>

				<Button variant="primary" onClick={ onSubmit }>
					{ __( 'Continue', 'quickwp' ) }
				</Button>
			</div>

			<TemplatePreview template={ template } />
		</div>
	);
};

export default ColorPalette;
