/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

import {
	dispatch,
	select
} from '@wordpress/data';

import {
	Circle,
	Path,
	Rect,
	SVG
} from '@wordpress/primitives';

import { addQueryArgs } from '@wordpress/url';

export const PageControlIcon = ({ isFilled = false }) => {
	return (
		<SVG
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{ isFilled ? (
				<Circle cx="6" cy="6" r="6" fill="white" />
			) : (
				<Circle
					cx="6"
					cy="6"
					r="5"
					fill="none"
					className="hover:fill-white"
					stroke="white"
					strokeWidth="2"
				/>
			) }
		</SVG>
	);
};

export const Logo = () => {
	return (
		<SVG
			width="64"
			height="64"
			viewBox="0 0 115 115"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M57.5 93C77.6584 93 94 76.6584 94 56.5C94 36.3416 77.6584 20 57.5 20C37.3416 20 21 36.3416 21 56.5C21 76.6584 37.3416 93 57.5 93ZM57.5 73.9565C67.141 73.9565 74.9565 66.141 74.9565 56.5C74.9565 46.859 67.141 39.0435 57.5 39.0435C47.859 39.0435 40.0435 46.859 40.0435 56.5C40.0435 66.141 47.859 73.9565 57.5 73.9565Z"
				fill="white"
			/>
			<Rect
				x="63.9414"
				y="86.8833"
				width="20.0392"
				height="14.5311"
				transform="rotate(-30 63.9414 86.8833)"
				fill="white"
			/>
		</SVG>
	);
};

/**
 * Sometimes OpenAI requests fail, so we try to redo them if that happens.
 */
const retryApiFetch = async( params = [], maxAttempts = 3, delay = 500 ) => {
	const { setError } = dispatch( 'quickwp/data' );

	let attempts = 0;

	const makeRequest = async() => {
		try {

			const response = await apiFetch({
				...params
			});

			return response;
		} catch ( error ) {

			attempts++;

			if ( attempts < maxAttempts ) {
				await new Promise( resolve => setTimeout( resolve, delay ) );
				return makeRequest();
			} else {
				setError( true );
				throw error;
			}
		}
	};

	return makeRequest();
};

const sendEvent = async( data ) => {
	const {
		setRunID,
		setThreadID
	} = dispatch( 'quickwp/data' );

	const response = await retryApiFetch({
		path: `${ window.quickwp.api }/send`,
		method: 'POST',
		data: { ...data }
	});

	setThreadID( data.step, response.thread_id );
	setRunID( data.step, response.id );
};

const getEvent = async( type, params = {}) => {
	const threadID = select( 'quickwp/data' ).getThreadID( type );

	let route = '';

	switch ( type ) {
	case 'homepage':
		route = 'homepage';
		break;
	case 'templates':
		route = 'templates';
		break;
	default:
		route = 'get';
		break;
	}

	const response = await retryApiFetch({
		path: addQueryArgs( `${ window.quickwp.api }/${ route }`, {
			'thread_id': threadID,
			...params
		})
	});

	return response;
};

const getEventStatus = async( type ) => {
	const threadID = select( 'quickwp/data' ).getThreadID( type );
	const runID = select( 'quickwp/data' ).getRunID( type );
	const { setProcessStatus } = dispatch( 'quickwp/data' );

	const response = await retryApiFetch({
		path: addQueryArgs( `${ window.quickwp.api }/status`, {
			'thread_id': threadID,
			'run_id': runID
		})
	});

	if ( 'completed' !== response.status ) {
		return false;
	}

	setProcessStatus( type, true );

	return true;
};

const extractPalette = response => {
	const runID = select( 'quickwp/data' ).getRunID( 'color_palette' );
	const { setError } = dispatch( 'quickwp/data' );

	const { data } = response;

	const target = data.find( item => item.run_id === runID );

	const jsonString = target.content[0].text.value;

	let matches = jsonString.match( /\[(.|\n)*?\]/ );

	if ( matches && matches[0]) {
		let jsonArrayString = matches[0];

		let jsonObject;
		try {
			jsonObject = JSON.parse( jsonArrayString );
		} catch ( error ) {
			setError( true );
			return false;
		}

		return jsonObject;
	} else {
		setError( true );
		return false;
	}
};

const fetchImages = async( request ) => {
	const runID = select( 'quickwp/data' ).getRunID( 'images' );
	const {
		setActiveImageKeyword,
		setImageKeywords
	} = dispatch( 'quickwp/data' );

	const { data } = request;

	const target = data.find( item => item.run_id === runID );

	let queries = target.content[0].text.value;

	queries = queries.split( ',' );

	queries = queries.map( query => query.trim() );

	const query = queries[0];

	setImageKeywords( queries );
	setActiveImageKeyword( query );

	await requestImages( query );
};

const awaitEvent = async( type, interval = 5000 ) => {
	const hasResolved = await getEventStatus( type );

	if ( ! hasResolved ) {
		await new Promise( resolve => setTimeout( resolve, interval ) );
		await awaitEvent( type, interval );
		return;
	}
};

export const requestImages = async( query ) => {
	const { setImages } = dispatch( 'quickwp/data' );

	const response = await retryApiFetch({
		path: addQueryArgs( `${ window.quickwp.api }/images`, {
			query
		})
	});

	setImages( query, response?.photos );
};

