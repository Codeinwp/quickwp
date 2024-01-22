/**
 * External dependencies.
 */
import classNames from 'classnames';

import { check } from '@wordpress/icons';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

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

import { useState } from '@wordpress/element';

import { ENTER } from '@wordpress/keycodes';

/**
 * Internal dependencies.
 */
import { requestImages } from '../utils';

const ImageSuggestions = () => {
	const [ value, setValue ] = useState([]);
	const [ search, setSearch ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );

	const {
		images,
		imageKeywords,
		activeImageKeyword,
		hasLoaded
	} = useSelect( select => {
		const {
			getImages,
			getImageKeywords,
			getActiveImageKeyword,
			getProcessStatus
		} = select( 'quickwp/data' );

		const activeImageKeyword = getActiveImageKeyword();

		const images = getImages( activeImageKeyword ) || [];

		return {
			images,
			imageKeywords: getImageKeywords() || [],
			activeImageKeyword,
			hasLoaded: true === getProcessStatus( 'images' )
		};
	});

	const {
		onContinue,
		setActiveImageKeyword
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
						'Pick out images that you like, and we\'ll include them in the designs.',
						'quickwp'
					) }
				</h2>

				<Button variant="primary" onClick={ onContinue }>
					{ __( 'Continue', 'quickwp' ) }
				</Button>
			</div>

			<div className="block basis-full self-start max-h-80vh">
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
					className="is-dark"
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

				{ ( isLoading ) && (
					<div className="flex flex-1 flex-row items-center justify-center py-4">
						<Spinner />
					</div>
				) }

				<Disabled isDisabled={ isLoading }>
					<div className="grid grid-cols-3 gap-4 p-1 max-h-80vh overflow-scroll">
						{ images.map( image => (
							<div
								key={ image.id }
								className={ classNames(
									'flex flex-1 cursor-pointer',
									{
										'outline outline-offset-2 outline-2 outline-white grayscale': value.includes( image.id )
									}
								) }
								onClick={ () => {
									if ( value.includes( image.id ) ) {
										setValue( value.filter( ( item ) => item !== image.id ) );
									} else {
										setValue([ ...value, image.id ]);
									}
								}}
							>
								{ value.includes( image.id ) && (
									<div className="bg-white w-8 h-8 absolute flex justify-center items-center shadow-selected -right-1 -top-1 z-10">
										<Icon
											icon={ check }
											size={ 24 }
										/>
									</div>
								) }

								<img
									className="object-cover aspect-square"
									src={ image.src.original }
								/>
							</div>
						) ) }
					</div>
				</Disabled>
			</div>
		</div>
	);
};

export default ImageSuggestions;
