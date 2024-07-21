import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
	return (
		<header className="padding flex justify-between items-center border-b">
			<Link href="/">
				<Image
					src="/logo.svg"
					alt="logo"
					width={100}
					height={100}
					className="h-12"
				/>
			</Link>
			<nav>
				<w3m-button />
			</nav>
		</header>
	);
};

export default Header;
