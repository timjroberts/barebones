import { CultureInfo } from "@core/globalization";
import IntlMessageFormat from "intl-messageformat";

import { ResourcePack } from "./ResourcePack";

export class ResourceManager {
	private resourcePack: ResourcePack;
	private cultureInfo: CultureInfo;

	constructor(resourcePackData: Object)
	constructor(resourcePackData: Object, culture?: CultureInfo) {
		this.resourcePack = new ResourcePack(resourcePackData);
		this.cultureInfo = culture || CultureInfo.getCurrentCulture();
	}

	public get culture(): CultureInfo {
		return this.cultureInfo;
	}

	public getFormattedString(stringResourceId: string, values?: { [index: string]: string }): string {
		let resourceStrings = this.resourcePack.getStrings(this.cultureInfo);

		if (!resourceStrings) {
			resourceStrings = this.resourcePack.getStrings(new CultureInfo(this.cultureInfo.name.split('-')[0]));

			if (!resourceStrings) throw new Error(`Could not find string resource '${stringResourceId}' for culture '${this.cultureInfo.name}'`);
		}

		let stringToFormat = this.traverseStrings(resourceStrings, stringResourceId);

        let msgFormatter = new IntlMessageFormat(stringToFormat, this.cultureInfo.name);

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
