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
import {
	generateColorPalette,
	generateImages,
	generateHomepage,
	saveChanges
} from './utils';

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
		},
		'homepage': {
			'thread_id': null,
			'run_id': null,
			hasLoaded: false
		}
	},
	colorPalette: [],
	images: {},
	imageKeywords: [],
	activeImageKeyword: null,
	selectedImages: [],
	homepage: null,
	siteTopic: '',
	siteDescription: '',
	isSavimg: false,
	hasError: false
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
			case 'site_description':
				generateImages();
				break;
			case 'color_palette':
				break;
			case 'image_suggestions':
				generateHomepage();
				break;
			case 'frontpage_template':
				saveChanges();
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
	setImages( key, images ) {
		return {
			type: 'SET_IMAGES',
			key,
			images
		};
	},
	setImageKeywords( imageKeywords ) {
		return {
			type: 'SET_IMAGE_KEYWORDS',
			imageKeywords
		};
	},
	setActiveImageKeyword( activeImageKeyword ) {
		return {
			type: 'SET_ACTIVE_IMAGE_KEYWORD',
			activeImageKeyword
		};
	},
	toggleSelectedImage( image ) {
		return ({ dispatch, select }) => {
			const selectedImages = select.getSelectedImages();

			if ( selectedImages.includes( image ) ) {
				dispatch( actions.removeSelectedImage( image ) );
			} else {
				dispatch( actions.addSelectedImage( image ) );
			}
		};
	},
	addSelectedImage( image ) {
		return {
			type: 'ADD_SELECTED_IMAGE',
			image
		};
	},
	removeSelectedImage( image ) {
		return {
			type: 'REMOVE_SELECTED_IMAGE',
			image
		};
	},
	setHomepage( homepage ) {
		return {
			type: 'SET_HOMEPAGE',
			homepage
		};
	},
	setError( hasError ) {
		return {
			type: 'SET_ERROR',
			hasError
		};
	},
	setSaving( isSaving ) {
		return {
			type: 'SET_SAVING',
			isSaving
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
		case 'SET_SAVING':
			return {
				...state,
				isSaving: action.isSaving
			};
		case 'SET_IMAGES':
			return {
				...state,
				images: {
					...state.images,
					[ action.key ]: action.images
				}
			};
		case 'SET_IMAGE_KEYWORDS':
			return {
				...state,
				imageKeywords: action.imageKeywords
			};
		case 'SET_ACTIVE_IMAGE_KEYWORD':
			return {
				...state,
				activeImageKeyword: action.activeImageKeyword
			};
		case 'ADD_SELECTED_IMAGE':
			return {
				...state,
				selectedImages: [
					...state.selectedImages,
					action.image
				]
			};
		case 'REMOVE_SELECTED_IMAGE':
			return {
				...state,
				selectedImages: state.selectedImages.filter(
					( image ) => image !== action.image
				)
			};
		case 'SET_HOMEPAGE':
			return {
				...state,
				homepage: action.homepage
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
		getImages( state, key ) {
			return state.images[ key ];
		},
		getImageKeywords( state ) {
			return state.imageKeywords;
		},
		getActiveImageKeyword( state ) {
			return state.activeImageKeyword;
		},
		getSelectedImages( state ) {
			return state.selectedImages;
		},
		getHomepage( state ) {
			return state.homepage;
		},
		hasError( state ) {
			return state.hasError;
		},
		isSaving( state ) {
			return state.isSaving;
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
