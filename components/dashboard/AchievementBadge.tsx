import { achievementDesigns } from '@/config/achievementDesign';
import { ParsedAchievementMetadata } from '@/config/definitions';

interface AchievementBadgeProps {
	achievement: ParsedAchievementMetadata;
}

const AchievementBadge = ({ achievement }: AchievementBadgeProps) => {
	const currentDesign = achievementDesigns.find(
		(design) => design.id === achievement.badgeId
	);
	const currentColor = currentDesign?.colors.find(
		(color) => color.id === achievement.themeId
	);

	return currentDesign?.element({
		emoji: achievement.emojiId,
		primaryText: achievement.primaryText,
		secondaryText: achievement.secondaryText,
		color: currentColor!,
	});
};

export default AchievementBadge;
