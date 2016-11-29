export interface IResourcePack {
	readonly importPath: string;

	readonly strings: Object | undefined;
}

export interface IResourcePackData {
	readonly [cultureName: string]: IResourcePack;
}

export interface IResources {
	readonly resources: IResourcePackData;
}
