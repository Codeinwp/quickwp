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
		setSelectedHomepage
	} = useDispatch( 'quickwp/data' );

	const {
		templates,
		selectedHomepage,
		isSaving,
		hasLoaded
	} = useSelect( ( select ) => {
		const {
			getHomepage,
			isSaving,
			getProcessStatus,
			getSelectedHomepage
		} = select( 'quickwp/data' );

		const templates = getHomepage();

		return {
			templates,
			selectedHomepage: getSelectedHomepage(),
			isSaving: isSaving(),
			hasLoaded: true === getProcessStatus( 'homepage' )
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

				<div className="flex flex-row gap-4">
					<Button
						variant="primary"
						disabled={ isSaving || ! selectedHomepage }
						onClick={ onContinue }
					>
						{ __( 'Continue', 'quickwp' ) }
					</Button>

					{ selectedHomepage && (
						<Button
							variant="primary"
							onClick={ () => setSelectedHomepage( null ) }
						>
							{ __( 'Go Back', 'quickwp' ) }
						</Button>
					) }
				</div>
			</div>

			{ selectedHomepage ? (
				<div className="grid grid-cols-1 p-1 basis-2/3 max-h-80vh">
					<TemplatePreview
						template={ templates.find( template => template.slug === selectedHomepage ).content }
						canScroll={ true }
					/>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4 p-1 basis-2/3 overflow-scroll max-h-80vh">
					{ templates.map( template => {
						return (
							<TemplatePreview
								key={ template.slug }
								template={ template.content }
								onClick={ () => setSelectedHomepage( template.slug )}
								className="aspect-vert"
							/>
						);
					}) }
				</div>
			) }
		</div>
	);
};

export default Template;
