import TrackerBase from '@/base';

interface ConsoleInterface {
	apply(): void;
}

const REPORT_CMDS: Array<string> = [
	'error',
	'warning'
];

export default class TrackerConsole extends TrackerBase implements ConsoleInterface {
	public apply() {
		const console: Console = window.console;

		
	}
}
