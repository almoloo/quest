import React from 'react';

interface Badge1Props {
	emoji: string;
	word: string;
	color: {
		classNames: {
			outline: string;
			emojiBg: string;
		};
	};
}

const Badge1 = (props: Badge1Props) => {
	return (
		<>
			<div className="bg-white shadow rounded-xl p-5 flex items-start w-full max-w-max gap-5">
				<div
					className={`aspect-square flex items-center justify-center rounded-full outline outline-4 p-3 ${props.color.classNames.outline} ${props.color.classNames.emojiBg}`}
				>
					<span className="text-2xl leading-none">
						<em-emoji
							id={props.emoji}
							size="1.5em"
							set="native"
							skin={1}
						></em-emoji>
					</span>
				</div>
				<div>
					<h3 className="text-xl font-bold">{props.word}</h3>
					<p className="text-gray-600">
						You've unlocked a new achievement!
					</p>
				</div>
			</div>
		</>
	);
};

export default Badge1;
