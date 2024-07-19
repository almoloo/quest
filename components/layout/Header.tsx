import Link from 'next/link';

const Header = () => {
	return (
		<header className="padding flex justify-between border-b">
			<Link href="/">LOGO</Link>
			<nav>nav</nav>
		</header>
	);
};

export default Header;
