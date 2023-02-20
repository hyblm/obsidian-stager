export default class University {
	private static readonly valuesArr: University[] = [];

	static get values(): ReadonlyArray<University> {
		return this.valuesArr;
	}

	static readonly UPOL = new University(
	"Univerzita Palackého v Olomouci",
	"https://stagservices.upol.cz"
	);

	static readonly UTB = new University(
	"Univerzita Tomáše Bati ve Zlíně",
	"https://stag-ws.utb.cz"
	);

	private constructor(readonly name: string, readonly link: string) {
		University.valuesArr.push(this);
	}
}
