import Database from "better-sqlite3";

export const db = new Database("swiped.sqlite3", {
	// verbose: console.log
});

export const SettingState = {
    Disabled: 0,
    Enabled: 1
};
