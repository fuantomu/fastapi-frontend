export interface BaseIconProvider {
	getVersionIcon(size?: string): string;

	getFromSource(icon: string, size?: string): string;

}