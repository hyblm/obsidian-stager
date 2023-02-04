import StagNation from "src/main";
import { App, PluginSettingTab, Setting, ButtonComponent, Notice } from "obsidian";
import University from "src/university";

export class StagNationSettingsTab extends PluginSettingTab {
	plugin: StagNation;

	constructor(app: App, plugin: StagNation) {
		super(app, plugin);
		this.plugin = plugin;

		this.plugin.registerObsidianProtocolHandler("stag-login", (params) => {
			if (params.error) {
				new Notice(`STAG Authentication failed with error: ${params.error}`);
				return;
			}

			this.plugin.updateLoginState(
				params.stagUserInfo, params.stagUserName,
				params.stagUserRole, params.stagUserTicket,
			);
			console.log(this.plugin.settings.loginState);
			new Notice(`You are now signed in as ${this.plugin.settings.loginState.stagUserName}`);
		});
	}

	display(): void {
		const {containerEl: StagLogin} = this;

		StagLogin.empty();

		StagLogin.createEl('h3', {text: 'Přihlášení uživatele do STAGu'});

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

		new Setting(StagLogin)
			.setName('University')
			.addDropdown((dropdown) => {
				University.values.forEach((s) => {
					dropdown.addOption(s.link, s.name);
				});
				dropdown.setValue(this.plugin.settings.university);
				dropdown.onChange(async (v) => {
					this.plugin.settings.university = v;
					this.plugin.saveSettings();
				});
		});

		new ButtonComponent(StagLogin)
			.setIcon("log-in")
			.setButtonText("Sign-in to IS/STAG")
			.setCta()
			.setTooltip("You're not signed in right now.")
			.onClick(() => {
				window.open(this.plugin.settings.university);
		});
	}
}
