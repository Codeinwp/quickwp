/**
 * External dependencies.
 */
import classNames from 'classnames';

import { check } from '@wordpress/icons';

/**
 * WordPress dependencies.
 */
import {
	__,
	sprintf
} from '@wordpress/i18n';

import {
	Button,
	Disabled,
	Icon,
	Spinner,
	TextControl
} from '@wordpress/components';

import {
	useDispatch,
	useSelect
} from '@wordpress/data';

import {
	useEffect,
	useState
} from '@wordpress/element';

import { ENTER } from '@wordpress/keycodes';

/**
 * Internal dependencies.
 */
import { requestImages } from '../utils';

const ImageSuggestions = () => {
	const [ search, setSearch ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ images, setImages ] = useState([]);

	const {
		queuedImages,
		imageKeywords,
		activeImageKeyword,
		selectedImages,
		hasLoaded
	} = useSelect( select => {
		const {
			getImages,
			getImageKeywords,
			getActiveImageKeyword,
			getSelectedImages,
			getProcessStatus
		} = select( 'quickwp/data' );

		const activeImageKeyword = getActiveImageKeyword();

		const queuedImages = getImages( activeImageKeyword ) || [];

		return {
			queuedImages,
			imageKeywords: getImageKeywords() || [],
			activeImageKeyword,
			selectedImages: getSelectedImages() || [],
			hasLoaded: true === getProcessStatus( 'images' )
		};
	});

	const {
		onContinue,
		setActiveImageKeyword,
		toggleSelectedImage
	} = useDispatch( 'quickwp/data' );

	const onSearch = async( query = search ) => {
		if ( ! query || activeImageKeyword === query ) {
			return;
		}

		if ( query !== search ) {
			setSearch( query );
		}

		setActiveImageKeyword( query );

		setIsLoading( true );
		await requestImages( query );
		setIsLoading( false );
	};

	useEffect( () => {
		const newImages = [
			...selectedImages,
			...queuedImages.filter( qImage => ! selectedImages.find( sImage => sImage.id === qImage.id ) )
		];

		if ( newImages.length !== images.length || ! newImages.every( ( img, index ) => img.id === images[index]?.id ) ) {
			setImages( newImages );
		}
	}, [ queuedImages ]);

	if ( ! hasLoaded ) {
		return (
			<div className="flex flex-1 flex-row items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-row gap-12 items-center">
			<div className="flex flex-col basis-1/3 gap-4 justify-center">
				<h2 className="text-fg text-4xl not-italic font-medium leading-10 max-w-5xl">
					{ __(
						'Pick out images that you like, and we\'ll include them in the designs.',
						'quickwp'
					) }
				</h2>

				<TextControl
					label={ __( 'Search for Images', 'quickwp' ) }
					placeholder={ __( 'Search for Images', 'quickwp' ) }
					hideLabelFromVision={ true }
					value={ search }
					onChange={ setSearch }
					onKeyDown={ e => {
						if ( ENTER === e.keyCode ) {
							onSearch();
						}
					}}
					disabled={ isLoading }
					className="is-light mt-4"
				/>

				<div className="flex gap-2 pt-1 pb-2">
					{ imageKeywords.map( ( keyword ) => {
						return (
							<Button
								key={ keyword }
								variant="secondary"
								isSmall={ true }
								className={ classNames(
									'is-token',
									{
										'is-active': keyword === activeImageKeyword
									}
								) }
								onClick={ () => {
									onSearch( keyword );
								} }
							>
								{ keyword }
							</Button>
						);
					}) }
				</div>

				<Button
					variant="primary"
					className="mt-4"
					onClick={ onContinue }
				>
					{ __( 'Continue', 'quickwp' ) }
				</Button>
			</div>

			<div className="block basis-2/3 self-start max-h-80vh">
				{ ( isLoading ) && (
					<div className="flex flex-1 flex-row items-center justify-center py-4">
						<Spinner />
					</div>
				) }

				<Disabled isDisabled={ isLoading }>
					<div className="grid grid-cols-5 gap-4 p-1 max-h-80vh overflow-scroll">
						{ images.map( image => (
							<div
								key={ image.id }
								className="flex flex-col flex-1 cursor-pointer relative"
								onClick={ () =>  toggleSelectedImage( image ) }
							>
								{ selectedImages.includes( image ) && (
									<div
										className="bg-active w-10 h-10 absolute flex justify-center items-center -right-1 -top-1 z-10"
									>
										<Icon
											icon={ check }
											size={ 24 }
											className="fill-white"
										/>
									</div>
								) }

								<img
									className={ classNames(
										'object-cover aspect-square',
										{
											'outline outline-4 outline-active': selectedImages.includes( image )
										}
									) }
									src={ image.src.original }
									alt={ image.alt }
								/>

								<p className="text-slate-500 hover:text-slate-700 no-underline not-italic font-medium text-center pt-2">
									<a
										href={ image.url }
										target="_blank"
									>
										{ sprintf(
											__(
												'Photo by %s on Pexels',
												'quickwp'
											),
											image.photographer
										)}
									</a>
								</p>
							</div>
						) ) }
					</div>
				</Disabled>
			</div>
		</div>
	);
};

export default ImageSuggestions;