export const generateColorPalette = async() => {
	const siteTopic = select( 'quickwp/data' ).getSiteTopic();

	const {
		setColorPalette,
		setProcessStatus
	} = dispatch( 'quickwp/data' );

	await sendEvent({
		step: 'color_palette',
		message: siteTopic
	});

	await awaitEvent( 'color_palette' );

	const response = await getEvent( 'color_palette' );

	const palette = extractPalette( response );

	setColorPalette( palette );
	setProcessStatus( 'color_palette', true );
};

export const generateImages = async() => {
	const siteDescription = select( 'quickwp/data' ).getSiteDescription();

	const { setProcessStatus } = dispatch( 'quickwp/data' );

	await sendEvent({
		step: 'images',
		message: siteDescription
	});

	await awaitEvent( 'images', 10000 );

	const response = await getEvent( 'images' );

	await fetchImages( response );

	setProcessStatus( 'images', true );
};

export const generateTemplates = async( type ) => {
	const siteTopic = select( 'quickwp/data' ).getSiteTopic();
	const siteDescription = select( 'quickwp/data' ).getSiteDescription();

	const images = select( 'quickwp/data' ).getSelectedImages();
	const activeImageKeyword = select( 'quickwp/data' ).getActiveImageKeyword();
	const defaultImages = select( 'quickwp/data' ).getImages( activeImageKeyword );
	const homepage = select( 'quickwp/data' ).getSelectedTemplate();

	const selectedImages = ( ! images.length && defaultImages.length ) ? defaultImages.slice( 0, 10 ) : images;

	let imagesAr = selectedImages.map( image => ({
		src: image.src.original,
		alt: image.alt
	}) );

	const {
		setError,
		setProcessStatus,
		setHomepage,
		setTemplate
	} = dispatch( 'quickwp/data' );

	let response;

	if ( 'homepage' === type ) {
		await sendEvent({
			step: 'homepage',
			message: `Website topic: ${ siteTopic } | Website description: ${ siteDescription } | Images: ${ JSON.stringify( imagesAr ) }`,
			template: homepage
		});

		await awaitEvent( 'homepage', 10000 );

		response = await getEvent( 'homepage', {
			template: homepage
		});
	} else {
		await sendEvent({
			step: 'templates',
			message: `Website topic: ${ siteTopic } | Website description: ${ siteDescription }`
		});

		await awaitEvent( 'templates', 10000 );

		response = await getEvent( 'templates', {
			images: imagesAr
		});
	}

	if ( 'success' !== response?.status ) {
		setError( true );
		return;
	}

	if ( 'homepage' === type ) {
		const homepageTemplate = formatHomepage( response.data );

		setHomepage( homepageTemplate );
		setProcessStatus( 'homepage', true );
	} else {
		let homepageTemplates = [];

		response.data.forEach( item => {
			let homepageTemplate = formatHomepage( item.patterns );

			const template = {
				slug: item.slug,
				content: homepageTemplate
			};

			homepageTemplates.push( template );
		});

		setTemplate( homepageTemplates );
		setProcessStatus( 'templates', true );
	}
};

const importTemplate = async() => {
	const currentTemplate = select( 'core/edit-site' ).getEditedPostId();

	const { getHomepage } = select( 'quickwp/data' );

	const { editEntityRecord } = dispatch( 'core' );

	const homepage = getHomepage();

	await editEntityRecord( 'postType', 'wp_template', currentTemplate, {
		'content': homepage
	});
};

export const saveChanges = async() => {
	const { __experimentalGetDirtyEntityRecords } = select( 'core' );

	const { saveEditedEntityRecord } = dispatch( 'core' );

	const { setSaving } = dispatch( 'quickwp/data' );

	setSaving( true );

	importTemplate();

	const edits = __experimentalGetDirtyEntityRecords();

	await Promise.all( edits.map( async edit => {
		await saveEditedEntityRecord( edit.kind, edit.name, edit?.key );
	}) );

	setSaving( false );
};

const formatHomepage = template => {
	const slug = window.quickwp.themeSlug;
	let homepageTemplate = '';
	homepageTemplate += '<!-- wp:template-part {"slug":"header","theme":"' + slug + '","tagName":"header","area":"header"} /-->';
	homepageTemplate += template;
	homepageTemplate += '<!-- wp:template-part {"slug":"footer","theme":"' + slug + '","tagName":"footer","area":"footer"} /-->';

	return homepageTemplate;
};

export const recordEvent = async( data = {}) => {
	if ( ! Boolean( window.quickwp.isGuidedMode ) ) {
		return;
	}

	const { setSessionID } = dispatch( 'quickwp/data' );
	const { getSessionID } = select( 'quickwp/data' );

	const trackingId = getSessionID();

	try {
		const response = await fetch(
			'https://api.themeisle.com/tracking/onboarding',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					_id: trackingId,
					data: {
						slug: 'quickwp',
						// eslint-disable-next-line camelcase
						license_id: 'free',
						site: '',
						...data
					}
				})
			}
		);

		if ( ! response.ok ) {
			console.error( `HTTP error! Status: ${ response.status }` );
			return false;
		}

		const jsonResponse = await response.json();

		const validCodes = [ 'success', 'invalid' ]; // Add valid codes to this array

		if ( ! validCodes.includes( jsonResponse.code ) ) {
			return false;
		}

		if ( 'invalid' === jsonResponse.code ) {
			console.error( jsonResponse.message );
			return false;
		}
		const responseData = jsonResponse.data;

		if ( responseData?.id && '' === trackingId ) {
			setSessionID( responseData.id );
		}

		return responseData.id || false;
	} catch ( error ) {
		console.error( error );
		return false;
	}
};
