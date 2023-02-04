import { Plugin } from 'obsidian';
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
}

const BLANK_LOGIN: StagLogin = {
	stagUserInfo: '',
	stagUserName: '',
	stagUserRole: '',
	stagUserTicket: '',
}

interface StagNationSettings {
	university: string;
	loginState: StagLogin;
	osCislo: string;
}

const DEFAULT_SETTINGS: StagNationSettings = {
	university: University.UPOL.link,
	loginState: BLANK_LOGIN,
	osCislo: '',
}

export default class StagNation extends Plugin {
	settings: StagNationSettings;

	async onload() {
		await this.loadSettings();
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

	async updateLoginState(
		stagUserInfo: string, stagUserName: string,
		stagUserRole: string, stagUserTicket: string)
	{
		this.settings.loginState.stagUserInfo = stagUserInfo
		this.settings.loginState.stagUserName = stagUserName
		this.settings.loginState.stagUserRole = stagUserRole
		this.settings.loginState.stagUserTicket = stagUserTicket 

		this.saveSettings();
	}

	async clearLoginState()
	{
		this.settings.loginState = BLANK_LOGIN
		this.saveSettings();
	}
}
