import * as React from "react";

import { ResourceManager } from "@core/resources";

import * as appResources from "#resources";

export class SpaAppComponent extends React.Component<{}, {}> {
	public render(): JSX.Element {
		let rm = new ResourceManager(appResources);

		return (
			<span>{rm.getFormattedString("messages.helloWorld")}</span>
		);
	}
}
