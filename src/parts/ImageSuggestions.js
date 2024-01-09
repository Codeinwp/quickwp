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
	Icon
} from '@wordpress/components';

import {
	useDispatch,
	useSelect
} from '@wordpress/data';

import { useState } from '@wordpress/element';

const ImageSuggestions = () => {
	const [ value, setValue ] = useState([]);

	const { images } = useSelect( select => {
		const images = select( 'quickwp/data' ).getImages() || [];

		return {
			images: images.slice( 0, 9 )
		};
	});

	const { onContinue } = useDispatch( 'quickwp/data' );

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

			<div className="block basis-full overflow-scroll max-h-80vh">
				<div className="grid grid-cols-3 gap-4 p-1">
					{ images.map( ( image, index ) => (
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
			</div>
		</div>
	);
};

export default ImageSuggestions;
