import * as React from "react";

import { IntlProvider, FormattedString, Image } from "@web/components-il8n";

import * as appResources from "#resources";

export class SpaAppComponent extends React.Component<{}, {}> {
	public render(): JSX.Element {
		return (
			<div>
				<IntlProvider locale={"en"} resources={appResources}>
					<FormattedString resourceId={"messages.helloWorld"} />

					<Image resourceId={"flag"} />
				</IntlProvider>
			</div>
		);
	}
}
