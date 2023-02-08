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

			if (this.plugin.settings.loginState.stagUserTicket != '') {
				this.plugin.clearLogin()
			}

			this.plugin.createLogin(
				params.stagUserInfo,
				params.stagUserName,
				params.stagUserRole,
				params.stagUserTicket,
			);

			new Notice("You are now loged in as " + this.plugin.settings.loginState.stagUserName);
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

		StagLogin.createEl('h3', {text: 'Settings'});

		new Setting(StagLogin)
			.setName("Language")
			.setDesc("Whether to show information from STAG in Czech or English")
			.addDropdown(lang => {
				lang
					.addOption("cz", "Czech")
					.addOption("en", "English")
					.setValue(this.plugin.settings.language)
					.onChange(async v => {
						this.plugin.settings.language = v
						await this.plugin.saveSettings();
		})})
		}

	updateLoginStateSetting() {
		if (this.plugin.settings.loginState.stagUserName === '')
			this.SettingLogin()
		else
			this.loginState
				.clear()
				.setName('Logged-in as ' + this.plugin.settings.loginState.stagUserName)
				.setDesc((90 - Math.trunc((Date.now() - this.plugin.settings.loginState.created) / (1000 * 3600 * 24)))
				+ " days left before re-login needed")
				.addButton(button => {
					button
						.setButtonText("Log-out")
						.onClick(() => {
							this.plugin.clearLogin();
							this.SettingLogin()
			})})
	}

	private SettingLogin() {
		// TODO: add long ticket flag to login
		const loginSlug = `/ws/login?originalURL=obsidian%3A%2F%2Fstag-login`;
		this.loginState
			.clear()
			.setName('Login State')
			.setDesc('Currently not logged-in')
			.addButton(button => {
				button
					.setButtonText("Log-in to IS/STAG").setCta()
					.onClick(() => {
						window.open(this.plugin.settings.university + loginSlug);
		})})

	}
}
