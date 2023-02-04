import { Notice, Plugin, } from 'obsidian';
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

		const OpenNextForReview = this.addRibbonIcon(
			'calendar-with-checkmark', // Icon
			'Open Next Topic for Review', // Description
			() => {
			// TODO: otevřít poznámku, která vychází jako nejméně naučená
		});

		const ReviewForUpcommingClass = this.addRibbonIcon(
			'go-to-file',
			'Review Last Note for Upcomming Class',
			() => {
			// TODO: otevřít minulou poznámku z předmětu který bude začínat
		});

		const CreateCurrentClassNote = this.addRibbonIcon(
			'pencil',
			'Create Note for Current Class',
			() => {
			// TODO: vytvořit novou poznámku do předmětu který zrovna probíhá
			// IDEA: Při vytváření poznámky bychom mohli kontrolovat jestli existuje template
			//		 se jménem učitele nebo skratkou/jménem předmětu (předmět by měl přednost před učitelem)
			//		 a vytvořit poznámku používající konkrétní template (možná bude nutné i kontrolovat jestli-je zapnutý built-in
			//		 plugin Templates)
				new Notice('You\'re doing fantastic! Keep it up 🫶.');
		});

		// Perform additional things with the ribbon
		OpenNextForReview.addClass('stagnation-ribbon-class');
		ReviewForUpcommingClass.addClass('stagnation-ribbon-class');
		CreateCurrentClassNote.addClass('stagnation-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// IDEA: Mohlo by zjistit jestli se jedná o poznámku ke konkrétnímu předmětu a napsat
		//       za jak kolik dní zbývá do zkoušky z toho předmětu, pokud ji má student zapsanou.
		//
		// TODO: Vypisovat pouze pokud má poznámka konkrétní štítek
		const ExamDate = 8;
		const ExamDateNotifier = this.addStatusBarItem();
		ExamDateNotifier.setText("Exam in " + ExamDate + " days 🗓️");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'create-note-for-class',
			name: 'Create a new note for the current class',
			callback: () => {
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new StagNationSettingsTab(this.app, this));

		// == UNUSED BOILERPLATE == //
		//
		//
		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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
