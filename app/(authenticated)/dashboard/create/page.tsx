'use client';

import BadgeCreator from '@/components/dashboard/BadgeCreator';
import PageTitle from '@/components/layout/PageTitle';

import { TrophyTwoTone } from '@ant-design/icons';

const page = () => {
	return (
		<>
			<PageTitle
				title="Create Achievement"
				description="Create a new achievement for distribution."
				icon={<TrophyTwoTone />}
			/>
			{/* ----- ACHIEVEMENT DESIGNER ----- */}
			<BadgeCreator />
		</>
	);
};

export default page;
