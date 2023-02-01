import { App, ButtonComponent, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { StagNationSettingsTab } from 'src/settings';

type University = {
	id: string;
	name: string;
	link: string;
}

interface StagNationSettings {
	osCislo: string;
	university: University;
	wsCookie: string;
}

/* interface StagNationSettings {
	osCislo: string;
	university: string;
	loginDomain: string;
	wsCookie: string;
} */

/* Universities = University[
	{"UPOL", "Univerzita Palackého v Olomouci", "https://stagservices.upol.cz"},
] */

const Universities:  University[] = [{
	id: 'UPOL',
	name: 'Univerzita Palackého v Olomouci',
	link: 'https://stagservices.upol.cz'},
];

const DEFAULT_SETTINGS: StagNationSettings = {
	osCislo: '',
	university: Universities[0],
	wsCookie: '',
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
			if (this.settings.osCislo != '') {
				new Notice('You\'re doing fantastic ' + this.settings.osCislo + '! Keep it up️ 🫶.');
			} else {
				new Notice('You\'re doing fantastic! Keep it up 🫶.');
			}
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
				new StagLoginModal(this.app).open();
			}
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
				if (!checking) {
						new StagLoginModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new StagNationSettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS,
			await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export class StagLoginModal extends Modal {
	private opened = false;
	plugin: StagNation;
	
	get isOpen(): boolean { return this.opened }

	private readonly loginLink: string;

	constructor(app: App) {
		super(app);
		this.loginLink = this.plugin.settings.university.link + `/ws/login?originalURL=obsidian%3A%2F%2Fstag-login`;
	}

	onOpen() {
		this.opened = true;
		const {contentEl} = this;
		contentEl.setText("The login page you'll be redirected to is different from the one you are used to.\n That's just how STAG wants us to handle it.");

		new ButtonComponent(this.modalEl.createDiv())
			.setButtonText("Přejít k přihlášení")
			.onClick(() => {
				new Notice("Opening Login page in your browser");
				window.open(this.loginLink);
		});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
