/**
 * WordPress dependencies.
 */
import { createReduxStore, dispatch, register, select } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import STEPS from './steps';

const DEFAULT_STATE = {
	step: 2
};

const actions = {
	setStep( step ) {
		return {
			type: 'SET_STEP',
			step
		};
	},
	nextStep() {
		return ({ dispatch, select }) => {
			const current = select.getStep();
			const stepIndex = STEPS.findIndex(
				( step ) => current.value === step.value
			);
			const isLast = STEPS.length === stepIndex + 1;
			const newStep =
				STEPS[ isLast ? STEPS.length : stepIndex + 1 ]?.value;

			if ( isLast ) {
				return;
			}

			dispatch( actions.setStep( newStep ) );
		};
	},
	previousStep() {
		return ({ dispatch, select }) => {
			const current = select.getStep();
			const stepIndex = STEPS.findIndex(
				( step ) => current.value === step.value
			);
			const isFirst = 0 === stepIndex;
			const newStep = STEPS[ isFirst ? 0 : stepIndex - 1 ]?.value;

			dispatch( actions.setStep( newStep ) );
		};
	},
	onContinue() {
		return ({ dispatch }) => {
			dispatch( actions.nextStep() );
		};
	}
};

const store = createReduxStore( 'quickwp/data', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
		case 'SET_STEP':
			const step = STEPS.findIndex(
				( step ) => step.value === action.step
			);

			return {
				...state,
				step
			};
		}

		return state;
	},

	actions,

	selectors: {
		getStep( state ) {
			return STEPS[ state.step ];
		}
	}
});

register( store );
