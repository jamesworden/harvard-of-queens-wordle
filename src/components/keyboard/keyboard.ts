import { LetterComparison, Status } from '../../utils';
import { game } from '../game';

class Keyboard {
	private deleteButton = document.getElementById('delete-button');
	private submitButton = document.getElementById('submit-button');
	private keys = document.getElementsByClassName('key');

	constructor() {
		this.initPhysicalBackspace();
		this.initPhysicalEnter();
		this.initPhysicalKeys();
		this.initVirtualBackspace();
		this.initVirtualEnter();
		this.initVirtualKeys();
	}

	getKey(letter: string) {
		for (const key of this.keys) {
			if (key.textContent === letter) {
				return key;
			}
		}
	}

	initVirtualKeys() {
		for (const key of this.keys) {
			key.addEventListener('click', () => {
				game.attemptType(key.innerHTML);
			});
		}
	}

	initVirtualBackspace() {
		this.deleteButton.addEventListener('click', () => {
			game.attemptBackspace();
		});
	}

	initVirtualEnter() {
		this.submitButton.addEventListener('click', () => {
			game.attemptGuess();
		});
	}

	initPhysicalEnter() {
		document.addEventListener('keypress', ({ key }) => {
			if (key === 'Enter') {
				game.attemptGuess();
			}
		});
	}

	initPhysicalKeys() {
		document.addEventListener('keydown', ({ key }) => {
			game.attemptType(key);
		});
	}

	initPhysicalBackspace() {
		document.addEventListener('keydown', ({ key }) => {
			if (key === 'Backspace') {
				game.attemptBackspace();
			}
		});
	}

	/**
	 * The keyboard will update keys with the highest level of correctness
	 * in the letter comparisons.
	 *
	 * TODO: this might not be the most efficent way of coloring the keyboard keys.
	 * It has time complexity of O(N^3); at least words aren't long.
	 */
	updateColors(letterComparisons: LetterComparison[]) {
		// Correct keys are colored last so they override the incorrect colors.
		this.updateColorsWithStatus(letterComparisons, Status.INCORRECT);
		this.updateColorsWithStatus(letterComparisons, Status.ELSEWHERE);
		this.updateColorsWithStatus(letterComparisons, Status.CORRECT);
	}

	// TODO: This should remove the current status of the key before adding a new status.
	updateColorsWithStatus(letterComparisons: LetterComparison[], status: Status) {
		for (const comparison of letterComparisons) {
			const key = this.getKey(comparison.letter);

			if (!key) {
				return;
			}

			if (comparison.status === status) {
				key.classList.add(status);
			}
		}
	}
}

export const keyboard = new Keyboard();
