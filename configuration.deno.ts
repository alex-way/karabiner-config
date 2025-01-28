import {
	type FromAndToKeyCode,
	ifApp,
	map,
	rule,
	writeToProfile,
} from "https://deno.land/x/karabinerts@1.30.3/deno.ts";

const vsCode = "^com.microsoft.VSCode$" as const;
const finder = "^com.apple.finder$" as const;
const ghostty = "^com.mitchellh.ghostty$" as const;
const teams = "^com.microsoft.teams2$" as const;
const figma = "^com.figma.Desktop$" as const;

/** Ctrl-only remapping */
const globalKeysToRemap: FromAndToKeyCode[] = [
	"a",
	"c",
	"d",
	"f",
	"i",
	"v",
	"w",
	"x",
	"z",
];

const ctrlShiftKeysToRemapToCmdShift: FromAndToKeyCode[] = [
	"b",
	"n",
	"o",
	"s",
	"r",
	"t",
	"equal_sign",
	"hyphen",
	"0",
];

const ctrlShiftKeysToRemapToAltShift: FromAndToKeyCode[] = [
	"left_arrow",
	"right_arrow",
	"up_arrow",
	"down_arrow",
];

const teamsKeysToRemap: FromAndToKeyCode[] = ["h", "m", "o"];

writeToProfile("Default profile", [
	rule("Ghostty Remapping").manipulators(
		[
			map("c", "left_control").to("c", "left_control"),
			map("r", "left_control").to("r", "left_control"),
			map("a", "left_control").to("a", "left_control"),
		].map((m) => m.condition(ifApp(ghostty))),
	),
	rule("Teams Remapping").manipulators(
		teamsKeysToRemap.map((key) =>
			map(key, "⌃⇧").to(key, "⌘⇧").condition(ifApp(teams)),
		),
	),
	rule("vsCode Remapping").manipulators(
		[
			// Intellisense
			map("spacebar", "left_control").to("i", "left_command"),
			// Toggle line comment
			map("/", "left_control").to("/", "command"),
			map("r", "left_control").to("r", "left_control"),
			map("a", "left_control").to("a", "left_control"),
		].map((m) => m.condition(ifApp(vsCode))),
	),
	rule("Windows Remapping").manipulators([
		// Remapping Ctrl + key to Cmd + key
		...globalKeysToRemap.map((key) =>
			map(key, "left_control").to(key, "left_command"),
		),
		...ctrlShiftKeysToRemapToCmdShift.map((key) =>
			map(key, "left_control", "shift").to(key, "left_command"),
		),
		...ctrlShiftKeysToRemapToAltShift.map((key) =>
			map(key, "left_control", "shift").to(key, "left_option"),
		),
		// Redo
		map("y", "left_control").to("z", "⌘⇧"),
		// Lock screen
		map("l", "left_option").to("q", "⌘⌃"),
		// Find and Replace
		map("h", "left_control").to("f", "⌘⌥"),
		// Ctrl + backspace or delete
		...(["delete_forward", "delete_or_backspace"] as const).map((key) =>
			map(key, "left_control").to(key, "option"),
		),
		// Rename file mapping
		map("f2")
			.to("return_or_enter")
			.condition(ifApp(finder)),
	]),
]);
