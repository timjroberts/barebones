import { registerSystemFunctions } from "@core/system";
import { NodeSystemFunctions } from "./NodeSystemFunctions";

registerSystemFunctions(new NodeSystemFunctions());
