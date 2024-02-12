/**
 * External dependencies.
 */
import classNames from 'classnames';

import { rotateRight } from '@wordpress/icons';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import {
	Button,
	Disabled,
	Icon,
	Spinner
} from '@wordpress/components';

import {
	useDispatch,
	useSelect
} from '@wordpress/data';

import {
	useEffect,
	useState
} from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { generateColorPalette } from '../utils';
import ColorPicker from '../components/ColorPicker';
import TemplatePreview from '../components/TemplatePreview';

const ColorPalette = () => {
	const [ isRegenerating, setIsRegenerating ] = useState( false );

	const { onContinue } = useDispatch( 'quickwp/data' );

	const {
		globalStylesId,
		defaultStyles,
		palette,
		template,
		hasLoaded
	} = useSelect( ( select ) => {
		const {
			__experimentalGetCurrentGlobalStylesId,
			__experimentalGetCurrentThemeBaseGlobalStyles
		} = select( 'core' );

		const {
			getColorPalette,
			getProcessStatus,
			getHomepage
		} = select( 'quickwp/data' );

		const globalStylesId = __experimentalGetCurrentGlobalStylesId();

		return {
			globalStylesId,
			defaultStyles: __experimentalGetCurrentThemeBaseGlobalStyles(),
			palette: getColorPalette(),
			template: getHomepage() || [],
			hasLoaded: true === getProcessStatus( 'color_palette' ) && true === getProcessStatus( 'homepage' )
		};
	});

	const { editEntityRecord } = useDispatch( 'core' );

	const { setColorPalette } = useDispatch( 'quickwp/data' );

	useEffect( () => {
		if ( hasLoaded && Boolean( palette.length ) ) {
			const colorPalette = palette.map( color => {
				const paletteColor = defaultStyles.settings.color.palette.theme.find( paletteColor => paletteColor.slug === color.slug );

				if ( paletteColor ) {
					return {
						...color,
						name: paletteColor.name
					};
				}

				return color;
			});

			const settings = {
				color: {
					palette: {
						theme: [
							...colorPalette
						]
					}
				}
			};

			editEntityRecord( 'root', 'globalStyles', globalStylesId, {
				settings
			});
		}
	}, [ hasLoaded, palette ]);

	const onChangeColor = ( value, slug ) => {
		const newPalette = palette.map( color => {
			if ( color.slug === slug ) {
				return {
					...color,
					color: value
				};
			}

			return color;
		});

		setColorPalette( newPalette );
	};

	const onSubmit = async() => {
		onContinue();
	};

	const onRegenerate = async() => {
		setIsRegenerating( true );
		await generateColorPalette();
		setIsRegenerating( false );
	};

	if ( ! hasLoaded ) {
		return (
			<div className="flex flex-1 flex-row items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-row gap-12 items-center">
			<Disabled isDisabled={ isRegenerating }>
				<div className="flex flex-col basis-1/3 gap-8 justify-center">
					<h2 className="text-fg text-4xl not-italic font-medium leading-10 max-w-5xl">
						{ __(
							'Let\'s give your site a color that fits to your brand.',
							'quickwp'
						) }
					</h2>

					<div className="flex items-center gap-4 mt-8">
						{ palette.map( ( color ) => (
							<ColorPicker
								key={ color.slug }
								value={ color.color }
								onChange={ e => onChangeColor( e, color.slug ) }
							/>
						) ) }

						<Icon
							icon={ rotateRight }
							className={
								classNames(
									'cursor-pointer fill-white',
									{
										'animate-spin': isRegenerating
									}
								)
							}
							onClick={ onRegenerate }
						/>
					</div>

					<Button
						variant="primary"
						onClick={ onSubmit }
						disabled={ isRegenerating }
					>
						{ __( 'Continue', 'quickwp' ) }

						{ isRegenerating && <Spinner />}
					</Button>
				</div>
			</Disabled>

			<TemplatePreview
				template={ template }
				canScroll={ true }
				className="!basis-2/3"
			/>
		</div>
	);
};

export default ColorPalette;
