export default class University {
	private static readonly valuesArr: University[] = [];

	static get values(): ReadonlyArray<University> {
		return this.valuesArr;
	}

	static readonly UPOL = new University(
	"Univerzita Palackého v Olomouci",
	"https://stagservices.upol.cz"
	);

	private constructor(readonly name: string, readonly link: string) {
		University.valuesArr.push(this);
	}
}
