import { CultureInfo } from "@core/globalization";
import { ResourceManager } from "@core/resources";

export class IntlContext {
	private _culture: CultureInfo;
	private _resourceMgr: ResourceManager;

	constructor(culture: CultureInfo, resourceManager: ResourceManager) {
		this._culture = culture;
		this._resourceMgr = resourceManager;
	}

	public get culture(): CultureInfo {
		return this._culture;
	}

	public get resourceManager(): ResourceManager {
		return this._resourceMgr;
	}
}
