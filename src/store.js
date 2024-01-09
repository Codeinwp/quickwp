/**
 * WordPress dependencies.
 */
import {
	createReduxStore,
	register
} from '@wordpress/data';

/**
 * Internal dependencies.
 */
import STEPS from './steps';
import { generateColorPalette, generateImages } from './utils';

const DEFAULT_STATE = {
	step: 0,
	processes: {
		'color_palette': {
			'thread_id': null,
			'run_id': null,
			hasLoaded: false
		},
		'images': {
			'thread_id': null,
			'run_id': null,
			hasLoaded: false
		}
	},
	images: [],
	siteTopic: null,
	siteDescription: null,
	hasError: false,
	colorPalette: []
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
		return ({ dispatch, select }) => {
			const current = select.getStep();

			switch ( current.value ) {
			case 'site_topic':
				generateColorPalette();
				break;
			case 'color_palette':
				generateImages();
				break;
			}

			dispatch( actions.nextStep() );
		};
	},
	setSiteTopic( siteTopic ) {
		return {
			type: 'SET_SITE_TOPIC',
			siteTopic
		};
	},
	setSiteDescription( siteDescription ) {
		return {
			type: 'SET_SITE_DESCRIPTION',
			siteDescription
		};
	},
	setColorPalette( colorPalette ) {
		return {
			type: 'SET_COLOR_PALETTE',
			colorPalette
		};
	},
	setError( hasError ) {
		return {
			type: 'SET_ERROR',
			hasError
		};
	},
	setImages( images ) {
		return {
			type: 'SET_IMAGES',
			images
		};
	},
	setThreadID( item, threadID ) {
		return {
			type: 'SET_THREAD_ID',
			item,
			threadID
		};
	},
	setRunID( item, runID ) {
		return {
			type: 'SET_RUN_ID',
			item,
			runID
		};
	},
	setProcessStatus( item, hasLoaded ) {
		return {
			type: 'SET_PROCESS_STATUS',
			item,
			hasLoaded
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
		case 'SET_SITE_TOPIC':
			return {
				...state,
				siteTopic: action.siteTopic
			};
		case 'SET_SITE_DESCRIPTION':
			return {
				...state,
				siteDescription: action.siteDescription
			};
		case 'SET_COLOR_PALETTE':
			return {
				...state,
				colorPalette: action.colorPalette
			};
		case 'SET_ERROR':
			return {
				...state,
				hasError: action.hasError
			};
		case 'SET_IMAGES':
			return {
				...state,
				images: action.images
			};
		case 'SET_THREAD_ID':
			return {
				...state,
				processes: {
					...state.processes,
					[ action.item ]: {
						...state.processes[ action.item ],
						'thread_id': action.threadID
					}
				}
			};
		case 'SET_RUN_ID':
			return {
				...state,
				processes: {
					...state.processes,
					[ action.item ]: {
						...state.processes[ action.item ],
						'run_id': action.runID
					}
				}
			};
		case 'SET_PROCESS_STATUS':
			return {
				...state,
				processes: {
					...state.processes,
					[ action.item ]: {
						...state.processes[ action.item ],
						hasLoaded: action.hasLoaded
					}
				}
			};
		}

		return state;
	},

	actions,

	selectors: {
		getStep( state ) {
			return STEPS[ state.step ];
		},
		getSiteTopic( state ) {
			return state.siteTopic;
		},
		getSiteDescription( state ) {
			return state.siteDescription;
		},
		getColorPalette( state ) {
			return state.colorPalette;
		},
		hasError( state ) {
			return state.hasError;
		},
		getImages( state ) {
			return state.images;
		},
		getThreadID( state, item ) {
			return state.processes[ item ]?.thread_id;
		},
		getRunID( state, item ) {
			return state.processes[ item ]?.run_id;
		},
		getProcessStatus( state, item ) {
			return state.processes[ item ]?.hasLoaded;
		}
	}
});

register( store );
