/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

import {
	dispatch,
	select
} from '@wordpress/data';
import { home } from '@wordpress/icons';

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
					stroke-width="2"
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
				fill-rule="evenodd"
				clip-rule="evenodd"
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

const sendEvent = async( data ) => {
	const {
		setRunID,
		setThreadID
	} = dispatch( 'quickwp/data' );

	const response = await apiFetch({
		path: `${ window.quickwp.api }/send`,
		method: 'POST',
		data: { ...data }
	});

	setThreadID( data.step, response.thread_id );

	setRunID( data.step, response.id );
};

const getEvent = async( type ) => {
	const threadID = select( 'quickwp/data' ).getThreadID( type );
	const route = 'homepage' !== type ? 'get' : 'templates';

	const response = await apiFetch({
		path: addQueryArgs( `${ window.quickwp.api }/${ route }`, {
			'thread_id': threadID
		})
	});

	return response;
};

const getEventStatus = async( type ) => {
	const threadID = select( 'quickwp/data' ).getThreadID( type );
	const runID = select( 'quickwp/data' ).getRunID( type );
	const { setProcessStatus } = dispatch( 'quickwp/data' );

	const response = await apiFetch({
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

	const response = await apiFetch({
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

export const generateHomepage = async() => {
	const siteTopic = select( 'quickwp/data' ).getSiteTopic();
	const siteDescription = select( 'quickwp/data' ).getSiteDescription();
	const images = select( 'quickwp/data' ).getSelectedImages();
	const currentTemplate = select( 'core/edit-site' ).getEditedPostId();

	const { editEntityRecord } = dispatch( 'core' );

	const imagesAr = images.map( image => ({
		src: image.src.original,
		alt: image.alt
	}) );

	const {
		setError,
		setProcessStatus,
		setHomepage
	} = dispatch( 'quickwp/data' );

	await sendEvent({
		step: 'homepage',
		message: `Website topic: ${ siteTopic } | Website description: ${ siteDescription } | Images: ${ JSON.stringify( imagesAr ) }`
	});

	await awaitEvent( 'homepage', 10000 );

	const response = await getEvent( 'homepage' );

	if ( 'success' !== response?.status ) {
		setError( true );
		return;
	}

	let homepageTemplate = '';
	homepageTemplate += '<!-- wp:template-part {"slug":"header","theme":"quickwp-theme","tagName":"header","area":"header"} /-->';
	homepageTemplate += response.data;
	homepageTemplate += '<!-- wp:template-part {"slug":"footer","theme":"quickwp-theme","tagName":"footer","area":"footer"} /-->';

	editEntityRecord( 'postType', 'wp_template', currentTemplate, {
		'content': homepageTemplate
	});

	setHomepage( homepageTemplate );
	setProcessStatus( 'homepage', true );
};

export const saveChanges = async() => {
	const { __experimentalGetDirtyEntityRecords } = select( 'core' );

	const { saveEditedEntityRecord } = dispatch( 'core' );

	const { setSaving } = dispatch( 'quickwp/data' );

	const edits = __experimentalGetDirtyEntityRecords();

	setSaving( true );

	await Promise.all( edits.map( async edit => {
		await saveEditedEntityRecord( edit.kind, edit.name, edit?.key );
	}) );

	setSaving( false );
};
