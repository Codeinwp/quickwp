/**
 * External dependencies.
 */
import classNames from 'classnames';

/**
 * WordPress dependencies.
 */
import { parse } from '@wordpress/blocks';

import { BlockPreview } from '@wordpress/block-editor';

import {
	useMemo,
	useRef
} from '@wordpress/element';

const TemplatePreview = ({
	template,
	canScroll = false,
	isSelected = false,
	className = '',
	onClick
}) => {
	const previewRef = useRef( null );

	const parsedTemplate = useMemo( () => {
		return Array.isArray( template ) ? template : parse( template );
	}, [ template ]);

	const scrollToBottom = () => {
		const contentDocument = previewRef.current;

		if ( ! canScroll && contentDocument ) {
			contentDocument.scrollTo({
				top: contentDocument.scrollHeight,
				behavior: 'smooth'
			});
		}
	};

	const scrollToTop = () => {
		const contentDocument = previewRef.current;

		if ( ! canScroll && contentDocument ) {
			contentDocument.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}
	};

	return (
		<div
			ref={ previewRef }
			onMouseEnter={ scrollToBottom }
			onMouseLeave={ scrollToTop }
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
