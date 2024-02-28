/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import {
	Button,
	Spinner
} from '@wordpress/components';

import {
	useDispatch,
	useSelect
} from '@wordpress/data';

/**
 * Internal dependencies.
 */
import TemplatePreview from '../components/TemplatePreview';

const Template = () => {
	const {
		onContinue,
		setSelectedTemplate
	} = useDispatch( 'quickwp/data' );

	const {
		templates,
		selectedTemplate,
		hasLoaded
	} = useSelect( ( select ) => {
		const {
			getTemplate,
			isSaving,
			getProcessStatus,
			getSelectedTemplate
		} = select( 'quickwp/data' );

		const templates = getTemplate();

		return {
			templates,
			selectedTemplate: getSelectedTemplate(),
			hasLoaded: true === getProcessStatus( 'templates' )
		};
	}, []);

	if ( ! hasLoaded ) {
		return (
			<div className="flex flex-1 flex-row items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-row gap-12 items-center">
			<div className="flex flex-col basis-1/3 gap-8 justify-center">
				<h2 className="text-fg text-4xl not-italic font-medium leading-10 max-w-5xl">
					{ __(
						'Pick a layout for your homepage.',
						'quickwp'
					) }
				</h2>

				<Button
					variant="primary"
					disabled={ ! selectedTemplate }
					onClick={ onContinue }
				>
					{ __( 'Continue', 'quickwp' ) }
				</Button>
			</div>

			<div className="grid grid-cols-2 gap-4 p-1 basis-2/3 overflow-scroll max-h-80vh">
				{ templates.map( template => {
					return (
						<TemplatePreview
							key={ template.slug }
							template={ template.content }
							onClick={ () => setSelectedTemplate( template.slug )}
							isSelected={ template.slug === selectedTemplate }
							className="aspect-vert"
						/>
					);
				}) }
			</div>
		</div>
	);
};

export default Template;
