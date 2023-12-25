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

/**
 * Internal dependencies.
 */
import TemplatePreview from '../components/TemplatePreview';

const dummy = [ 1, 2, 3, 4 ];

const Template = () => {
	const [ value, setValue ] = useState();

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
						'Pick a layout for your homepage.',
						'quickwp'
					) }
				</h2>

				<Button variant="primary" onClick={ onContinue }>
					{ __( 'Continue', 'quickwp' ) }
				</Button>
			</div>

			<div className="block basis-full overflow-scroll max-h-80vh">
				<div className="grid grid-cols-2 gap-4 p-1">
					{ dummy.map( ( image, index ) => (
						<div
							key={ index }
							className={ classNames(
								'flex flex-1 cursor-pointer max-w-sm max-h-md aspect-vert',
								{
									'outline outline-offset-2 outline-2 outline-white grayscale': value === image
								}
							) }
							onClick={ () => {
								setValue( value === image ? null : image );
							}}
						>
							{ value === image && (
								<div className="bg-white w-8 h-8 absolute flex justify-center items-center shadow-selected -right-1 -top-1 z-10">
									<Icon
										icon={ check }
										size={ 24 }
									/>
								</div>
							) }

							<TemplatePreview
								template={ template }
							/>
						</div>
					) ) }
				</div>
			</div>
		</div>
	);
};

export default Template;
