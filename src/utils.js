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
	G,
	Path,
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
			width="51"
			height="51"
			viewBox="0 0 51 51"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<G id="logo">
				<Path
					id="QuickWP"
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M25.5 51C39.5833 51 51 39.5833 51 25.5C51 11.4167 39.5833 0 25.5 0C11.4167 0 0 11.4167 0 25.5C0 39.5833 11.4167 51 25.5 51ZM25.5 37.6957C32.2355 37.6957 37.6957 32.2355 37.6957 25.5C37.6957 18.7645 32.2355 13.3043 25.5 13.3043C18.7645 13.3043 13.3043 18.7645 13.3043 25.5C13.3043 32.2355 18.7645 37.6957 25.5 37.6957Z"
					fill="white"
				/>
			</G>
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

	const response = await apiFetch({
		path: addQueryArgs( `${ window.quickwp.api }/get`, {
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
	const { setImages } = dispatch( 'quickwp/data' );

	const { data } = request;

	const target = data.find( item => item.run_id === runID );

	const query = target.content[0].text.value;

	const response = await apiFetch({
		path: addQueryArgs( `${ window.quickwp.api }/images`, {
			query
		})
	});


	setImages( response?.photos );
};

const awaitEvent = async( type ) => {
	const hasResolved = await getEventStatus( type );

	if ( ! hasResolved ) {
		await new Promise( resolve => setTimeout( resolve, 3000 ) );
		await awaitEvent( type );
		return;
	}
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

	await awaitEvent( 'images' );

	const response = await getEvent( 'images' );

	await fetchImages( response );

	setProcessStatus( 'images', true );
};
