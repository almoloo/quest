import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

interface PageTitleProps {
	title: string;
	description: string;
	icon: React.ReactNode;
}

const PageTitle = (props: PageTitleProps) => {
	return (
		<div className="mb-5">
			<Title level={3}>
				{props.icon}
				<span className="ml-4">{props.title}</span>
			</Title>
			<Text>{props.description}</Text>
		</div>
	);
};

export default PageTitle;
