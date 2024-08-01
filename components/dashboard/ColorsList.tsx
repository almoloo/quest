import { AchievementTemplateColor } from '@/config/definitions';
import { CheckCircleFilled } from '@ant-design/icons';
import React from 'react';

interface TemplateColorsProps {
	colors: AchievementTemplateColor[];
	currentDesignColor: AchievementTemplateColor | null;
	handleChange: (color: AchievementTemplateColor) => void;
}

const ColorsList = ({
	colors,
	currentDesignColor,
	handleChange,
}: TemplateColorsProps) => {
	return (
		<div className="grid grid-cols-3 gap-2 mb-5">
			{colors.map((color) => {
				return (
					<button
						key={color.id}
						className={`relative grid grid-cols-2 rounded-lg border hover:border-sky-500 transition-colors overflow-hidden ${
							currentDesignColor?.id === color.id
								? 'border-sky-600'
								: 'border-gray-300'
						}`}
						onClick={() => handleChange(color)}
					>
						<div className={`h-10 ${color.main}`}></div>
						<div className={`h-10 ${color.accent}`}></div>
						{currentDesignColor?.id === color.id && (
							<div className="absolute flex items-center justify-center top-0 right-0 bottom-0 left-0 bg-neutral-500/50 text-white rounded-lg">
								<CheckCircleFilled
									style={{ fontSize: '24px' }}
								/>
							</div>
						)}
					</button>
				);
			})}
		</div>
	);
};

export default ColorsList;
