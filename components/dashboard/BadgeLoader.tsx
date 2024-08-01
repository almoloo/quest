import { Skeleton, Spin } from 'antd';
import React from 'react';

const BadgeLoader = () => {
	return (
		<div className="flex justify-center items-center py-20">
			<Spin spinning />
		</div>
	);
};

export default BadgeLoader;
