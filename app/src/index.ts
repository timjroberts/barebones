import { Resolver } from "@core/module-resolver";

Resolver.register();

import "@core/node-system";

import { ResourceManager } from "@core/resources";

import * as appResources from "!resources";

console.log(new ResourceManager(appResources).getFormattedString("messages.helloWorld"));
