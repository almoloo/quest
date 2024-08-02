import React from 'react';
import { Black_Han_Sans, Poppins } from 'next/font/google';

interface Badge2Props {
	emoji: string;
	primaryText: string;
	secondaryText: string;
	color: {
		classNames: {
			gradient1: string;
			gradient2: string;
			gradient3: string;
			outline1: string;
			outline2: string;
			primary: string;
			accent: string;
		};
	};
}

const blackHanSans = Black_Han_Sans({
	weight: '400',
	subsets: ['latin'],
	style: 'normal',
});

const poppins = Poppins({
	weight: '400',
	subsets: ['latin'],
	style: 'normal',
});

const Badge2 = (props: Badge2Props) => {
	return (
		<div
			className={`text-white border-white border-8 flex flex-col rounded-t-xl rounded-b-[300px] min-w-[350px] p-5 gap-5 shadow-xl bg-gradient-to-br ${props.color.classNames.gradient1}`}
		>
			<div className="flex flex-col items-center gap-2">
				<span
					className={`${blackHanSans.className} drop-shadow-lg font-black text-3xl uppercase line-clamp-1`}
				>
					{props.primaryText}
				</span>
				<span
					className={`${poppins.className} text-base uppercase line-clamp-1`}
				>
					{props.secondaryText}
				</span>
			</div>
			<div
				className={`relative overflow-hidden flex justify-center items-center aspect-square rounded-b-[300px] rounded-t-lg border border-white outline outline-4 bg-gradient-to-br ${props.color.classNames.gradient2} ${props.color.classNames.outline1}`}
			>
				<div
					className={`relative z-10 aspect-square p-10 outline outline-8 rounded-full shadow-inner bg-gradient-to-br ${props.color.classNames.gradient3} ${props.color.classNames.outline2}`}
				>
					<em-emoji
						id={props.emoji}
						size="16em"
						set="apple"
						skin={1}
					></em-emoji>
				</div>
				<div className="absolute z-0 top-1/2 -translate-y-1/2 left-0 w-full">
					<div
						className={`h-10 ${props.color.classNames.primary}`}
					></div>
					<div
						className={`h-10 ${props.color.classNames.accent}`}
					></div>
				</div>
				<div className="absolute w-full h-full top-0 left-0 z-20 bg-gradient-to-br from-white to-sky-950 opacity-25"></div>
			</div>
		</div>
	);
};

export default Badge2;
