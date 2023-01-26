import { App, ButtonComponent, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, renderResults, request, requestUrl, Setting } from 'obsidian';

interface StagNationSettings {
	name: string;
	wsCookie: string;
}

const DEFAULT_SETTINGS: StagNationSettings = {
	name: '',
	wsCookie: '',
}

export default class StagNation extends Plugin {
	settings: StagNationSettings;

	async onload() {
		await this.loadSettings();

		const OpenNextForReview = this.addRibbonIcon('calendar-with-checkmark', 'Open Next Topic for Review', (evt: MouseEvent) => {
			// TODO: otevřít poznámku, která vychází jako nejméně naučená
			});
		const ReviewForUpcommingClass = this.addRibbonIcon('go-to-file', 'Review Last Note for Upcomming Class', (evt: MouseEvent) => {
			// TODO: otevřít minulou poznámku z předmětu který bude začínat
			});
		const CreateCurrentClassNote = this.addRibbonIcon('pencil', 'Create Note for Current Class', (evt: MouseEvent) => {
			// TODO: vytvořit novou poznámku do předmětu který zrovna probíhá
			if (this.settings.name != '') {
				new Notice('You\'re doing fantastic ' + this.settings.name + '! Keep it up️ 🫶.');
			} else {
				new Notice('You\'re doing fantastic! Keep it up️ 🫶.');
			}
		});
		// Perform additional things with the ribbon
		OpenNextForReview.addClass('stagnation-ribbon-class');

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
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
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
						new SampleModal(this.app).open();
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
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class StagNationSettingsTab extends PluginSettingTab {
	plugin: StagNation;

	constructor(app: App, plugin: StagNation) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl: StagLogin} = this;

		StagLogin.empty();

		StagLogin.createEl('h2', {text: 'Přihlášení uživatele do STAGu'});

		new Setting(StagLogin)
			.setName('Osobní číslo ve Stagu')
			.addText(text => text
				.setPlaceholder('Example: R2986')
				.setValue(this.plugin.settings.name)
				.onChange(async (value) => {
					console.log('STAG Osobní číslo: ' + value);
					this.plugin.settings.name = value;
					await this.plugin.saveSettings();
				}));

		const loginUrl = "https://stagservices.upol.cz/ws/login?originalURL=obsidian%3A%2F%2Fopen";
		new ButtonComponent(StagLogin)
			.setButtonText("Přihlásit do STAGU")
			.onClick(() => {
				new Notice("Opening Login page in your browser");
				window.open(loginUrl);
		});
	}
}
