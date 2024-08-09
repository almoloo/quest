import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
	return (
		<header className="padding flex justify-between items-center border-b">
			<Link href="/">
				<Image
					src="/logo.svg"
					alt="logo"
					className="h-12 w-auto"
					width={100}
					height={48}
					priority
				/>
			</Link>
			<nav>
				<w3m-button />
			</nav>
		</header>
	);
};

export default Header;
