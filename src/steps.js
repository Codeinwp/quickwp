/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import SiteTopic from './parts/SiteTopic';
import SiteDescription from './parts/SiteDescription';
import ColorPalette from './parts/ColorPalette';
import ImageSuggestions from './parts/ImageSuggestions';
import Template from './parts/Template';
import ViewSite from './parts/ViewSite';

const STEPS = [
	{
		value: 'site_topic',
		label: __( 'Site Topic', 'quickwp' ),
		view: SiteTopic
	},
	{
		value: 'site_description',
		label: __( 'Site Description', 'quickwp' ),
		view: SiteDescription
	},
	{
		value: 'image_suggestions',
		label: __( 'Image Suggestions', 'quickwp' ),
		view: ImageSuggestions
	},
	{
		value: 'frontpage_template',
		label: __( 'Front Page Template', 'quickwp' ),
		view: Template
	},
	{
		value: 'color_palette',
		label: __( 'Color Palette', 'quickwp' ),
		view: ColorPalette
	},
	{
		value: 'view_site',
		label: __( 'View Site', 'quickwp' ),
		view: ViewSite
	}
];

export default STEPS;
