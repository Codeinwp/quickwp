/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import {
	useDispatch,
	useSelect
} from '@wordpress/data';

import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { useIsSiteEditorLoading } from './hooks';
import Loader from './components/Loader';
import Header from './parts/Header';
import { recordEvent } from './utils';

const App = () => {
	const isEditorLoading = useIsSiteEditorLoading();

	const { toggle } = useDispatch( 'core/preferences' );

	const {
		currentStep,
		hasError,
		hasWelcome
	} = useSelect( select => {
		const {
			getStep,
			hasError
		} = select( 'quickwp/data' );

		const { get } = select( 'core/preferences' );

		return {
			currentStep: getStep(),
			hasError: hasError(),
			hasWelcome: get( 'core/edit-site', 'welcomeGuide' )
		};
	});

	useEffect( () => {
		if ( hasWelcome ) {
			toggle( 'core/edit-site', 'welcomeGuide' );
		}

		recordEvent();
	}, [ hasWelcome ]);

	const StepControls = currentStep?.view || null;

	if ( isEditorLoading ) {
		return (
			<div
				id="quickwp"
				className="flex flex-col items-center justify-center fixed py-12 px-14 z-50 bg-bg overflow-auto inset-0"
			>
				<Loader />
			</div>
		);
	}

	if ( hasError ) {
		return (
			<div
				id="quickwp"
				className="flex flex-col items-center justify-center fixed py-12 px-14 z-50 bg-bg overflow-auto inset-0"
			>
				<h2 className="text-fg text-xl not-italic font-medium leading-10">
					{ __(
						'There has been an error. Please refresh the page and try again.',
						'quickwp'
					) }
				</h2>
			</div>
		);
	}

	return (
		<div
			id="quickwp"
			className="flex flex-col fixed py-12 px-14 z-50 bg-bg overflow-auto inset-0"
		>
			<Header />
			<StepControls />
		</div>
	);
};

export default App;
