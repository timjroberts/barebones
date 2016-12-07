import * as React from "react";

import { IntlContext } from "./IntlContext";
import { IIntlContextProps } from "./IIntlContextProps";

export interface IImageProps {
	readonly resourceId: string;
}

export class Image extends React.Component<IImageProps, {}> {
	private _intlContext: IntlContext;

	constructor(props?: IImageProps, contextObj?: IIntlContextProps) {
		super(props, contextObj);

		if (!contextObj || !contextObj.context) {
			throw new Error();
		}

		this._intlContext = contextObj.context;
	}

	public render(): JSX.Element {
		let dataUri = `data:image/png;base64,${this._intlContext.resourceManager.getBase64ImageData(this.props.resourceId)}`;

		return (
			<img src={dataUri} />
		);
	}
}

(Image as any).contextTypes = {
	context: React.PropTypes.instanceOf(IntlContext)
}
