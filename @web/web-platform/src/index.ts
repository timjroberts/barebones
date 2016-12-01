import { registerPlatformFunctions } from "@core/platform";
import { WebPlatformFunctions } from "./WebPlatformFunctions";

registerPlatformFunctions(new WebPlatformFunctions());
