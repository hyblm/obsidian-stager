const loginSlug = `/ws/login?originalURL=obsidian%3A%2F%2Fstag-login`;

export default class University {
	private static readonly valuesArr: University[] = [];

	static get values(): ReadonlyArray<University> {
		return this.valuesArr;
	}

	static readonly UPOL = new University(
	"Univerzita Palackého v Olomouci",
	"https://stagservices.upol.cz" + loginSlug
	);

	static readonly YT = new University(
	"A surprise",
	"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
	);

	private constructor(readonly name: string, readonly link: string) {
		University.valuesArr.push(this);
	}
}
