import * as React from "react";
import { ResourceManager } from "@core/resources";

import { IntlContext } from "./IntlContext";
import { IIntlContextProps } from "./IIntlContextProps";

export interface IFormattedStringProps {
	readonly resourceId: string;

	readonly resources: Object;

	readonly formatValues?: { [key: string]: any };
}

export class FormattedString extends React.Component<IFormattedStringProps, {}> {
	private _resourceMgr: ResourceManager;

	constructor(props: IFormattedStringProps, contextObj?: IIntlContextProps) {
		super(props, contextObj);

		if (!contextObj || !contextObj.context) {
			throw new Error();
		}

		this._resourceMgr = new ResourceManager(props.resources, contextObj.context.culture);
	}

	public render(): JSX.Element {


		return (
			<span>
				{this._resourceMgr.getFormattedString(this.props.resourceId, this.props.formatValues)}
			</span>
		);
	}
}

(FormattedString as any).contextTypes = {
	context: React.PropTypes.instanceOf(IntlContext)
}
