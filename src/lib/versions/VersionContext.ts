import type { BaseGameVersion } from '$lib/versions/GameVersion';
import type { BaseIconProvider } from '$lib/versions/BaseIconProvider';

export type VersionContext = {
	iconProvider: BaseIconProvider;
	gameVersion: BaseGameVersion;
};