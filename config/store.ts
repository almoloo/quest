import { create } from 'zustand';
import { Profile } from './definitions';

export const useProfileStore = create((set) => ({
	profile: null as Profile | null,
	setProfile: (profile: Profile) => set({ profile }),
}));
