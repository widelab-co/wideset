import {
  type RemixiconComponentType,
  RiBarChartLine,
  RiBikeLine,
  RiBodyScanLine,
  RiBoxingLine,
  RiBuilding2Line,
  RiCalendarCheckLine,
  RiFootballLine,
  RiGroupLine,
  RiHeartPulseLine,
  RiListUnordered,
  RiLungsLine,
  RiMedalLine,
  RiOpenArmLine,
  RiPhoneLine,
  RiPictureInPictureLine,
  RiRestaurantLine,
  RiRoadMapLine,
  RiRunLine,
  RiStarLine,
  RiStore2Line,
  RiSurveyLine,
  RiTimer2Line,
  RiUserLine,
  RiUserVoiceLine,
  RiVideoLine,
  RiWalkLine,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

export type ShortcutColor = 'purple' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green';

export const workspaces: { id: string; name: string; initials: string; color: AvatarColor }[] = [
  { id: 'finance', name: 'Finance', initials: 'F', color: 'cyan' },
  { id: 'design', name: 'Design', initials: 'D', color: 'purple' },
  { id: 'wideset', name: 'Wideset', initials: 'W', color: 'brand' },
];

export const account = { name: 'Adam Smith', initials: 'AS' };

export const navigation = [
  { id: 'studio', label: 'Studio', icon: RiBarChartLine },
  { id: 'experiences', label: 'Experiences', icon: RiTimer2Line },
  { id: 'archived', label: 'Archived', icon: RiStarLine },
];

export const shortcuts: { id: string; label: string; color: ShortcutColor }[] = [
  { id: 'fit-restarts', label: 'Fit Restarts', color: 'purple' },
  { id: 'fit-family', label: 'FitFamily', color: 'indigo' },
  { id: 'fit-couple', label: 'Fit Couple 2024', color: 'blue' },
  { id: 'fit-vip', label: 'FitVIP', color: 'cyan' },
  { id: 'club-fit', label: 'Club Fit 2025', color: 'teal' },
  { id: 'on-demand', label: 'On-demand workout', color: 'green' },
];

/** The flow's steps; the header tracks the first. */
export const steps = ['Type', 'Details', 'Schedule', 'Publish'];

export type ExperienceType = {
  id: string;
  title: string;
  steps: number;
  icon: RemixiconComponentType;
};

export const categories: {
  value: string;
  label: string;
  icon: RemixiconComponentType;
  types: ExperienceType[];
}[] = [
  {
    value: 'training',
    label: 'Training',
    icon: RiBikeLine,
    types: [
      { id: 'workout', title: 'Workout', steps: 3, icon: RiOpenArmLine },
      { id: 'cardio', title: 'Cardio', steps: 2, icon: RiBikeLine },
      { id: 'running', title: 'Running', steps: 5, icon: RiRunLine },
    ],
  },
  {
    value: 'coaching',
    label: 'Coaching',
    icon: RiPictureInPictureLine,
    types: [
      { id: 'one-to-one', title: 'One-to-one', steps: 4, icon: RiUserVoiceLine },
      { id: 'group-class', title: 'Group class', steps: 3, icon: RiGroupLine },
      { id: 'nutrition', title: 'Nutrition plan', steps: 2, icon: RiRestaurantLine },
    ],
  },
  {
    value: 'consulting',
    label: 'Consulting',
    icon: RiUserLine,
    types: [
      { id: 'assessment', title: 'Assessment', steps: 3, icon: RiSurveyLine },
      { id: 'strategy-call', title: 'Strategy call', steps: 2, icon: RiPhoneLine },
      { id: 'follow-up', title: 'Follow-up', steps: 1, icon: RiCalendarCheckLine },
    ],
  },
  {
    value: 'workshops',
    label: 'Workshops',
    icon: RiVideoLine,
    types: [
      { id: 'mobility', title: 'Mobility', steps: 4, icon: RiBodyScanLine },
      { id: 'breathwork', title: 'Breathwork', steps: 2, icon: RiLungsLine },
      { id: 'recovery', title: 'Recovery', steps: 3, icon: RiHeartPulseLine },
    ],
  },
  {
    value: 'tours',
    label: 'Tours',
    icon: RiStore2Line,
    types: [
      { id: 'gym-tour', title: 'Gym tour', steps: 2, icon: RiBuilding2Line },
      { id: 'trail-run', title: 'Trail run', steps: 4, icon: RiRoadMapLine },
      { id: 'city-walk', title: 'City walk', steps: 3, icon: RiWalkLine },
    ],
  },
  {
    value: 'courses',
    label: 'Courses',
    icon: RiListUnordered,
    types: [
      { id: 'strength', title: 'Strength basics', steps: 6, icon: RiMedalLine },
      { id: 'boxing', title: 'Boxing fundamentals', steps: 5, icon: RiBoxingLine },
      { id: 'team-sports', title: 'Team sports', steps: 4, icon: RiFootballLine },
    ],
  },
];
