import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface UpolSettings {
	name: string;
}

const DEFAULT_SETTINGS: UpolSettings = {
	name: ''
}

export default class UpolBuddy extends Plugin {
	settings: UpolSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const OpenClassNote = this.addRibbonIcon('dice', 'UPOL Buddy', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			// IDEA: Po kliknutí by mohlo:
			//       - otevřít náhodnou poznámku z jakéhokoliv předmětu
			//       - otevřít minulou poznámku z předmětu který bude začínat
			//       - otevřít poznámku, která vychází jako nejméně naučená
			//       - vytvořit novou poznámku do předmětu který zrovna probíhá
			if (this.settings.name != '') {
				new Notice('You\'re doing fantastic ' + this.settings.name + '! Keep it up️ 🫶.');
			} else {
				new Notice('You\'re doing fantastic! Keep it up️ 🫶.');
			}
		});
		// Perform additional things with the ribbon
		OpenClassNote.addClass('upol-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// IDEA: Mohlo by zjistit jestli se jedná o poznámku ke konkrétnímu předmětu a napsat
		//       za jak kolik dní zbývá do zkoušky z toho předmětu, pokud ji má student zapsanou.
		//
		// TODO: Vypisovat pouze pokud má poznámka konkrétní štítek
		const ExamDate = this.addStatusBarItem();
		ExamDate.setText('Exam in 8 days 🗓️');

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
		this.addSettingTab(new SampleSettingTab(this.app, this));

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

class SampleSettingTab extends PluginSettingTab {
	plugin: UpolBuddy;

	constructor(app: App, plugin: UpolBuddy) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl: UpolName} = this;

		UpolName.empty();

		UpolName.createEl('h2', {text: 'Settings for UPOL Buddy plugin.'});

		new Setting(UpolName)
			.setName('Jméno')
			.setDesc('Tvoje jméno for affirmations.')
			.addText(text => text
				.setPlaceholder('Enter your name')
				.setValue(this.plugin.settings.name)
				.onChange(async (value) => {
					console.log('UPOL jmeno: ' + value);
					this.plugin.settings.name = value;
					await this.plugin.saveSettings();
				}));
	}
}
