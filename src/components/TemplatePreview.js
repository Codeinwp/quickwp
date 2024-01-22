/**
 * External dependencies.
 */
import classNames from 'classnames';

/**
 * WordPress dependencies.
 */
import { BlockPreview } from '@wordpress/block-editor';

const TemplatePreview = ({
	template,
	canScroll = false
}) => {
	return (
		<div className={ classNames(
			'block basis-full rounded-xl overflow-hidden max-h-80vh',
			{
				'overflow-y-auto': canScroll
			}
		) }>
			<BlockPreview
				blocks={ template }
				viewportWidth={ 1400 }
			/>
		</div>
	);
};

export default TemplatePreview;
