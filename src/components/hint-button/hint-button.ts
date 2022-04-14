import { game } from '../game';
import { toastMessage } from '../toast-message';

class HintButton {
	private readonly self = document.getElementById('hint-button');

	constructor() {
		this.init();
	}

	init() {
		this.self.addEventListener('click', () => {
			this.showHint();
		});
	}

	showHint() {
		const hint = game.getTodaysHint();
		toastMessage.show(hint);
	}
}

export const hintButton = new HintButton();
