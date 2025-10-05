import type { BaseIconProvider } from "$lib/versions/BaseIconProvider";

export class IconProvider implements BaseIconProvider {
    getVersionIcon(size?: string): string {
        return this.getFromSource('achievment_boss_madnessofdeathwing', size);
    }

    getFromSource(icon: string, size: string = '36'): string {
        return `https://render-eu.worldofwarcraft.com/icons/${size}/${icon}.jpg`;
    }

}