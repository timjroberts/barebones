import * as React from "react";
import { AppRegistry } from "react-native";

import "@web/web-platform";

import { Home } from "./Home";

AppRegistry.registerComponent("reactnativeapp", () => Home);

//https://github.com/jshanson7/babel-plugin-resolver/blob/master/lib/ResolverPlugin.js