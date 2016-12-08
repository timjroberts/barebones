import * as React from "react";
import "@core/resources";

import { IntlProvider, FormattedString, Image } from "@web/components-il8n";

import * as appResources from "#resources";

export class SpaAppComponent extends React.Component<{}, {}> {
	public render(): JSX.Element {
		return (
			<div>
				<IntlProvider locale={"cy-GB"}>
					<FormattedString resourceId={"messages.helloWorld"} resources={appResources} />

					<Image resourceId={"flag.png"} resources={appResources} />
				</IntlProvider>
			</div>
		);
	}
}
