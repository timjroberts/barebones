export interface IResourcePack {
	readonly importPath: string;

	readonly strings: Object;
	readonly images: Object;
}

export interface IResourcePackData {
	readonly [cultureName: string]: IResourcePack;
}

export interface IResources {
	readonly resources: IResourcePackData;
}
