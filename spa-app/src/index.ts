import * as React from "react";
import * as ReactDOM from "react-dom";

import "@web/web-platform";

import { SpaAppComponent } from "./SpaAppComponent";

ReactDOM.render(React.createElement(SpaAppComponent), document.getElementById("main"));
