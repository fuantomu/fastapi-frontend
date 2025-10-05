import type { BaseIconProvider } from "$lib/versions/BaseIconProvider";

export class IconProvider implements BaseIconProvider {
    getVersionIcon(size?: string): string {
        return this.getFromSource('ability_garrosh_hellscreams_warsong', size);
    }

    getFromSource(icon: string, size: string = '36'): string {
        return `https://render-eu.worldofwarcraft.com/icons/${size}/${icon}.jpg`;
    }

}