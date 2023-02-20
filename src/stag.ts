import { requestUrl } from "obsidian";
import University from "./university";

export class StagUser {
	info: string;
	name: string;
	role: string;
	ticket: string;

	constructor({ ticket = '', info = '', name = '', role = '' }) {
		this.info = info,
			this.name = name,
			this.role = role,
			this.ticket = ticket
	}
}

export default class Stag {
	user: StagUser;
	university: University;
	osCislo: string;
	language: string;
	created: number;

	constructor({ user = new StagUser({}), uni = University.UPOL, created = Date.now(), lang = "cz", osCislo = "" }) {
		this.user = user
		this.university = uni
		this.created = created
		this.language = lang
		this.osCislo = osCislo
	}

	login() {
		const loginSlug = "/ws/login?originalURL=obsidian%3A%2F%2Fstag-login";
		const longTicket = "&longTicket=1"
		window.open(this.university.link + loginSlug + longTicket);
	}

	get daysToLive() {
		return 90 - Math.trunc((Date.now() - this.created) / (1000 * 3600 * 24))
	}

	logout() {
		const ticket = (this.invalidateTicket() ? "" : this.user.ticket)
		this.user = new StagUser({ ticket: ticket })
	}

	call(group: string, service: string) {
		if (0 >= this.daysToLive) {
			// TODO: Add popup to relogin if the ticket is invalid
		}
		return this.university.link + '/ws/services/rest2/' + group + '/' + service + '?'
	}

	invalidateTicket() {
		let success = false
		requestUrl(this.call("help", "invalidateTicket") + 'ticket=' + this.user.ticket)
			.then(res => {
				if (res.text === "OK") {
					console.log("Got response: (" + res.text + ") - Log-out succesful")
					success = true
				}
			})
			.catch(reason => {
				console.log("Unable to logout : " + reason)
				console.log("Ticket will be invalidated with next succesful log-in")
			})
		return success
	}
}
