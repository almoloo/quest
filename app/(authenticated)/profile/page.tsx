'use client';

import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { abi } from '@/config/abi';
import { useState } from 'react';

const Page = () => {
	const { address } = useAccount();
	const { data: hash, writeContract, isPending } = useWriteContract();
	const { data: profileData } = useReadContract({
		address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
		abi,
		functionName: 'getProfile',
		args: [address],
	});
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		bio: '',
		avatar: '',
		cover: '',
		links: '[]',
	});
	const [profile, setProfile] = useState('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		writeContract({
			address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
			abi,
			functionName: 'setProfile',
			args: [
				formData.name,
				formData.email,
				formData.bio,
				formData.avatar,
				formData.cover,
				formData.links,
			],
		});
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div>{address}</div>
				<div>
					<input
						type="text"
						placeholder="name"
						name="name"
						defaultValue={formData.name}
						onChange={(e) =>
							setFormData({ ...formData, name: e.target.value })
						}
					/>
				</div>
				<div>
					<input
						type="email"
						placeholder="email"
						name="email"
						defaultValue={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
					/>
				</div>
				<div>
					<textarea
						placeholder="bio"
						name="bio"
						defaultValue={formData.bio}
						onChange={(e) =>
							setFormData({ ...formData, bio: e.target.value })
						}
					></textarea>
				</div>
				<div>
					<input
						type="text"
						placeholder="avatar url"
						name="avatar"
						defaultValue={formData.avatar}
						onChange={(e) =>
							setFormData({ ...formData, avatar: e.target.value })
						}
					/>
				</div>
				<div>
					<input
						type="text"
						placeholder="cover url"
						name="cover"
						defaultValue={formData.cover}
						onChange={(e) =>
							setFormData({ ...formData, cover: e.target.value })
						}
					/>
				</div>
				<div>
					<input
						type="text"
						placeholder="links"
						name="links"
						defaultValue={formData.links}
						onChange={(e) =>
							setFormData({ ...formData, links: e.target.value })
						}
					/>
				</div>
				<button type="submit">submit</button>
			</form>
			{hash && <div>tx hash: {hash}</div>}
			<div className="border p-5">
				<h1>get profile</h1>
				<pre>{JSON.stringify(profileData)}</pre>
			</div>
		</>
	);
};

export default Page;
