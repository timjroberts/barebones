import { Resolver } from "@core/module-resolver";

Resolver.register();

import "@core/node-platform";

import { ResourceManager } from "@core/resources";
import { NumberFormat, CultureInfo, NumberFormatOptions } from "@core/globalization";

import * as appResources from "#resources";

console.log(new ResourceManager(appResources).getFormattedString("messages.helloWorld"));

console.log(new NumberFormat(new CultureInfo("en-US")).format(12345.67));
console.log(new NumberFormat(new CultureInfo("de-DE")).format(12345.67));

let options: NumberFormatOptions = {
	style: "currency",
	currency: "USD"
}

console.log(new NumberFormat(new CultureInfo("en-US"), options).format(12345.67));
console.log(new NumberFormat(new CultureInfo("de-DE"), options).format(12345.67));
