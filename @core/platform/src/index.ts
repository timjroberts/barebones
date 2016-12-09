import { IPlatformFunctions } from "./IPlatformFunctions";

declare var global;

export function registerPlatformFunctions(functions: IPlatformFunctions): void {
	global["@core/platform:functions"] = functions;
}

export function getPlatformFunctions(): IPlatformFunctions {
	return global["@core/platform:functions"];
}

export * from "./errors";
export * from "./IPlatformFunctions";