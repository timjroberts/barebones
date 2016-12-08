import { CultureInfo } from "@core/globalization";
import IntlMessageFormat from "intl-messageformat";

import { MissingResourceError  } from "./errors";
import { ResourcePack } from "./ResourcePack";

import * as localResources from "#resources";

export class ResourceManager {
	private _resourcePack: ResourcePack;
	private _cultureInfo: CultureInfo;

	constructor(resourcePackData: Object)
	constructor(resourcePackData: Object, culture: CultureInfo)
	constructor(resourcePackData: Object, culture?: CultureInfo) {
		this._resourcePack = new ResourcePack(resourcePackData);
		this._cultureInfo = culture || CultureInfo.getCurrentCulture();
	}

	public get culture(): CultureInfo {
		return this._cultureInfo;
	}

	public getFormattedString(stringResourceId: string, values?: { [index: string]: string }): string {
		let resourceStrings = this._resourcePack.getStrings(this._cultureInfo);

		if (!resourceStrings) {
			resourceStrings = this._resourcePack.getStrings(new CultureInfo(this._cultureInfo.name.split('-')[0]));

			if (!resourceStrings) {
				throw new MissingResourceError(this.getCoreFormattedString("errors.missingStringResource", {"resourceId": stringResourceId, "cultureName": this._cultureInfo.name}));
			}
		}

		let stringToFormat = this.traverseStrings(resourceStrings, stringResourceId);

        let msgFormatter = new IntlMessageFormat(stringToFormat, this._cultureInfo.name);

        return msgFormatter.format(values);
	}

	public getBase64ImageData(imageResourceId: string): string {
		let images = this._resourcePack.getImages(this._cultureInfo);

		if (!images) {
			images = this._resourcePack.getImages(new CultureInfo(this._cultureInfo.name.split('-')[0]));

			if (!images) {
				throw new MissingResourceError(this.getCoreFormattedString("errors.missingImageResource", {"resourceId": imageResourceId, "cultureName": this._cultureInfo.name}));
			}
		}

		let imageData = images[imageResourceId];

		if (!imageData) {
			throw new MissingResourceError(this.getCoreFormattedString("errors.missingImageResource", {"resourceId": imageResourceId, "cultureName": this._cultureInfo.name}));
		}

		return imageData;
	}

	private getCoreFormattedString(stringResourceId: string, values?: { [index: string]: string }): string {
		let localResourceStrings = new ResourcePack(localResources);

		let resourceStrings = localResourceStrings.getStrings(this._cultureInfo);

		if (!resourceStrings) {
			resourceStrings = localResourceStrings.getStrings(new CultureInfo(this._cultureInfo.name.split('-')[0]));

			if (!resourceStrings) {
				resourceStrings = localResourceStrings.getStrings(new CultureInfo("en"));
			}
		}

		let stringToFormat = this.traverseStrings(resourceStrings, stringResourceId);

        let msgFormatter = new IntlMessageFormat(stringToFormat, this._cultureInfo.name);

        return msgFormatter.format(values);
	}

    private traverseStrings(strings: any, stringName: string): string {
        let stringWalkerFunc = function (currentStrings: any, tokens: string[]) {
            if (tokens.length === 1) return currentStrings[tokens[0]];

            return stringWalkerFunc(currentStrings[tokens[0]], tokens.splice(1));
        };

        return stringWalkerFunc(strings, stringName.split('.'));
    }
}
