/**
 * WordPress dependencies.
 */
import { BlockPreview } from '@wordpress/block-editor';

const TemplatePreview = ({ template }) => {
	return (
		<div className="block basis-full rounded-xl overflow-hidden max-h-80vh">
			<BlockPreview
				blocks={ template }
				viewportWidth={ 1400 }
			/>
		</div>
	);
};

export default TemplatePreview;
