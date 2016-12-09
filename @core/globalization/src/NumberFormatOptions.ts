export interface NumberFormatOptions {
	readonly style?: "decimal" | "currency" | "percent";

	readonly currency?: string;

	readonly currencyDisplay?: "symbol" | "code" | "name";

	readonly useGrouping?: boolean;
}
