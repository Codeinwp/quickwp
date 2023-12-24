/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import { useIsSiteEditorLoading } from './hooks';
import Loader from './components/Loader';
import Header from './parts/Header';

const App = () => {
	const isEditorLoading = useIsSiteEditorLoading();

	const currentStep = useSelect( ( select ) =>
		select( 'quickwp/data' ).getStep()
	);
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
