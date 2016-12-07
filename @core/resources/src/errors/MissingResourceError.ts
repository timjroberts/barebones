import { CoreError, SystemError } from "@core/platform";

export class MissingResourceError extends SystemError {
	constructor(message?: string, innerError?: CoreError) {
		super(message, innerError);
	}
}
