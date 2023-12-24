/**
 * External dependencies.
 */
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import { memo, useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { PageControlIcon } from '../utils';

import STEPS from '../steps';

const Loader = () => {
	const [ currentPage, setCurrentPage ] = useState( 0 );
	const numberOfPages = useMemo( () => STEPS.length, []);

	useEffect( () => {
		const interval = setInterval( () => {
			setCurrentPage( ( prevPage ) =>
				prevPage === numberOfPages - 1 ? 0 : prevPage + 1
			);
		}, 500 );

		return () => clearInterval( interval );
	}, [ numberOfPages ]);

	return (
		<ul className="m-0" aria-label={ __( 'Loading', 'quickwp' ) }>
			{ Array.from({ length: numberOfPages }).map( ( _, page ) => (
				<li
					key={ page }
					className={ classnames(
						'inline-flex m-0 justify-center items-center text-fg h-6 w-6 !min-w-0 !min-h-0 transition-all',
						{
							'opacity-30': page !== currentPage
						}
					) }
				>
					<PageControlIcon isFilled={ page === currentPage } />
				</li>
			) ) }
		</ul>
	);
};

export default memo( Loader );
