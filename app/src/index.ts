import { Resolver } from "@core/module-resolver";

Resolver.register();

import "@core/node-system";

import { ResourceManager } from "@core/resources";

ResourceManager.doIt();