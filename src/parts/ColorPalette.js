/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import {
	Button,
	ColorIndicator,
	TextControl
} from '@wordpress/components';

import {
	useDispatch,
	useSelect
} from '@wordpress/data';

/**
 * Internal dependencies.
 */
import TemplatePreview from '../components/TemplatePreview';

const palette = [
	{
		slug: 'ti-bg',
		color: '#FFFFFF',
		name: 'Background'
	},
	{
		slug: 'ti-fg',
		color: '#202020',
		name: 'Text'
	},
	{
		slug: 'ti-accent',
		color: '#325ce8',
		name: 'Accent'
	},
	{
		slug: 'ti-accent-secondary',
		color: '#1B47DA',
		name: 'Accent Secondary'
	},
	{
		slug: 'ti-bg-inv',
		color: '#1A1919',
		name: 'Dark Background'
	},
	{
		slug: 'ti-bg-alt',
		color: '#f7f7f3',
		name: 'Background Alt'
	},
	{
		slug: 'ti-fg-alt',
		color: '#FBFBFB',
		name: 'Inverted Text'
	}
];

const ColorPalette = () => {
	const { onContinue } = useDispatch( 'quickwp/data' );

	const { template } = useSelect( ( select ) => {
		const { getBlocks } = select( 'core/block-editor' );

		return {
			template: getBlocks()
		};
	});

	return (
		<div className="flex flex-1 flex-row gap-8 items-center">
			<div className="flex flex-col basis-full gap-8 justify-center">
				<h2 className="text-fg text-4xl not-italic font-medium leading-10 max-w-5xl">
					{ __(
						'Let\'s give your site a color that fits to your brand. What is your primary brand color?',
						'quickwp'
					) }
				</h2>

				<div className="flex items-center gap-4">
					<ColorIndicator
						colorValue={ '#325ce8' }
						className="w-16 h-16"
					/>

					<TextControl
						label={ __( 'Primary Color', 'quickwp' ) }
						value={ '#325ce8' }
						className="m-0"
						hideLabelFromVision={ true }
						onChange={ () => {} }
					/>
				</div>

				<div className="flex items-center gap-4 mt-8">
					{ palette.map( ( color ) => (
						<ColorIndicator
							colorValue={ color.color }
							className="w-12 h-12"
						/>
					) ) }
				</div>

				<Button variant="primary" onClick={ onContinue }>
					{ __( 'Continue', 'quickwp' ) }
				</Button>
			</div>

			<TemplatePreview template={ template } />
		</div>
	);
};

export default ColorPalette;
