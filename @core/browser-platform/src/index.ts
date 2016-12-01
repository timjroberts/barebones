import { registerPlatformFunctions } from "@core/platform";
import { BrowserPlatformFunctions } from "./BrowserPlatformFunctions";

registerPlatformFunctions(new BrowserPlatformFunctions());
