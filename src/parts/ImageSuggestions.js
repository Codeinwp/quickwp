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

import { useDispatch } from '@wordpress/data';

import { useState } from '@wordpress/element';

const dummy = [
	'https://mystock.themeisle.com/wp-content/uploads/2022/06/52172949534_aa8893fd8f_c.jpg?v=1',
	'https://mystock.themeisle.com/wp-content/uploads/2022/06/52171667257_e4c90f0a38_c.jpg?v=2',
	'https://mystock.themeisle.com/wp-content/uploads/2022/06/52172949534_aa8893fd8f_c.jpg?v=3',
	'https://mystock.themeisle.com/wp-content/uploads/2022/06/52172949534_aa8893fd8f_c.jpg?v=4',
	'https://mystock.themeisle.com/wp-content/uploads/2022/06/52172949534_aa8893fd8f_c.jpg?v=5',
	'https://mystock.themeisle.com/wp-content/uploads/2022/06/52171667257_e4c90f0a38_c.jpg?v=6',
	'https://mystock.themeisle.com/wp-content/uploads/2022/06/52171667257_e4c90f0a38_c.jpg?v=7',
	'https://mystock.themeisle.com/wp-content/uploads/2022/06/52172949534_aa8893fd8f_c.jpg?v=8',
	'https://mystock.themeisle.com/wp-content/uploads/2022/06/52171667257_e4c90f0a38_c.jpg?v=9'
];

const ImageSuggestions = () => {
	const [ value, setValue ] = useState([]);

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
					{ dummy.map( ( image, index ) => (
						<div
							key={ index }
							className={ classNames(
								'flex flex-1 cursor-pointer',
								{
									'outline outline-offset-2 outline-2 outline-white grayscale': value.includes( image )
								}
							) }
							onClick={ () => {
								if ( value.includes( image ) ) {
									setValue( value.filter( ( item ) => item !== image ) );
								} else {
									setValue([ ...value, image ]);
								}
							}}
						>
							{ value.includes( image ) && (
								<div className="bg-white w-8 h-8 absolute flex justify-center items-center shadow-selected -right-1 -top-1 z-10">
									<Icon
										icon={ check }
										size={ 24 }
									/>
								</div>
							) }

							<img
								className="object-cover aspect-square"
								src={ image }
							/>
						</div>
					) ) }
				</div>
			</div>
		</div>
	);
};

export default ImageSuggestions;
