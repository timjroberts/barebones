import * as React from "react";
import { CultureInfo } from "@core/globalization";
import { ResourceManager } from "@core/resources";

import { IntlContext } from "./IntlContext";
import { IIntlContextProps } from "./IIntlContextProps";

export interface IIntlProviderProps {
	readonly locale?: CultureInfo | string;
}

export interface IIntlProviderState {
	context: IntlContext;
}

export class IntlProvider extends React.Component<IIntlProviderProps, IIntlProviderState> {
	private _isMounted: boolean;

	constructor(props?: IIntlProviderProps, contextObj?: IIntlContextProps) {
		super(props, contextObj);

		let culture =
			this.props.locale
			? typeof this.props.locale === "string"
				? new CultureInfo(this.props.locale)
				: this.props.locale
			: contextObj && contextObj.context
				? contextObj.context.culture
				: CultureInfo.getCurrentCulture();

		this.state = {
			context: new IntlContext(culture)
		}

		this._isMounted = false;
	}

	public getChildContext(): IIntlContextProps {
		return {
			context: this.state.context
		}
	}

	//public async componentDidMount(): Promise<void> {
	public componentDidMount(): void {
		//await WebComponentFactory.loadResources(this.state.intlContext.culture);

		this._isMounted = true;

		this.setState({
			context: new IntlContext(this.state.context.culture)
		});
	}

	public render(): JSX.Element {
		return <span>{this._isMounted ? this.props.children : undefined}</span>;
	}
}

(IntlProvider as any).contextTypes = {
	context: React.PropTypes.instanceOf(IntlContext)
};

(IntlProvider as any).childContextTypes = {
	context: React.PropTypes.instanceOf(IntlContext)
};
