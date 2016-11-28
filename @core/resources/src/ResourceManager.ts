import { CultureInfo } from "@core/globalization";

export class ResourceManager {
	public static doIt(): void {
		console.log("Yo!!");
		new CultureInfo("en-GB");
	}
}