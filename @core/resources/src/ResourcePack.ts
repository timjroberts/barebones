import { CultureInfo } from "@core/globalization";

import { IResources, IResourcePackData } from "./IResourcePackData";

export class ResourcePack {
	private resourcePackData: IResourcePackData;

	constructor(resources: Object) {
		this.resourcePackData = (<IResources>resources).resources;
	}

	public getStrings(culture: CultureInfo): Object | undefined {
		let resourcePackData = this.resourcePackData[culture.name];

		return resourcePackData ? resourcePackData.strings : undefined;
	}
}
