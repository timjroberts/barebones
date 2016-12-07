import * as React from "react";

import { IntlContext } from "./IntlContext";
import { IIntlContextProps } from "./IIntlContextProps";

export interface IFormattedStringProps {
	readonly resourceId: string;

	readonly formatValues?: { [key: string]: any };
}

export class FormattedString extends React.Component<IFormattedStringProps, {}> {
	private _intlContext: IntlContext;

	constructor(props?: IFormattedStringProps, contextObj?: IIntlContextProps) {
		super(props, contextObj);

		if (!contextObj || !contextObj.context) {
			throw new Error();
		}

		this._intlContext = contextObj.context;
	}

	public render(): JSX.Element {
		return (
			<span>
				{this._intlContext.resourceManager.getFormattedString(this.props.resourceId, this.props.formatValues)}
			</span>
		);
	}
}

(FormattedString as any).contextTypes = {
	context: React.PropTypes.instanceOf(IntlContext)
}
