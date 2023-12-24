/**
 * WordPress dependencies
 */
import { SVG, Circle, G, Path } from '@wordpress/primitives';

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
