import * as React from "react";
import { ResourceManager } from "@core/resources";

import { IntlContext } from "./IntlContext";
import { IIntlContextProps } from "./IIntlContextProps";

export interface IImageProps {
	readonly resourceId: string;

	readonly resources: Object;
}

export class Image extends React.Component<IImageProps, {}> {
	private _resourceMgr: ResourceManager;

	constructor(props: IImageProps, contextObj?: IIntlContextProps) {
		super(props, contextObj);

		if (!contextObj || !contextObj.context) {
			throw new Error();
		}

		this._resourceMgr = new ResourceManager(props.resources, contextObj.context.culture);
	}

	public render(): JSX.Element {
		let dataUri = `data:image/png;base64,${this._resourceMgr.getBase64ImageData(this.props.resourceId)}`;

		return (
			<img src={dataUri} />
		);
	}
}

(Image as any).contextTypes = {
	context: React.PropTypes.instanceOf(IntlContext)
}
