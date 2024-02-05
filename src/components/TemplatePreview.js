/**
 * External dependencies.
 */
import classNames from 'classnames';

/**
 * WordPress dependencies.
 */
import { parse } from '@wordpress/blocks';

import { BlockPreview } from '@wordpress/block-editor';

import { useMemo } from '@wordpress/element';

const TemplatePreview = ({
	template,
	canScroll = false,
	isSelected = false,
	className = '',
	onClick
}) => {
	const parsedTemplate = useMemo( () => {
		return Array.isArray( template ) ? template : parse( template );
	}, [ template ]);

	return (
		<div
			className={ classNames(
				'block basis-full rounded-xl overflow-hidden max-h-80vh pointer-events-auto cursor-pointer',
				{
					'overflow-y-auto': canScroll,
					'outline outline-4 outline-active': isSelected,
					[ className ]: className
				}
			) }
			onClick={ onClick }
		>
			<BlockPreview
				blocks={ parsedTemplate }
				viewportWidth={ 1400 }
				additionalStyles={ [
					{ css: ':root { --parent-vh: 850px; }' }
				] }
			/>
		</div>
	);
};

export default TemplatePreview;
