/**
 * WordPress dependencies.
 */
import {
	ColorIndicator,
	ColorPicker as WPColorPicker,
	Popover
} from '@wordpress/components';

import { useState } from '@wordpress/element';

const ColorPicker = ({
	value,
	onChange
}) => {
	const [ isOpen, setIsOpen ] = useState( false );

	return (
		<ColorIndicator
			colorValue={ value }
			className="w-12 h-12 cursor-pointer"
			onClick={ e => {
				if ( ! e.target.classList.contains( 'component-color-indicator' ) ) {
					return;
				}

				setIsOpen( ! isOpen );
			} }
		>
			{ isOpen && (
				<Popover
					position="bottom center"
					className="w-12 h-12"
					offset={ 10 }
					onClose={ () => setIsOpen( false ) }
				>
					<WPColorPicker
						colorValue={ value }
						onChange={ onChange }
					/>
				</Popover>
			) }
		</ColorIndicator>
	);
};

export default ColorPicker;
