
export class CultureInfo {
	constructor(private cultureName: string) {

	}

	public get name(): string {
		return this.cultureName;
	}
}
