import { Plugin } from 'obsidian';
import { StagNationSettingsTab } from './settings';
import Stag from './stag';

interface StagNationSettings {
	stag: Stag;
}

const DEFAULT_SETTINGS: StagNationSettings = {
	stag: new Stag({}),
}

export default class StagNation extends Plugin {
	settings: StagNationSettings;

	async onload() {
		await this.loadSettings();
		await this.saveSettings();
		this.addSettingTab(new StagNationSettingsTab(this.app, this));
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS,
			await this.loadData());

		// We have to reinstantiate Stag class to get access to its methods
		// because functions don't get saved into JSON.
		this.settings.stag = new Stag(this.settings.stag)
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
