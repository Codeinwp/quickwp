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
		value: 'color_palette',
		label: __( 'Color Palette', 'quickwp' ),
		view: ColorPalette
	},
	{
		value: 'image_suggestions',
		label: __( 'Image Suggestions', 'quickwp' )
	},
	{
		value: 'frontpage_template',
		label: __( 'Front Page Template', 'quickwp' )
	},
	{
		value: 'view_site',
		label: __( 'View Site', 'quickwp' )
	}
];

export default STEPS;
