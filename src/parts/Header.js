/**
 * Internal dependencies.
 */
import { Logo } from '../utils';
import PageControl from '../components/PageControl';

const Header = () => {
	return (
		<div className="flex items-center gap-16 justify-between sm:justify-start">
			<Logo />
			<PageControl />
		</div>
	);
};

export default Header;
