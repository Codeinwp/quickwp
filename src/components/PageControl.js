/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import { Button } from '@wordpress/components';

import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import { PageControlIcon } from '../utils';
import STEPS from '../steps';

const numberOfPages = STEPS.length;

const PageControl = () => {
	const currentStep = useSelect( ( select ) =>
		select( 'quickwp/data' ).getStep()
	);
	const { setStep } = useDispatch( 'quickwp/data' );

	const currentPage = STEPS.findIndex(
		( step ) => step.value === currentStep.value
	);

	return (
		<ul className="m-0" aria-label={ __( 'Pagination', 'quickwp' ) }>
			{ Array.from({ length: numberOfPages }).map( ( _, page ) => (
				<li
					key={ page }
					aria-current={ page === currentPage ? 'step' : undefined }
					className="inline-block m-0"
				>
					<Button
						key={ page }
						disabled={ page > currentPage }
						icon={
							<PageControlIcon
								isFilled={ page === currentPage }
							/>
						}
						aria-label={ STEPS[ page ]?.label }
						className="text-fg h-6 w-6 !min-w-0 !min-h-0"
						onClick={ () => setStep( STEPS[ page ]?.value ) }
					/>
				</li>
			) ) }
		</ul>
	);
};

export default PageControl;
