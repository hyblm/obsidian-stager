import { Plugin, requestUrl } from 'obsidian';
import { StagNationSettingsTab } from './settings';
import University from './university';

// http://www.stag-client.cz
//		?stagUserTicket=TICKET_UZIVATELE
//		&stagUserInfo=BASE64_ZAKODOVANY_JSON_S_INFORMACEMI_O_ROLICH

interface StagLogin {
	stagUserInfo: string,
	stagUserName: string,
	stagUserRole: string,
	stagUserTicket: string,
	created: number,
}

const BLANK_LOGIN: StagLogin = {
	stagUserInfo: '',
	stagUserName: '',
	stagUserRole: '',
	stagUserTicket: '',
	created: 0
}

interface StagNationSettings {
	university: string;
	loginState: StagLogin;
	osCislo: string;
	language: string;
}

const DEFAULT_SETTINGS: StagNationSettings = {
	university: University.UPOL.link,
	loginState: BLANK_LOGIN,
	osCislo: '',
	language: 'cz',
}

export default class StagNation extends Plugin {
	settings: StagNationSettings;

	async onload() {
		await this.loadSettings();
		this.settings.loginState.created = Date.now()
		await this.saveSettings();
		this.addSettingTab(new StagNationSettingsTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS,
			await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async createLogin(
		stagUserInfo: string, stagUserName: string,
		stagUserRole: string, stagUserTicket: string)
	{
		this.settings.loginState = {
			stagUserInfo: stagUserInfo,
			stagUserName: stagUserName,
			stagUserRole: stagUserRole,
			stagUserTicket: stagUserTicket,
			created: Date.now()
		}
		this.saveSettings();
	}

	stagCall (group: string, service: string): string {
		return this.settings.university + '/ws/services/rest2/' + group + '/' + service + '?'
	}

	async clearLogin()
	{
		requestUrl(this.stagCall("help", "invalidateTicket")
			+ 'ticket=' + this.settings.loginState.stagUserTicket)
			.then(res => {
				if (res.text === "OK")
				{
					this.settings.loginState = BLANK_LOGIN
					console.log("Got response: (" + res.text + ") - Log-out succesful")
				}
				else
				{
					console.log("Got response: (" + res.text + ") - Unable to logout")
					console.log("Ticket will be invalidated with next succesful log-in")
					const ticket = this.settings.loginState.stagUserTicket
					this.settings.loginState = BLANK_LOGIN
					this.settings.loginState.stagUserTicket = ticket
				}
		})
		this.saveSettings();
	}
}
