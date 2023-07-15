import Stager from "src/main";
import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import University from "src/university";
import { StagUser } from "./stag";

export class StagerSettingsTab extends PluginSettingTab {
	plugin: Stager;
	loginState: Setting;

	constructor(app: App, plugin: Stager) {
		super(app, plugin);
		this.plugin = plugin;

		this.plugin.registerObsidianProtocolHandler("stag-login", (params) => {
			if (params.error) {
				new Notice(`STAG Authentication failed with error: ${params.error}`);
				return;
			}

			if (this.plugin.settings.stag.user.ticket != '') {
				console.log(`Caught old ticket (${this.plugin.settings.stag.user.ticket}). Invalidating ...`)
				this.plugin.settings.stag.invalidateTicket()
			}

			this.plugin.settings.stag.user = new StagUser({
				info: params.stagUserInfo,
				name: params.stagUserName,
				role: params.stagUserRole,
				ticket: params.stagUserTicket,
			})

			this.plugin.saveSettings()

			new Notice("You are now loged in as " + this.plugin.settings.stag.user.name);
			this.updateLoginStateSetting()
		});
	}

	async display(): Promise<void> {
		const { containerEl: StagLogin } = this;

		StagLogin.empty();

		StagLogin.createEl('h2', { text: 'IS/STAG Authentication' });

		this.loginState = new Setting(StagLogin)
			.setName('Login State')
			.setDesc('Getting login state')

		this.updateLoginStateSetting()

		new Setting(StagLogin)
			.setName('Osobní číslo ve Stagu')
			.addText(text => text
				.setPlaceholder('Example: R2986')
				.setValue(this.plugin.settings.stag.osCislo)
				.onChange(async (value) => {
					console.log('STAG Osobní číslo: ' + value);
					this.plugin.settings.stag.osCislo = value;
					await this.plugin.saveSettings();
				}));

		StagLogin.createEl('h3', { text: 'Settings' });

		new Setting(StagLogin)
			.setName("Language")
			.setDesc("Whether to show information from STAG in Czech or English")
			.addDropdown(lang => {
				lang
					.addOption("cz", "Czech")
					.addOption("en", "English")
					.setValue(this.plugin.settings.stag.language)
					.onChange(async v => {
						this.plugin.settings.stag.language = v
						await this.plugin.saveSettings();
					})
			})
	}

	updateLoginStateSetting() {
		if (this.plugin.settings.stag.user.name === '')
			this.SettingLogin()
		else
			this.loginState
				.clear()
				.setName("Logged-in as " + this.plugin.settings.stag.user.name)
				.setDesc(this.plugin.settings.stag.daysToLive + " days left before re-login needed")
				.addButton(button => {
					button
						.setButtonText("Log-out of " + this.plugin.settings.stag.university.name)
						.onClick(() => {
							this.plugin.settings.stag.logout()
							this.plugin.saveSettings()
							this.SettingLogin()
						})
				})
	}

	private SettingLogin() {
		this.loginState
			.clear()
			.setName('Login State')
			.setDesc('Currently not logged-in')
			.addDropdown((dropdown) => {
				University.values.forEach((uni) => {
					dropdown.addOption(uni.link, uni.name);
				});
				dropdown.setValue(this.plugin.settings.stag.university.link);
				dropdown.onChange(async (v) => {
					University.values.forEach((uni) => {
						if (uni.link === v)
							this.plugin.settings.stag.university = uni;
					})
					this.plugin.saveSettings();
				});
			})
			.addButton(button => {
				button
					.setButtonText("Log-in to IS/STAG").setCta()
					.onClick(() => this.plugin.settings.stag.login()
					)
			})
	}
}
