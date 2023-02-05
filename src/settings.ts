import StagNation from "src/main";
import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import University from "src/university";

export class StagNationSettingsTab extends PluginSettingTab {
	plugin: StagNation;
	loginState: Setting;

	constructor(app: App, plugin: StagNation) {
		super(app, plugin);
		this.plugin = plugin;

		this.plugin.registerObsidianProtocolHandler("stag-login", (params) => {
			if (params.error) {
				new Notice(`STAG Authentication failed with error: ${params.error}`);
				return;
			}

			this.plugin.updateLoginState(
				params.stagUserInfo,
				params.stagUserName,
				params.stagUserRole,
				params.stagUserTicket,
			);

			console.log("login state: " + this.plugin.settings.loginState);
			new Notice("You are now signed in as " + this.plugin.settings.loginState.stagUserName);
			this.updateLoginStateSetting()
		});
	}

	async display(): Promise<void> {
		const { containerEl: StagLogin } = this;

		StagLogin.empty();

		StagLogin.createEl('h2', {text: 'IS/STAG Authentication'});

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

		this.loginState = new Setting(StagLogin)
			.setName('Login State')
			.setDesc('Getting login state')

		this.updateLoginStateSetting()
		}

	updateLoginStateSetting() {
		if (this.plugin.settings.loginState.stagUserName === '')
			this.SettingLogin()
		else
			this.loginState
				.clear()
				.setName('Login State')
				.setDesc('Logged-in as ' + this.plugin.settings.loginState.stagUserName)
				.addButton(button => {
					button
						.setButtonText("Sign-out")
						.onClick(() => {
							this.plugin.clearLoginState();
							this.SettingLogin()
			})})
	}

	private SettingLogin() {
		this.loginState
			.clear()
			.setName('Login State')
			.setDesc('Currently not logged-in')
			.addButton(button => {
				button
					.setButtonText("Log-in to IS/STAG").setCta()
					.onClick(() => {
						window.open(this.plugin.settings.university);
		})})
	}
}
