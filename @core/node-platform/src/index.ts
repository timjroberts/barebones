import { registerPlatformFunctions } from "@core/platform";
import { NodeSystemFunctions } from "./NodePlatformFunctions";

registerPlatformFunctions(new NodeSystemFunctions());
