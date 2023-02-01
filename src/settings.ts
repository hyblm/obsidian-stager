import StagNation from "src/main";
import { StagLoginModal } from "src/main";
import { App, Notice, PluginSettingTab, Setting, ButtonComponent } from "obsidian";

export class StagNationSettingsTab extends PluginSettingTab {
	plugin: StagNation;
	loginModal: StagLoginModal;

	constructor(app: App, plugin: StagNation) {
		super(app, plugin);
		this.plugin = plugin;

		this.plugin.registerObsidianProtocolHandler("stag-login", (params) => {
			if (!this.loginModal || !this.loginModal.isOpen) return;

			if (params.error) {
				new Notice(`STAG Authentication failed with error: ${params.error}`);
				return;
			};
			// NEXT: Parseout the relevant login tokens and store them in settings
			console.log(params);
		});
	}

	display(): void {
		const {containerEl: StagLogin} = this;

		StagLogin.empty();

		StagLogin.createEl('h1', {text: 'Přihlášení uživatele do STAGu'});

		new Setting(StagLogin)
			.setName('University')
			.addDropdown((dropdown) => {
				dropdown.setValue(this.plugin.settings.university.name)
				dropdown.onChange((v: string) => {
					this.plugin.settings.university.name = v; // This is WRONG!!! need to change Universities to be a map instead of an array
				});
		});

		new Setting(StagLogin)
			.setName('Osobní číslo ve Stagu')
			.addText(text => text
				.setPlaceholder('Example: R2986')
				.setValue(this.plugin.settings.osCislo)
				.onChange(async (value) => {
					console.log('STAG Osobní číslo: ' + value);
					this.plugin.settings.osCislo = value;
					await this.plugin.saveSettings();
		}));

		const loginSlug = `/ws/login?originalURL=obsidian%3A%2F%2Fstag-login`;
		new ButtonComponent(StagLogin)
			.setButtonText("Přihlásit do STAGU")
			.onClick(() => {
				window.open(this.plugin.settings.university.link + loginSlug);
		});
	}
}

