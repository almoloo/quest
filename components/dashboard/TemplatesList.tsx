import { AchievementTemplate } from '@/config/definitions';
import { CheckCircleFilled } from '@ant-design/icons';
import React from 'react';

interface TemplatesListProps {
	achievementDesigns: AchievementTemplate[];
	currentDesign: AchievementTemplate | null;
	handleChange: (id: number) => void;
	emoji: string;
	primaryText: string;
	secondaryText: string;
}

const TemplatesList = ({
	achievementDesigns,
	currentDesign,
	handleChange,
	emoji,
	primaryText,
	secondaryText,
}: TemplatesListProps) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-5">
			{achievementDesigns.map((design) => (
				<button
					key={design.id}
					className={`checkeredBg relative flex items-center justify-center text-left rounded-lg border hover:border-sky-500 transition-colors p-5 ${
						currentDesign?.id === design.id
							? 'border-sky-600'
							: 'border-gray-300'
					}`}
					onClick={() => handleChange(design.id)}
				>
					{design.element({
						emoji: emoji,
						primaryText: primaryText,
						secondaryText: secondaryText,
						color: design.colors[0],
					})}
					{currentDesign?.id === design.id && (
						<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-sky-500/50 text-white rounded-lg">
							<CheckCircleFilled style={{ fontSize: '24px' }} />
						</div>
					)}
				</button>
			))}
		</div>
	);
};

export default TemplatesList;
