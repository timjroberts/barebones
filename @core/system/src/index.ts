import { ISystemFunctions } from "./ISystemFunctions";

declare var global;

export function registerSystemFunctions(functions: ISystemFunctions): void {
	global["@core/system:functions"] = functions;
}

export function getSystemFunctions(): ISystemFunctions {
	return global["@core/system:functions"];
}

export * from "./ISystemFunctions";