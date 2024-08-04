'use client';

import { ExperimentTwoTone, GithubOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';

const Footer = () => {
	return (
		<footer className="padding flex justify-between items-center bg-slate-100">
			<div>
				<ExperimentTwoTone />
				<small className="ml-2">
					Cooked up by{' '}
					<Link
						href="https://github.com/almoloo"
						target="_blank"
						passHref
						className="text-sky-500"
					>
						almoloo
					</Link>{' '}
					&{' '}
					<Link
						href="https://github.com/Hossein-79"
						target="_blank"
						passHref
						className="text-sky-500"
					>
						Hossein-79
					</Link>
				</small>
			</div>
			<Link
				href="https://github.com/almoloo/quest"
				passHref
			>
				<Button
					type="link"
					icon={<GithubOutlined />}
					size="large"
				/>
			</Link>
		</footer>
	);
};

export default Footer;
